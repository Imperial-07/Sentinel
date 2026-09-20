'use strict';

const hydrology = require('./hydrology');
const flow = require('./flow');
const risk = require('./risk');
const stepper = require('./stepper');
const { getBasin, listBasins } = require('./basins');

/**
 * Backward-compatible baseline regions (Mithi River).
 */
function getRegions(basinId = 'mithi') {
  const basin = getBasin(basinId);
  return JSON.parse(JSON.stringify(basin.regions));
}

/**
 * Main simulation conductor that runs the physical flood routing and hydrology model.
 * Supports multi-basin topology and realistic temporal storm progression.
 *
 * @param {Object} inputs
 *   - basinId: string ('mithi' | 'ulhas' | 'dahisar' | 'oshiwara')
 *   - rainfall: number (mm/h)
 *   - simulationHour: number (0-24)
 *   - drainageCapacity: optional override (mm/h)
 *   - regions: optional custom regions array
 * @returns {Object} Simulation results formatted for frontend dashboard and API clients
 */
function runSimulation(inputs = {}) {
  const basinId = inputs.basinId || inputs.basin || 'mithi';
  const basin = getBasin(basinId);

  const rainfall = typeof inputs.rainfall === 'number' ? Math.max(0, inputs.rainfall) : 9;
  const hour = typeof inputs.simulationHour === 'number' ? Math.max(0, inputs.simulationHour) : (inputs.hour || 1);
  const drainageOverride = inputs.drainageCapacity ? Number(inputs.drainageCapacity) : null;

  // Clone or build base regions
  let baseRegions = inputs.regions && Array.isArray(inputs.regions) && inputs.regions.length
    ? JSON.parse(JSON.stringify(inputs.regions))
    : getRegions(basinId);

  // Apply drainage capacity override if provided
  if (drainageOverride) {
    baseRegions = baseRegions.map((r) => ({ ...r, drainageCapacity: drainageOverride }));
  }

  // Set up initial normalized state
  let currentState = stepper.normalizeState({
    time: 0,
    regions: baseRegions,
  });

  // Calculate dynamic steps:
  // Each simulation hour accumulates physical storm duration (12 steps of 5 min per hour)
  // When hour=0, we run 1 baseline step.
  const dtSeconds = 300;
  const stepsToRun = hour === 0 ? 1 : Math.max(2, Math.min(72, hour * 6));

  // Run physical hydrology & lateral flow steps
  for (let i = 0; i < stepsToRun; i++) {
    currentState = stepper.stepSimulation(currentState, {
      dtSeconds,
      rainfall,
      model: 'manning',
      relaxation: 0.5,
    });
  }

  // Assess risk against the initial pre-storm baseline to capture cumulative rise rate accurately
  const preDepths = baseRegions.map((r) => r.waterLevel);
  const totalElapsedSeconds = Math.max(dtSeconds, stepsToRun * dtSeconds);
  const assessments = currentState.regions.map((r, i) =>
    risk.assessRegion(r, preDepths[i], totalElapsedSeconds, {
      referenceRise: 0.03, // 3 cm/h is significant in Mumbai urban catchments
      thresholds: { watch: 22, warning: 48 },
    })
  );

  const summary = risk.summarize(assessments);

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

  // River gauge level in meters:
  // Base 1.5m datum + dynamic response to average and bottleneck basin depths
  const maxWaterDepth = Math.max(...assessments.map((a) => a.waterLevel));
  const avgWaterDepth = assessments.reduce((sum, a) => sum + a.waterLevel, 0) / assessments.length;
  const riverLevel = Number((1.5 + avgWaterDepth * 2.2 + maxWaterDepth * 1.4).toFixed(1));

  // Overall risk determination
  let overallRisk = 'SAFE';
  if (criticalZones > 0 || summary.averageScore >= 50) {
    overallRisk = 'CRITICAL';
  } else if (warningZones > 0 || summary.averageScore >= 30) {
    overallRisk = 'WARNING';
  } else if (watchZones > 0 || summary.averageScore >= 15) {
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
    basinId: basin.id,
    basinName: basin.name,
    rainfall,
    simulationHour: hour,
    riverLevel,
    overallRisk,
    riskIndex: Math.round(summary.averageScore),
    riskLevel: overallRisk,
    waterStorage: Number(currentState.totalVolume.toFixed(2)),
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
  MUMBAI_REGIONS: getRegions('mithi'),
  getRegions,
  runSimulation,
  getBasin,
  listBasins,
};