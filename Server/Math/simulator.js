'use strict';

const hydrology = require('./hydrology');
const flow = require('./flow');
const risk = require('./risk');
const stepper = require('./stepper');

/**
 * Calibrated Mumbai Mithi River Catchment topological network.
 * Water flows: Powai -> Saki Naka -> Kurla -> BKC -> Dharavi -> Mahim (Arabian Sea).
 */
const MUMBAI_REGIONS = [
  {
    id: 'powai',
    name: 'Powai',
    lat: 19.1197,
    lng: 72.9051,
    areaKm2: 2.5,
    elevation: 34,
    waterLevel: 0.05,
    drainageCapacity: 18,
    infiltrationRate: 4,
    floodThreshold: 1.2,
    surchargeDepth: 0.8,
    neighbors: [{ id: 'saki-naka', width: 25, length: 2500, roughness: 0.035 }],
  },
  {
    id: 'saki-naka',
    name: 'Saki Naka',
    lat: 19.1074,
    lng: 72.8846,
    areaKm2: 2.0,
    elevation: 22,
    waterLevel: 0.03,
    drainageCapacity: 20,
    infiltrationRate: 2,
    floodThreshold: 0.8,
    surchargeDepth: 0.5,
    neighbors: [{ id: 'kurla', width: 35, length: 3200, roughness: 0.040 }],
  },
  {
    id: 'kurla',
    name: 'Kurla',
    lat: 19.0726,
    lng: 72.8845,
    areaKm2: 2.8,
    elevation: 10,
    waterLevel: 0.08,
    drainageCapacity: 14,
    infiltrationRate: 1.5,
    floodThreshold: 0.55,
    surchargeDepth: 0.35,
    neighbors: [{ id: 'bkc', width: 45, length: 2000, roughness: 0.038 }],
  },
  {
    id: 'bkc',
    name: 'BKC',
    lat: 19.0668,
    lng: 72.8686,
    areaKm2: 3.2,
    elevation: 7,
    waterLevel: 0.04,
    drainageCapacity: 26,
    infiltrationRate: 2,
    floodThreshold: 0.7,
    surchargeDepth: 0.45,
    neighbors: [{ id: 'dharavi', width: 50, length: 1800, roughness: 0.035 }],
  },
  {
    id: 'dharavi',
    name: 'Dharavi',
    lat: 19.0410,
    lng: 72.8493,
    areaKm2: 2.2,
    elevation: 4,
    waterLevel: 0.09,
    drainageCapacity: 15,
    infiltrationRate: 1.0,
    floodThreshold: 0.5,
    surchargeDepth: 0.3,
    neighbors: [{ id: 'mahim', width: 65, length: 1500, roughness: 0.032 }],
  },
  {
    id: 'mahim',
    name: 'Mahim',
    lat: 19.0410,
    lng: 72.8397,
    areaKm2: 1.8,
    elevation: 2,
    waterLevel: 0.03,
    drainageCapacity: 35,
    infiltrationRate: 3,
    floodThreshold: 0.9,
    surchargeDepth: 0.6,
    neighbors: [],
  },
];

/**
 * Returns a cloned baseline configuration of Mumbai monitoring regions.
 */
function getRegions() {
  return JSON.parse(JSON.stringify(MUMBAI_REGIONS));
}

/**
 * Main simulation conductor that runs the full physical flood routing and hydrology model.
 * @param {Object} inputs
 *   - rainfall: number (mm/h)
 *   - simulationHour: number (0-24)
 *   - drainageCapacity: optional override (mm/h)
 *   - regions: optional custom regions array
 * @returns {Object} Simulation results formatted for frontend dashboard and API clients
 */
