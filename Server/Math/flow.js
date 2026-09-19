'use strict';


const { clamp, safeDiv, sign, volumeToDepth, EPS } = require('./units');


function hydraulicHead(elevation, waterLevel) {
  return elevation + Math.max(0, waterLevel);
}


function effectiveFlowDepth(headA, headB, bedA, bedB) {
  return Math.max(0, Math.max(headA, headB) - Math.max(bedA, bedB));
}


function manningFlux({ headA, headB, bedA, bedB, width = 100, length = 500, roughness = 0.035 }) {
  const dh = headA - headB;
  if (Math.abs(dh) < EPS) return 0;

  const hFlow = effectiveFlowDepth(headA, headB, bedA, bedB);
  if (hFlow <= EPS) return 0;

  const slope = Math.abs(dh) / Math.max(length, EPS);
  const q = (width / Math.max(roughness, 1e-3)) * hFlow ** (5 / 3) * Math.sqrt(slope);
  return sign(dh) * q;
}


function linearFlux({ headA, headB, conductance = 5 }) {
  return conductance * (headA - headB);
}


function limitTransfer(volumeM3, donor, receiver, headDiff, relaxation = 0.5) {
  const levelling = safeDiv(
    Math.abs(headDiff),
    1 / Math.max(donor.area, EPS) + 1 / Math.max(receiver.area, EPS),
    0
  );
  const available = Math.max(0, donor.waterLevel) * donor.area;
  const capped = Math.min(Math.abs(volumeM3), relaxation * levelling, available);
  return sign(volumeM3) * Math.max(0, capped);
}


function edgesFromRegions(regions) {
  const seen = new Set();
  const edges = [];

  for (const region of regions) {
    for (const neighbor of region.neighbors || []) {
      const spec = typeof neighbor === 'string' ? { id: neighbor } : neighbor;
      const target = spec.id ?? spec.to;
      if (!target) continue;

      const key = [region.id, target].sort().join('::');
      if (seen.has(key)) continue;
      seen.add(key);

      edges.push({
        from: region.id,
        to: target,
        width: spec.width,
        length: spec.length,
        roughness: spec.roughness,
        conductance: spec.conductance,
      });
    }
  }
  return edges;
}


function computeExchanges(regions, edges, dtSeconds, options = {}) {
  const { model = 'manning', relaxation = 0.5, roughness = 0.035 } = options;

  const byId = new Map(regions.map((r) => [r.id, r]));
  const raw = [];


  for (const edge of edges) {
    const A = byId.get(edge.from);
    const B = byId.get(edge.to);
    if (!A || !B) continue;

    const headA = hydraulicHead(A.elevation, A.waterLevel);
    const headB = hydraulicHead(B.elevation, B.waterLevel);

    const discharge =
      model === 'linear'
        ? linearFlux({ headA, headB, conductance: edge.conductance })
        : manningFlux({
            headA,
            headB,
            bedA: A.elevation,
            bedB: B.elevation,
            width: edge.width,
            length: edge.length,
            roughness: edge.roughness ?? roughness,
          });

    if (Math.abs(discharge) < EPS) continue;

    const donor = discharge > 0 ? A : B;
    const receiver = discharge > 0 ? B : A;
    const volume = limitTransfer(discharge * dtSeconds, donor, receiver, headA - headB, relaxation);
    if (Math.abs(volume) < EPS) continue;

    raw.push({ from: edge.from, to: edge.to, donorId: donor.id, volume });
  }

  
  const outflow = new Map();
  for (const f of raw) {
    outflow.set(f.donorId, (outflow.get(f.donorId) || 0) + Math.abs(f.volume));
  }

  const scale = new Map();
  for (const [id, total] of outflow) {
    const region = byId.get(id);
    const available = Math.max(0, region.waterLevel) * region.area;
    scale.set(id, total > available ? safeDiv(available, total, 0) : 1);
  }

 
  const deltaDepth = new Map(regions.map((r) => [r.id, 0]));
  const fluxes = [];

  for (const f of raw) {
    const volume = f.volume * clamp(scale.get(f.donorId) ?? 1, 0, 1);
    if (Math.abs(volume) < EPS) continue;

    const A = byId.get(f.from);
    const B = byId.get(f.to);

    deltaDepth.set(f.from, deltaDepth.get(f.from) - volumeToDepth(volume, A.area));
    deltaDepth.set(f.to, deltaDepth.get(f.to) + volumeToDepth(volume, B.area));

    fluxes.push({
      from: f.from,
      to: f.to,
      volume,
      discharge: safeDiv(volume, dtSeconds, 0),
    });
  }

  return { fluxes, deltaDepth };
}

module.exports = {
  hydraulicHead,
  effectiveFlowDepth,
  manningFlux,
  linearFlux,
  limitTransfer,
  edgesFromRegions,
  computeExchanges,
};
