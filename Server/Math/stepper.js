'use strict';

/**
 * stepper.js — one timestep of the flood model, as a pure function.
 *
 *   stepSimulation(state, options) -> next state (the input is never mutated)
 *
 * SimulationEngine.js just calls this in a loop and streams the result.
 */

const { clamp, safeDiv, km2ToM2, round, secondsToHours } = require('./units');
const { verticalBalance, rainfallAt } = require('./hydrology');
const { edgesFromRegions, computeExchanges } = require('./flow');
const { assessRegion, summarize } = require('./risk');

const REGION_DEFAULTS = {
  elevation: 0, // m above datum
  waterLevel: 0, // m of standing water
  drainageCapacity: 10, // mm/hr the drains can take away
  infiltrationRate: 3, // mm/hr soaking into the ground
  saturation: 0, // 0 dry .. 1 saturated
  surchargeDepth: 0.5, // m past which drains start failing
  floodThreshold: 0.5, // m depth counted as "flooded"
  area: 1e6, // m^2 (1 km^2)
};

/** Fills in defaults and accepts `areaKm2` as a friendlier input than `area`. */
function normalizeRegion(region) {
  const area = region.areaKm2 != null ? km2ToM2(region.areaKm2) : region.area;
  return {
    ...REGION_DEFAULTS,
    ...region,
    area: area ?? REGION_DEFAULTS.area,
    waterLevel: Math.max(0, region.waterLevel ?? REGION_DEFAULTS.waterLevel),
    neighbors: region.neighbors || [],
  };
}

/** Normalizes the whole state once, before the loop starts. */
function normalizeState(state) {
  const regions = (state.regions || []).map(normalizeRegion);
  return {
    time: state.time ?? 0,
    regions,
    edges: state.edges && state.edges.length ? state.edges : edgesFromRegions(regions),
  };
}

/**
 * Rainfall can be given as:
 *   a number                          -> same intensity everywhere, constant
 *   [{t, intensity}]                  -> same time series everywhere
 *   { R1: 40, R2: [{t,intensity}] }   -> per region
 *   (regionId, tSeconds) => number    -> anything you like
 */
function resolveIntensity(rainfall, regionId, tSeconds) {
  if (rainfall == null) return 0;
  if (typeof rainfall === 'function') return rainfall(regionId, tSeconds) || 0;
  if (typeof rainfall === 'number') return rainfall;
  if (Array.isArray(rainfall)) return rainfallAt(rainfall, tSeconds);

  const perRegion = rainfall[regionId] ?? rainfall.default ?? 0;
  return typeof perRegion === 'number' ? perRegion : rainfallAt(perRegion, tSeconds);
}

/** Total water currently stored across the city (m^3) — handy for sanity checks. */
function totalVolume(regions) {
  return regions.reduce((sum, r) => sum + Math.max(0, r.waterLevel) * r.area, 0);
}

/**
 * A safe timestep. Large cells and gentle flows tolerate big steps; small cells
 * with fast exchange need smaller ones or the explicit scheme oscillates.
 */
function suggestTimestep(regions, edges, { maxDt = 900, minDt = 30 } = {}) {
  if (!regions.length) return maxDt;
  const smallestArea = Math.min(...regions.map((r) => r.area));
  const connections = Math.max(1, edges.length);
  const dt = clamp(smallestArea / (connections * 200), minDt, maxDt);
  return Math.round(dt);
}

/**
 * Advance the simulation by one timestep.
 *
 * @param {{time:number, regions:Array, edges?:Array}} state
 * @param {object} options
 *   dtSeconds  timestep length (default 300 = 5 min)
 *   rainfall   see resolveIntensity above
 *   model      'manning' (default) or 'linear'
 *   relaxation 0..1 damping on inter-region flow (default 0.5)
 * @returns {{time, regions, edges, fluxes, balance, assessments, summary, totalVolume}}
 */
function stepSimulation(state, options = {}) {
  const dt = options.dtSeconds ?? 300;
  const current = state.edges ? state : normalizeState(state);
  const { regions, edges } = current;
  const time = current.time ?? 0;

  // 1. Vertical: rain in, infiltration and drainage out.
  const balance = regions.map((r) => verticalBalance(r, resolveIntensity(options.rainfall, r.id, time), dt));
  const interim = regions.map((r, i) => ({
    ...r,
    waterLevel: Math.max(0, r.waterLevel + balance[i].net),
  }));

  // 2. Lateral: water redistributes between connected regions.
  const { fluxes, deltaDepth } = computeExchanges(interim, edges, dt, options);
  const next = interim.map((r) => ({
    ...r,
    waterLevel: Math.max(0, r.waterLevel + (deltaDepth.get(r.id) || 0)),
  }));

  // 3. Assess risk against the previous depths.
  const assessments = next.map((r, i) => assessRegion(r, regions[i].waterLevel, dt, options));

  return {
    time: time + dt,
    timeHours: round(secondsToHours(time + dt), 3),
    regions: next,
    edges,
    fluxes,
    balance: regions.map((r, i) => ({
      id: r.id,
      rain: round(balance[i].rain, 5),
      infiltration: round(balance[i].infiltration, 5),
      drainage: round(balance[i].drainage, 5),
      net: round(balance[i].net, 5),
      drainEfficiency: round(balance[i].efficiency, 3),
    })),
    assessments,
    summary: summarize(assessments),
    totalVolume: round(totalVolume(next), 2),
  };
}

module.exports = {
  REGION_DEFAULTS,
  normalizeRegion,
  normalizeState,
  resolveIntensity,
  totalVolume,
  suggestTimestep,
  stepSimulation,
};
