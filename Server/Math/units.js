'use strict';

/**
 * units.js — unit conversions and small numeric helpers.
 *
 * Convention used everywhere in the Math layer:
 *   depth / water level / elevation : metres (m)
 *   area                            : square metres (m^2)
 *   rainfall & drainage rates       : millimetres per hour (mm/hr)
 *   time                            : seconds (s)
 *   discharge                       : cubic metres per second (m^3/s)
 */

const MM_PER_M = 1000;
const SECONDS_PER_HOUR = 3600;
const M2_PER_KM2 = 1e6;
const EPS = 1e-9;

function clamp(value, min, max) {
  if (!Number.isFinite(value)) return min;
  return Math.min(Math.max(value, min), max);
}

/** Division that never returns NaN/Infinity for a zero denominator. */
function safeDiv(numerator, denominator, fallback = 0) {
  return Math.abs(denominator) < EPS ? fallback : numerator / denominator;
}

function sign(x) {
  return x > 0 ? 1 : x < 0 ? -1 : 0;
}

function round(value, decimals = 4) {
  if (!Number.isFinite(value)) return value;
  const f = 10 ** decimals;
  return Math.round(value * f) / f;
}

const mmToM = (mm) => mm / MM_PER_M;
const mToMm = (m) => m * MM_PER_M;
const hoursToSeconds = (h) => h * SECONDS_PER_HOUR;
const secondsToHours = (s) => s / SECONDS_PER_HOUR;
const km2ToM2 = (km2) => km2 * M2_PER_KM2;

/**
 * A rate in mm/hr applied for dt seconds, expressed as a depth in metres.
 * e.g. 40 mm/hr for 900 s (15 min) -> 0.01 m
 */
function rateToDepth(ratePerHourMm, dtSeconds) {
  return mmToM(ratePerHourMm) * secondsToHours(dtSeconds);
}

const depthToVolume = (depthM, areaM2) => depthM * areaM2;
const volumeToDepth = (volumeM3, areaM2) => safeDiv(volumeM3, areaM2, 0);

module.exports = {
  MM_PER_M,
  SECONDS_PER_HOUR,
  M2_PER_KM2,
  EPS,
  clamp,
  safeDiv,
  sign,
  round,
  mmToM,
  mToMm,
  hoursToSeconds,
  secondsToHours,
  km2ToM2,
  rateToDepth,
  depthToVolume,
  volumeToDepth,
};
