'use strict';

/**
 * risk.js — turns water depths into the numbers the dashboard actually shows:
 * how full a region is, how fast it is rising, when it will flood, and a
 * single 0-100 risk score with a severity label.
 */

const { clamp, safeDiv, secondsToHours, round } = require('./units');

const LEVELS = ['SAFE', 'WATCH', 'WARNING', 'CRITICAL'];

const DEFAULTS = {
  horizonHours: 6, // how far ahead we care about
  referenceRise: 0.15, // m/hr treated as a "fast" rise
  weights: { fill: 0.5, rise: 0.2, urgency: 0.3 },
  thresholds: { watch: 35, warning: 65 },
};

/** 0 = dry, 1 = at the flood threshold, >1 = already over it. */
function fillRatio(depthM, thresholdM) {
  return safeDiv(Math.max(0, depthM), thresholdM, 0);
}

/** Rate of water level rise in metres per hour (negative = receding). */
function rateOfRise(previousDepthM, depthM, dtSeconds) {
  return safeDiv(depthM - previousDepthM, secondsToHours(dtSeconds), 0);
}

/** Hours until the region crosses its flood threshold. Infinity if never. */
function timeToFlood(depthM, thresholdM, riseRateMPerHr) {
  if (depthM >= thresholdM) return 0;
  if (riseRateMPerHr <= 1e-6) return Infinity;
  return (thresholdM - depthM) / riseRateMPerHr;
}

/** Converts "hours until flooding" into an urgency factor in [0,1]. */
function urgency(hoursToFlood, horizonHours = DEFAULTS.horizonHours) {
  if (!Number.isFinite(hoursToFlood)) return 0;
  return clamp(1 - hoursToFlood / horizonHours, 0, 1);
}

/**
 * Weighted 0-100 risk score.
 * Blends how full the region is, how fast it is filling, and how soon it tips over.
 */
function riskScore({ depth, threshold, riseRate, options = {} }) {
  const cfg = { ...DEFAULTS, ...options, weights: { ...DEFAULTS.weights, ...options.weights } };

  const fill = clamp(fillRatio(depth, threshold), 0, 1);
  const rise = clamp(safeDiv(riseRate, cfg.referenceRise, 0), 0, 1);
  const soon = urgency(timeToFlood(depth, threshold, riseRate), cfg.horizonHours);

  const score = 100 * (cfg.weights.fill * fill + cfg.weights.rise * rise + cfg.weights.urgency * soon);
  return clamp(score, 0, 100);
}

/** Label for a score. A region already past its threshold is always CRITICAL. */
function riskLevel(score, depth, threshold, options = {}) {
  const t = { ...DEFAULTS.thresholds, ...(options.thresholds || {}) };
  if (depth >= threshold) return 'CRITICAL';
  if (score >= t.warning) return 'WARNING';
  if (score >= t.watch) return 'WATCH';
  return 'SAFE';
}

/**
 * Full assessment for one region — this is the object you send to the frontend.
 */
function assessRegion(region, previousDepthM, dtSeconds, options = {}) {
  const depth = Math.max(0, region.waterLevel);
  const threshold = region.floodThreshold;
  const riseRate = rateOfRise(previousDepthM, depth, dtSeconds);
  const hoursToFlood = timeToFlood(depth, threshold, riseRate);
  const score = riskScore({ depth, threshold, riseRate, options });

  return {
    id: region.id,
    name: region.name || region.id,
    waterLevel: round(depth, 4),
    floodThreshold: threshold,
    fillRatio: round(fillRatio(depth, threshold), 3),
    riseRate: round(riseRate, 4), // m/hr
    hoursToFlood: Number.isFinite(hoursToFlood) ? round(hoursToFlood, 2) : null,
    score: round(score, 1),
    level: riskLevel(score, depth, threshold, options),
    flooded: depth >= threshold,
  };
}

/** Highest risk first — drives the "regions at risk" panel. */
function rankRegions(assessments) {
  return [...assessments].sort((a, b) => b.score - a.score || b.fillRatio - a.fillRatio);
}

/** City-wide roll-up for the dashboard header. */
function summarize(assessments) {
  const counts = Object.fromEntries(LEVELS.map((l) => [l, 0]));
  for (const a of assessments) counts[a.level] += 1;

  const ranked = rankRegions(assessments);
  const soonest = assessments
    .filter((a) => a.hoursToFlood !== null && !a.flooded)
    .sort((a, b) => a.hoursToFlood - b.hoursToFlood)[0];

  return {
    counts,
    flooded: assessments.filter((a) => a.flooded).map((a) => a.id),
    worst: ranked[0] || null,
    nextToFlood: soonest || null,
    averageScore: round(
      safeDiv(assessments.reduce((s, a) => s + a.score, 0), assessments.length, 0),
      1
    ),
  };
}

module.exports = {
  LEVELS,
  DEFAULTS,
  fillRatio,
  rateOfRise,
  timeToFlood,
  urgency,
  riskScore,
  riskLevel,
  assessRegion,
  rankRegions,
  summarize,
};
