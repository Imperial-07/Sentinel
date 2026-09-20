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

  // Catchment runoff concentration factor:
  // Urban catchments have 1:1 local area.
  // Regional river basins & dam watersheds concentrate overland tributary flows into the central channel.
  let effectiveRainfall = rainfall;
  const isLargeBasin = basin.category === 'national_river' || basin.category === 'dam';
  if (isLargeBasin) {
    const stormIntensityFactor = Math.max(1.0, rainfall / 15);
    const catchmentKm2 = basin.catchmentAreaKm2 || 10000;
    const concentrationMultiplier = rainfall <= 15
      ? 1.0
      : Math.min(3.4, 1.2 + Math.log10(catchmentKm2 / 100) * 0.40 * Math.min(1.6, stormIntensityFactor));
    effectiveRainfall = rainfall * concentrationMultiplier;
  }

  // Run physical hydrology & lateral flow steps
  for (let i = 0; i < stepsToRun; i++) {
    currentState = stepper.stepSimulation(currentState, {
      dtSeconds,
      rainfall: effectiveRainfall,
      model: 'manning',
      relaxation: 0.5,
    });
  }

  // If this system is a Dam, compute dynamic reservoir mass-balance and spillway operations
  let damMetrics = null;
  if (basin.category === 'dam' && basin.damSpecs) {
    const specs = basin.damSpecs;
    const catchmentArea = basin.catchmentAreaKm2 || 50000;

    // Inflow Qin (cusecs) scales with rainfall intensity and catchment size
    const runOffCoeff = 0.45;
    const baseInflow = specs.inflowCusecs || 15000;
    const stormInflow = Math.round(rainfall * (catchmentArea * 0.05) * 8.5 * runOffCoeff);
    const totalInflowCusecs = baseInflow + stormInflow;

    // Mass balance: delta storage accumulated over storm hours
    const effectiveHours = Math.max(1, hour);
    const liveCap = specs.liveStorageMm3;
    const frl = specs.frl;
    const mddl = specs.mddl || (frl - 25);
    const initialLevel = specs.currentLevel || (frl - 4);

    // Rate of reservoir level rise
    let currentLevel = initialLevel + (rainfall * 0.035 * Math.sqrt(effectiveHours));

    let openGates = 0;
    let totalOutflowCusecs = specs.outflowCusecs || 8000;
    let damStatus = 'NORMAL';
    let spillwayAlert = null;

    if (currentLevel >= frl) {
      currentLevel = frl + 0.15;
      openGates = specs.gateCount;
      totalOutflowCusecs = Math.round(totalInflowCusecs * 1.1);
      damStatus = 'EMERGENCY_DISCHARGE';
      spillwayAlert = `EMERGENCY: Reservoir at FRL (${frl}m). All ${openGates} gates open discharging ${totalOutflowCusecs.toLocaleString()} cusecs into downstream river!`;
    } else if (currentLevel >= frl - 1.5) {
      openGates = Math.max(1, Math.round(specs.gateCount * 0.7));
      totalOutflowCusecs = Math.round(totalInflowCusecs * 0.95);
      damStatus = 'CONTROLLED_SPILL';
      spillwayAlert = `WARNING: Reservoir approaching FRL (${currentLevel.toFixed(2)}m / ${frl}m). ${openGates} of ${specs.gateCount} gates open discharging ${totalOutflowCusecs.toLocaleString()} cusecs.`;
    } else if (currentLevel >= frl - 3.5 && rainfall > 25) {
      openGates = Math.max(1, Math.round(specs.gateCount * 0.3));
      totalOutflowCusecs = Math.round(totalInflowCusecs * 0.6);
      damStatus = 'PRECAUTIONARY_DISCHARGE';
      spillwayAlert = `ADVISORY: Advance flood moderation release. ${openGates} gates active discharging ${totalOutflowCusecs.toLocaleString()} cusecs.`;
    }

    const currentLiveStorageMm3 = Math.min(liveCap, Math.round(liveCap * ((currentLevel - mddl) / (frl - mddl))));
    const liveStoragePercent = Math.min(100, Math.max(10, Math.round((currentLiveStorageMm3 / liveCap) * 100)));

    damMetrics = {
      isDam: true,
      river: specs.river,
      state: specs.state,
      frl: specs.frl,
      mddl: specs.mddl,
      crestLevel: specs.crestLevel || specs.frl,
      currentLevel: Number(currentLevel.toFixed(2)),
      grossCapacityMm3: specs.grossCapacityMm3,
      liveStorageMm3: currentLiveStorageMm3,
      liveStoragePercent,
      gateCount: specs.gateCount,
      openGates,
      inflowCusecs: totalInflowCusecs,
      outflowCusecs: totalOutflowCusecs,
      status: damStatus,
      spillwayAlert,
    };

    // Spillway discharge surcharge on downstream reaches
    if (openGates > 0) {
      const gateRatio = openGates / specs.gateCount;
      const spillwaySurge = Number((gateRatio * 0.45 * Math.sqrt(Math.max(1, hour))).toFixed(4));
      currentState.regions = currentState.regions.map((r) => {
        if (!r.isReservoir) {
          return {
            ...r,
            waterLevel: Number((r.waterLevel + spillwaySurge).toFixed(4)),
          };
        }
        return r;
      });
    }
  }

  // Assess risk against the initial pre-storm baseline to capture cumulative rise rate accurately
  const preDepths = baseRegions.map((r) => r.waterLevel);
  const totalElapsedSeconds = Math.max(dtSeconds, stepsToRun * dtSeconds);
  const assessments = currentState.regions.map((r, i) =>
    risk.assessRegion(r, preDepths[i], totalElapsedSeconds, {
      horizonHours: isLargeBasin ? 18 : 6,
      referenceRise: isLargeBasin ? 0.10 : 0.03,
      thresholds: isLargeBasin
        ? { watch: 44, warning: 60, critical: 78 }
        : { watch: 22, warning: 46, critical: 75 },
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
  const maxWaterDepth = Math.max(...assessments.map((a) => a.waterLevel));
  const avgWaterDepth = assessments.reduce((sum, a) => sum + a.waterLevel, 0) / assessments.length;
  const riverLevel = isLargeBasin
    ? Number((avgWaterDepth * 1.5 + maxWaterDepth * 0.8).toFixed(1))
    : Number((1.5 + avgWaterDepth * 2.2 + maxWaterDepth * 1.4).toFixed(1));

  // Overall risk determination:
  // Primary driver is active hazardous zones, with average score as secondary severity indicator.
  let overallRisk = 'SAFE';
  if (criticalZones > 0 || (warningZones >= 2 && summary.averageScore >= 60) || summary.averageScore >= 70) {
    overallRisk = 'CRITICAL';
  } else if (warningZones > 0 || (watchZones >= 2 && summary.averageScore >= (isLargeBasin ? 45 : 30)) || summary.averageScore >= 45) {
    overallRisk = 'WARNING';
  } else if (watchZones > 0 || activeZones > 0) {
    overallRisk = 'WATCH';
  } else {
    overallRisk = 'SAFE';
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
    category: basin.category || 'urban',
    damMetrics,
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