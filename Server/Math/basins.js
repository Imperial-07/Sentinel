'use strict';

/**
 * Real Catchment Basins of Mumbai Metropolitan Region (MMR).
 * Calibrated with real geographic coordinates, elevations, flow paths, and channel geometries.
 */
const BASINS = {
  mithi: {
    id: 'mithi',
    name: 'Mithi River Basin',
    description: 'Central Mumbai industrial and airport corridor discharging into Mahim Bay',
    center: [19.076, 72.872],
    defaultZoom: 12,
    catchmentAreaKm2: 108,
    channelLengthKm: 17.8,
    riverChannel: [
      [19.1270, 72.9100], // Powai Lake upstream weir
      [19.1197, 72.9051], // Powai
      [19.1145, 72.8965], // Marol corridor
      [19.1074, 72.8846], // Saki Naka junction
      [19.0980, 72.8815], // Airport East culvert
      [19.0880, 72.8835], // Bail Bazar
      [19.0726, 72.8845], // Kurla West (low basin depression)
      [19.0668, 72.8686], // BKC channel
      [19.0550, 72.8580], // Kalanagar
      [19.0435, 72.8510], // Dharavi inlet
      [19.0410, 72.8493], // Dharavi
      [19.0410, 72.8397], // Mahim Creek
      [19.0380, 72.8310], // Mahim Bay (discharge into Arabian Sea)
    ],
    regions: [
      {
        id: 'powai',
        name: 'Powai',
        lat: 19.1197,
        lng: 72.9051,
        areaKm2: 2.5,
        elevation: 34,
        waterLevel: 0.05,
        drainageCapacity: 22,
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
        drainageCapacity: 24,
        infiltrationRate: 2,
        floodThreshold: 0.85,
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
        drainageCapacity: 16,
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
        drainageCapacity: 30,
        infiltrationRate: 2,
        floodThreshold: 0.75,
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
        drainageCapacity: 18,
        infiltrationRate: 1.0,
        floodThreshold: 0.50,
        surchargeDepth: 0.30,
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
        drainageCapacity: 40,
        infiltrationRate: 3,
        floodThreshold: 0.90,
        surchargeDepth: 0.60,
        neighbors: [],
      },
    ],
  },

  ulhas: {
    id: 'ulhas',
    name: 'Ulhas River Basin',
    description: 'Major Eastern Metropolitan drainage from Sahyadri foothills through Thane Estuary',
    center: [19.235, 73.085],
    defaultZoom: 11,
    catchmentAreaKm2: 4637,
    channelLengthKm: 122,
    riverChannel: [
      [19.1663, 73.2370], // Badlapur Barrage
      [19.1850, 73.1820], // Ambernath East
      [19.2210, 73.1550], // Ulhasnagar
      [19.2437, 73.1355], // Kalyan Creek junction
      [19.2183, 73.0867], // Dombivli lowlands
      [19.1890, 73.0450], // Diva Junction
      [19.1982, 72.9781], // Kalwa / Thane Creek
      [19.1550, 72.9980], // Airoli Bridge / Thane Estuary
    ],
    regions: [
      {
        id: 'badlapur',
        name: 'Badlapur',
        lat: 19.1663,
        lng: 73.2370,
        areaKm2: 4.8,
        elevation: 44,
        waterLevel: 0.08,
        drainageCapacity: 28,
        infiltrationRate: 5,
        floodThreshold: 1.6,
        surchargeDepth: 1.0,
        neighbors: [{ id: 'ulhasnagar', width: 55, length: 7500, roughness: 0.038 }],
      },
      {
        id: 'ulhasnagar',
        name: 'Ulhasnagar',
        lat: 19.2210,
        lng: 73.1550,
        areaKm2: 5.2,
        elevation: 25,
        waterLevel: 0.06,
        drainageCapacity: 22,
        infiltrationRate: 2.5,
        floodThreshold: 1.1,
        surchargeDepth: 0.6,
        neighbors: [{ id: 'kalyan', width: 70, length: 4200, roughness: 0.036 }],
      },
      {
        id: 'kalyan',
        name: 'Kalyan Creek',
        lat: 19.2437,
        lng: 73.1355,
        areaKm2: 6.5,
        elevation: 9,
        waterLevel: 0.12,
        drainageCapacity: 18,
        infiltrationRate: 1.2,
        floodThreshold: 0.70,
        surchargeDepth: 0.40,
        neighbors: [{ id: 'dombivli', width: 85, length: 4800, roughness: 0.034 }],
      },
      {
        id: 'dombivli',
        name: 'Dombivli',
        lat: 19.2183,
        lng: 73.0867,
        areaKm2: 4.5,
        elevation: 8,
        waterLevel: 0.10,
        drainageCapacity: 17,
        infiltrationRate: 1.5,
        floodThreshold: 0.65,
        surchargeDepth: 0.38,
        neighbors: [{ id: 'diva', width: 90, length: 3500, roughness: 0.032 }],
      },
      {
        id: 'diva',
        name: 'Diva Junction',
        lat: 19.1890,
        lng: 73.0450,
        areaKm2: 3.8,
        elevation: 6,
        waterLevel: 0.09,
        drainageCapacity: 20,
        infiltrationRate: 1.8,
        floodThreshold: 0.60,
        surchargeDepth: 0.35,
        neighbors: [{ id: 'thane-estuary', width: 120, length: 6000, roughness: 0.030 }],
      },
      {
        id: 'thane-estuary',
        name: 'Thane Estuary',
        lat: 19.1982,
        lng: 72.9781,
        areaKm2: 8.0,
        elevation: 3,
        waterLevel: 0.05,
        drainageCapacity: 45,
        infiltrationRate: 3.5,
        floodThreshold: 1.2,
        surchargeDepth: 0.70,
        neighbors: [],
      },
    ],
  },

  dahisar: {
    id: 'dahisar',
    name: 'Dahisar River Basin',
    description: 'Northern Mumbai catchment originating in SGNP and entering Gorai Creek',
    center: [19.245, 72.860],
    defaultZoom: 13,
    catchmentAreaKm2: 34.8,
    channelLengthKm: 12.0,
    riverChannel: [
      [19.2315, 72.9150], // SGNP Tulsi Lake watershed
      [19.2410, 72.8870], // Dahisar East SGNP Gate
      [19.2475, 72.8680], // Western Express Highway Culvert
      [19.2520, 72.8530], // Dahisar West Bridge
      [19.2505, 72.8390], // Kandar Pada marsh
      [19.2430, 72.8220], // Gorai Creek (Arabian Sea inlet)
    ],
    regions: [
      {
        id: 'sgnp-upper',
        name: 'SGNP Forest',
        lat: 19.2315,
        lng: 72.9150,
        areaKm2: 5.5,
        elevation: 65,
        waterLevel: 0.04,
        drainageCapacity: 35,
        infiltrationRate: 8,
        floodThreshold: 1.8,
        surchargeDepth: 1.2,
        neighbors: [{ id: 'dahisar-east', width: 20, length: 2800, roughness: 0.042 }],
      },
      {
        id: 'dahisar-east',
        name: 'Dahisar East',
        lat: 19.2410,
        lng: 72.8870,
        areaKm2: 2.4,
        elevation: 24,
        waterLevel: 0.05,
        drainageCapacity: 22,
        infiltrationRate: 2.5,
        floodThreshold: 0.90,
        surchargeDepth: 0.55,
        neighbors: [{ id: 'weh-culvert', width: 28, length: 2100, roughness: 0.038 }],
      },
      {
        id: 'weh-culvert',
        name: 'WEH Culvert',
        lat: 19.2475,
        lng: 72.8680,
        areaKm2: 2.1,
        elevation: 12,
        waterLevel: 0.08,
        drainageCapacity: 16,
        infiltrationRate: 1.4,
        floodThreshold: 0.58,
        surchargeDepth: 0.35,
        neighbors: [{ id: 'dahisar-west', width: 35, length: 1600, roughness: 0.035 }],
      },
      {
        id: 'dahisar-west',
        name: 'Dahisar West',
        lat: 19.2520,
        lng: 72.8530,
        areaKm2: 2.6,
        elevation: 7,
        waterLevel: 0.07,
        drainageCapacity: 20,
        infiltrationRate: 1.8,
        floodThreshold: 0.65,
        surchargeDepth: 0.40,
        neighbors: [{ id: 'gorai-creek', width: 45, length: 2200, roughness: 0.030 }],
      },
      {
        id: 'gorai-creek',
        name: 'Gorai Creek',
        lat: 19.2430,
        lng: 72.8220,
        areaKm2: 3.2,
        elevation: 2,
        waterLevel: 0.03,
        drainageCapacity: 45,
        infiltrationRate: 4,
        floodThreshold: 1.1,
        surchargeDepth: 0.70,
        neighbors: [],
      },
    ],
  },

  oshiwara: {
    id: 'oshiwara',
    name: 'Oshiwara River Basin',
    description: 'Western Suburbs corridor draining Aarey Colony & Goregaon to Versova Creek',
    center: [19.145, 72.840],
    defaultZoom: 13,
    catchmentAreaKm2: 44.2,
    channelLengthKm: 14.5,
    riverChannel: [
      [19.1460, 72.8930], // Aarey Hills headwaters
      [19.1550, 72.8750], // Film City Runoff
      [19.1580, 72.8520], // Goregaon Hub (SV Road)
      [19.1500, 72.8360], // Oshiwara Link Road
      [19.1380, 72.8260], // Millat Nagar
      [19.1320, 72.8120], // Versova Creek (Arabian Sea tidal exit)
    ],
    regions: [
      {
        id: 'aarey-hills',
        name: 'Aarey Hills',
        lat: 19.1460,
        lng: 72.8930,
        areaKm2: 4.2,
        elevation: 55,
        waterLevel: 0.04,
        drainageCapacity: 30,
        infiltrationRate: 6,
        floodThreshold: 1.5,
        surchargeDepth: 1.0,
        neighbors: [{ id: 'goregaon-hub', width: 22, length: 3500, roughness: 0.040 }],
      },
      {
        id: 'goregaon-hub',
        name: 'Goregaon Hub',
        lat: 19.1580,
        lng: 72.8520,
        areaKm2: 3.1,
        elevation: 15,
        waterLevel: 0.07,
        drainageCapacity: 18,
        infiltrationRate: 1.8,
        floodThreshold: 0.68,
        surchargeDepth: 0.40,
        neighbors: [{ id: 'oshiwara-link', width: 34, length: 2100, roughness: 0.038 }],
      },
      {
        id: 'oshiwara-link',
        name: 'Oshiwara Link',
        lat: 19.1500,
        lng: 72.8360,
        areaKm2: 2.8,
        elevation: 8,
        waterLevel: 0.10,
        drainageCapacity: 16,
        infiltrationRate: 1.2,
        floodThreshold: 0.52,
        surchargeDepth: 0.32,
        neighbors: [{ id: 'millat-nagar', width: 42, length: 1800, roughness: 0.035 }],
      },
      {
        id: 'millat-nagar',
        name: 'Millat Nagar',
        lat: 19.1380,
        lng: 72.8260,
        areaKm2: 2.3,
        elevation: 5,
        waterLevel: 0.08,
        drainageCapacity: 20,
        infiltrationRate: 1.4,
        floodThreshold: 0.60,
        surchargeDepth: 0.38,
        neighbors: [{ id: 'versova-creek', width: 60, length: 1900, roughness: 0.032 }],
      },
      {
        id: 'versova-creek',
        name: 'Versova Creek',
        lat: 19.1320,
        lng: 72.8120,
        areaKm2: 3.5,
        elevation: 2,
        waterLevel: 0.04,
        drainageCapacity: 42,
        infiltrationRate: 3.0,
        floodThreshold: 1.0,
        surchargeDepth: 0.65,
        neighbors: [],
      },
    ],
  },
};

function getBasin(basinId = 'mithi') {
  const normalizedId = String(basinId).toLowerCase().trim();
  return BASINS[normalizedId] || BASINS.mithi;
}

function listBasins() {
  return Object.keys(BASINS).map((id) => {
    const b = BASINS[id];
    return {
      id: b.id,
      name: b.name,
      description: b.description,
      center: b.center,
      defaultZoom: b.defaultZoom,
      catchmentAreaKm2: b.catchmentAreaKm2,
      channelLengthKm: b.channelLengthKm,
      stationCount: b.regions.length,
      riverChannel: b.riverChannel,
      regions: b.regions,
    };
  });
}

module.exports = {
  BASINS,
  getBasin,
  listBasins,
};
