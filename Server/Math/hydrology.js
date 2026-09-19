'use strict';



const { rateToDepth, clamp, safeDiv, secondsToHours } = require('./units');

function rainfallDepth(intensityMmPerHr, dtSeconds) {
  return rateToDepth(Math.max(0, intensityMmPerHr || 0), dtSeconds);
}


function drainEfficiency(depthM, surchargeDepthM = 0.5, minEfficiency = 0.3) {
  if (!surchargeDepthM || surchargeDepthM <= 0) return 1;
  if (depthM <= surchargeDepthM) return 1;
  const overload = (depthM - surchargeDepthM) / surchargeDepthM;
  return clamp(1 - 0.5 * overload, minEfficiency, 1);
}


function drainageDepth(capacityMmPerHr, dtSeconds, availableDepthM, efficiency = 1) {
  const capacity = rateToDepth(Math.max(0, capacityMmPerHr || 0), dtSeconds) * clamp(efficiency, 0, 1);
  return Math.min(capacity, Math.max(0, availableDepthM));
}


function infiltrationDepth(rateMmPerHr, dtSeconds, availableDepthM, saturation = 0) {
  const usable = rateToDepth(Math.max(0, rateMmPerHr || 0), dtSeconds) * (1 - clamp(saturation, 0, 1));
  return Math.min(usable, Math.max(0, availableDepthM));
}


function verticalBalance(region, intensityMmPerHr, dtSeconds) {
  const rain = rainfallDepth(intensityMmPerHr, dtSeconds);
  const afterRain = Math.max(0, region.waterLevel) + rain;

  const infiltration = infiltrationDepth(
    region.infiltrationRate,
    dtSeconds,
    afterRain,
    region.saturation
  );

  const remaining = afterRain - infiltration;
  const efficiency = drainEfficiency(remaining, region.surchargeDepth);
  const drainage = drainageDepth(region.drainageCapacity, dtSeconds, remaining, efficiency);

  return {
    rain,
    infiltration,
    drainage,
    net: rain - infiltration - drainage,
    efficiency,
  };
}

function fromHourlySeries(intensities) {
  return intensities.map((intensity, i) => ({ t: i * 3600, intensity }));
}


function rainfallAt(series, tSeconds) {
  if (typeof series === 'number') return series;
  if (!Array.isArray(series) || series.length === 0) return 0;
  if (tSeconds <= series[0].t) return series[0].intensity;

  const last = series[series.length - 1];
  if (tSeconds >= last.t) return last.intensity;

  for (let i = 1; i < series.length; i += 1) {
    const a = series[i - 1];
    const b = series[i];
    if (tSeconds <= b.t) {
      const f = safeDiv(tSeconds - a.t, b.t - a.t, 0);
      return a.intensity + f * (b.intensity - a.intensity);
    }
  }
  return last.intensity;
}

function totalRainfall(series, fromSeconds = 0, toSeconds = Infinity) {
  if (!Array.isArray(series) || series.length === 0) return 0;
  const end = Math.min(toSeconds, series[series.length - 1].t);
  if (end <= fromSeconds) return 0;

  const steps = 200;
  const dt = (end - fromSeconds) / steps;
  let total = 0;
  for (let i = 0; i < steps; i += 1) {
    const a = rainfallAt(series, fromSeconds + i * dt);
    const b = rainfallAt(series, fromSeconds + (i + 1) * dt);
    total += ((a + b) / 2) * secondsToHours(dt);
  }
  return total;
}

module.exports = {
  rainfallDepth,
  drainEfficiency,
  drainageDepth,
  infiltrationDepth,
  verticalBalance,
  fromHourlySeries,
  rainfallAt,
  totalRainfall,
};