function runSimulation(inputs = {}) {
  const rainfall = typeof inputs.rainfall === 'number' ? Math.max(0, inputs.rainfall) : 9;
  const hour = typeof inputs.simulationHour === 'number' ? Math.max(0, inputs.simulationHour) : (inputs.hour || 1);
  const drainageOverride = inputs.drainageCapacity ? Number(inputs.drainageCapacity) : null;

  // Clone or build base regions
  let baseRegions = inputs.regions && Array.isArray(inputs.regions) && inputs.regions.length
    ? JSON.parse(JSON.stringify(inputs.regions))
    : getRegions();

  // Apply drainage capacity override if provided
  if (drainageOverride) {
    baseRegions = baseRegions.map((r) => ({ ...r, drainageCapacity: drainageOverride }));
  }

  // Set up initial state
  let currentState = stepper.normalizeState({
    time: 0,
    regions: baseRegions,
  });

  // Calculate number of timesteps: e.g. 5-min intervals (300s)
  // Run at least 1 step, or steps proportional to hour/storm duration
  const dtSeconds = 300;
  const stepsToRun = Math.max(1, Math.min(48, Math.round((Math.max(1, hour) * 3600) / (dtSeconds * 4))));

  // Run simulation steps
  for (let i = 0; i < stepsToRun; i++) {
    currentState = stepper.stepSimulation(currentState, {
      dtSeconds,
      rainfall,
      model: 'manning',
      relaxation: 0.5,
    });
  }

  const { assessments, summary, totalVolume } = currentState;

  // Match coordinates and names back to assessments
  const enrichedRegions = assessments.map((assessment) => {
    const base = baseRegions.find((r) => r.id === assessment.id) || {};
    return {
      ...assessment,
      lat: base.lat,
      lng: base.lng,
      drainageCapacity: base.drainageCapacity,
      elevation: base.elevation,
    };
  });

  // Determine active and critical zones
  const activeZones = assessments.filter((a) => a.level !== 'SAFE').length;
  const criticalZones = assessments.filter((a) => a.level === 'CRITICAL').length;
  const warningZones = assessments.filter((a) => a.level === 'WARNING').length;
  const watchZones = assessments.filter((a) => a.level === 'WATCH').length;
  const safeZones = assessments.filter((a) => a.level === 'SAFE').length;

  // River gauge level in meters (base 1.5m + impact of maximum depth in critical basin)
  const maxWaterDepth = Math.max(...assessments.map((a) => a.waterLevel));
  const avgWaterDepth = assessments.reduce((sum, a) => sum + a.waterLevel, 0) / assessments.length;
  const riverLevel = Number((1.5 + avgWaterDepth * 1.5 + maxWaterDepth * 0.8).toFixed(1));

  // Overall risk determination
  let overallRisk = 'SAFE';
  if (criticalZones > 0 || summary.averageScore >= 65) {
    overallRisk = 'CRITICAL';
  } else if (warningZones > 0 || summary.averageScore >= 45) {
    overallRisk = 'WARNING';
  } else if (watchZones > 0 || summary.averageScore >= 20) {
    overallRisk = 'WATCH';
  }

  // Calculate overflow volume (m3 exceeding flood threshold)
  let totalOverflow = 0;
  for (const a of assessments) {
    const regionObj = currentState.regions.find((r) => r.id === a.id);
    if (a.waterLevel > a.floodThreshold && regionObj) {
      totalOverflow += (a.waterLevel - a.floodThreshold) * regionObj.area;
    }
  }

  return {
    rainfall,
    simulationHour: hour,
    riverLevel,
    overallRisk,
    riskIndex: Math.round(summary.averageScore),
    riskLevel: overallRisk,
    waterStorage: Number(totalVolume.toFixed(2)),
    overflow: Number(totalOverflow.toFixed(2)),
    stats: {
      activeZones,
      criticalZones,
      warningZones,
      watchZones,
      safeZones,
    },
    regions: enrichedRegions,
    fluxes: currentState.fluxes || [],
    summary,
  };
}

module.exports = {
  MUMBAI_REGIONS,
  getRegions,
  runSimulation,
};