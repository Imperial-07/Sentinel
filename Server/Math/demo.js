'use strict';

/**
 * demo.js — run with `node Math/demo.js` to sanity check the math layer.
 * Not needed by the server; delete it whenever you like.
 */

const Flood = require('./index');

const regions = [
  {
    id: 'R1',
    name: 'Riverside',
    areaKm2: 2.0,
    elevation: 8,
    waterLevel: 0.05,
    drainageCapacity: 12,
    infiltrationRate: 2,
    floodThreshold: 0.4,
    neighbors: [{ id: 'R2', width: 300, length: 800 }],
  },
  {
    id: 'R2',
    name: 'Downtown',
    areaKm2: 1.5,
    elevation: 10,
    waterLevel: 0.0,
    drainageCapacity: 25,
    infiltrationRate: 1,
    floodThreshold: 0.5,
    neighbors: [{ id: 'R3', width: 250, length: 600 }],
  },
  {
    id: 'R3',
    name: 'Uptown Hills',
    areaKm2: 3.0,
    elevation: 22,
    waterLevel: 0.0,
    drainageCapacity: 18,
    infiltrationRate: 6,
    floodThreshold: 0.6,
    neighbors: [{ id: 'R4', width: 200, length: 900 }],
  },
  {
    id: 'R4',
    name: 'Industrial Flats',
    areaKm2: 2.5,
    elevation: 6,
    waterLevel: 0.1,
    drainageCapacity: 8,
    infiltrationRate: 1,
    floodThreshold: 0.45,
    neighbors: [{ id: 'R1', width: 400, length: 700 }],
  },
];

// A storm: light, then heavy for a few hours, then easing off (mm/hr).
const storm = Flood.fromHourlySeries([5, 20, 60, 85, 70, 30, 10, 0, 0, 0, 0, 0]);

let state = Flood.normalizeState({ time: 0, regions });
const dt = 300; // 5 minutes
const steps = (12 * 3600) / dt;

console.log('edges:', state.edges.map((e) => `${e.from}->${e.to}`).join(', '));
console.log('suggested dt:', Flood.suggestTimestep(state.regions, state.edges), 's');
console.log('total storm rainfall:', Flood.totalRainfall(storm).toFixed(1), 'mm\n');

let result;
for (let i = 0; i < steps; i += 1) {
  result = Flood.stepSimulation(state, { dtSeconds: dt, rainfall: storm });
  state = result;

  if ((i + 1) % 24 === 0) {
    // every 2 hours
    const line = result.assessments
      .map((a) => `${a.id} ${(a.waterLevel * 100).toFixed(1)}cm ${a.level}(${a.score})`)
      .join(' | ');
    console.log(`t=${String(result.timeHours).padStart(4)}h  ${line}`);
  }
}

console.log('\nranked:', Flood.rankRegions(result.assessments).map((a) => `${a.id}:${a.score}`).join(', '));
console.log('summary:', JSON.stringify(result.summary, null, 2));

// --- conservation check: nothing should be created out of thin air -----------
const dry = Flood.normalizeState({
  regions: [
    { id: 'A', areaKm2: 1, elevation: 5, waterLevel: 1.0, drainageCapacity: 0, infiltrationRate: 0, floodThreshold: 2, neighbors: [{ id: 'B', width: 200, length: 500 }] },
    { id: 'B', areaKm2: 1, elevation: 5, waterLevel: 0.0, drainageCapacity: 0, infiltrationRate: 0, floodThreshold: 2 },
  ],
});
let closed = dry;
const before = Flood.totalVolume(closed.regions);
for (let i = 0; i < 500; i += 1) closed = Flood.stepSimulation(closed, { dtSeconds: 60, rainfall: 0 });
const after = Flood.totalVolume(closed.regions);
console.log(`\nclosed system: before=${before.toFixed(2)} m3  after=${after.toFixed(2)} m3  drift=${(after - before).toFixed(6)}`);
console.log('levels equalised to:', closed.regions.map((r) => r.waterLevel.toFixed(4)).join(' / '));
