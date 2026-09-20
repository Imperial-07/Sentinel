'use strict';

/**
 * Real Catchment Basins & Strategic Dams across India.
 * Calibrated with real geographic coordinates, elevations, FRL, storage capacities, and river paths.
 * Sources: Central Water Commission (CWC), India-WRIS, IMD.
 */
const BASINS = {
  /* =========================================================
     URBAN BASINS (MUMBAI MMR)
  ========================================================= */
  mithi: {
    id: 'mithi',
    name: 'Mithi River Basin',
    category: 'urban',
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
    category: 'urban',
    description: 'Major Eastern Metropolitan drainage from Sahyadri foothills through Thane Estuary',
    center: [19.225, 73.115],
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
    category: 'urban',
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
    category: 'urban',
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

  /* =========================================================
     NATIONAL RIVER BASINS (INDIA)
  ========================================================= */
  ganga: {
    id: 'ganga',
    name: 'Ganga River Basin',
    category: 'national_river',
    description: 'Northern India lifeline flowing through Uttarakhand, UP, Bihar, and West Bengal to Bay of Bengal',
    center: [25.6127, 85.1444], // Centered around central Gangetic plain
    defaultZoom: 7,
    catchmentAreaKm2: 861452,
    channelLengthKm: 2525,
    riverChannel: [
      [30.0869, 78.2676], // Rishikesh
      [29.9457, 78.1642], // Haridwar
      [26.4499, 80.3319], // Kanpur
      [25.4358, 81.8463], // Prayagraj (Triveni Sangam)
      [25.3176, 83.0062], // Varanasi
      [25.6127, 85.1444], // Patna
      [24.8016, 87.9257], // Farakka Barrage
    ],
    regions: [
      { id: 'rishikesh', name: 'Rishikesh', lat: 30.0869, lng: 78.2676, areaKm2: 35.0, elevation: 372, waterLevel: 1.10, drainageCapacity: 85, infiltrationRate: 9, floodThreshold: 4.8, surchargeDepth: 3.2, neighbors: [{ id: 'haridwar', width: 120, length: 28000, roughness: 0.035 }] },
      { id: 'haridwar', name: 'Haridwar', lat: 29.9457, lng: 78.1642, areaKm2: 45.0, elevation: 314, waterLevel: 1.40, drainageCapacity: 95, infiltrationRate: 8, floodThreshold: 5.2, surchargeDepth: 3.5, neighbors: [{ id: 'kanpur', width: 250, length: 380000, roughness: 0.032 }] },
      { id: 'kanpur', name: 'Kanpur', lat: 26.4499, lng: 80.3319, areaKm2: 78.0, elevation: 126, waterLevel: 2.10, drainageCapacity: 110, infiltrationRate: 4, floodThreshold: 7.5, surchargeDepth: 4.8, neighbors: [{ id: 'prayagraj', width: 450, length: 190000, roughness: 0.030 }] },
      { id: 'prayagraj', name: 'Prayagraj Sangam', lat: 25.4358, lng: 81.8463, areaKm2: 95.0, elevation: 98, waterLevel: 2.80, drainageCapacity: 140, infiltrationRate: 3.5, floodThreshold: 8.8, surchargeDepth: 5.5, neighbors: [{ id: 'varanasi', width: 600, length: 125000, roughness: 0.028 }] },
      { id: 'varanasi', name: 'Varanasi Ghats', lat: 25.3176, lng: 83.0062, areaKm2: 85.0, elevation: 81, waterLevel: 2.95, drainageCapacity: 150, infiltrationRate: 3.0, floodThreshold: 9.2, surchargeDepth: 6.0, neighbors: [{ id: 'patna', width: 750, length: 240000, roughness: 0.026 }] },
      { id: 'patna', name: 'Patna Gandak Confluence', lat: 25.6127, lng: 85.1444, areaKm2: 120.0, elevation: 53, waterLevel: 3.40, drainageCapacity: 180, infiltrationRate: 2.5, floodThreshold: 10.5, surchargeDepth: 7.2, neighbors: [{ id: 'farakka', width: 1100, length: 320000, roughness: 0.024 }] },
      { id: 'farakka', name: 'Farakka Barrage', lat: 24.8016, lng: 87.9257, areaKm2: 160.0, elevation: 28, waterLevel: 2.80, drainageCapacity: 260, infiltrationRate: 3.0, floodThreshold: 11.2, surchargeDepth: 8.0, neighbors: [] },
    ],
  },

  brahmaputra: {
    id: 'brahmaputra',
    name: 'Brahmaputra River Basin',
    category: 'national_river',
    description: 'Mighty Northeast braided corridor across Assam, with rapid flood surges and massive monsoonal discharge',
    center: [26.1856, 91.7476], // Guwahati
    defaultZoom: 7,
    catchmentAreaKm2: 580000,
    channelLengthKm: 2880,
    riverChannel: [
      [28.0664, 95.3268], // Pasighat (Siang entry)
      [27.4728, 94.9120], // Dibrugarh
      [26.6528, 92.7926], // Tezpur
      [26.1856, 91.7476], // Guwahati (Saraighat)
      [26.1786, 90.6277], // Goalpara
      [26.0208, 89.9754], // Dhubri (Bangladesh border)
    ],
    regions: [
      { id: 'pasighat', name: 'Pasighat Entry', lat: 28.0664, lng: 95.3268, areaKm2: 80.0, elevation: 153, waterLevel: 1.8, drainageCapacity: 160, infiltrationRate: 7, floodThreshold: 5.5, surchargeDepth: 3.8, neighbors: [{ id: 'dibrugarh', width: 800, length: 110000, roughness: 0.030 }] },
      { id: 'dibrugarh', name: 'Dibrugarh Dykes', lat: 27.4728, lng: 94.9120, areaKm2: 110.0, elevation: 108, waterLevel: 2.9, drainageCapacity: 190, infiltrationRate: 4, floodThreshold: 7.2, surchargeDepth: 5.0, neighbors: [{ id: 'tezpur', width: 1200, length: 240000, roughness: 0.028 }] },
      { id: 'tezpur', name: 'Tezpur Kolia Bhomora', lat: 26.6528, lng: 92.7926, areaKm2: 125.0, elevation: 79, waterLevel: 3.2, drainageCapacity: 220, infiltrationRate: 3.5, floodThreshold: 8.4, surchargeDepth: 6.0, neighbors: [{ id: 'guwahati', width: 1400, length: 150000, roughness: 0.026 }] },
      { id: 'guwahati', name: 'Guwahati Saraighat', lat: 26.1856, lng: 91.7476, areaKm2: 150.0, elevation: 55, waterLevel: 3.6, drainageCapacity: 260, infiltrationRate: 3.0, floodThreshold: 9.8, surchargeDepth: 7.0, neighbors: [{ id: 'goalpara', width: 1800, length: 130000, roughness: 0.024 }] },
      { id: 'goalpara', name: 'Goalpara Pancharatna', lat: 26.1786, lng: 90.6277, areaKm2: 130.0, elevation: 42, waterLevel: 3.8, drainageCapacity: 280, infiltrationRate: 2.8, floodThreshold: 10.2, surchargeDepth: 7.5, neighbors: [{ id: 'dhubri', width: 2200, length: 85000, roughness: 0.022 }] },
      { id: 'dhubri', name: 'Dhubri Delta Entry', lat: 26.0208, lng: 89.9754, areaKm2: 170.0, elevation: 34, waterLevel: 4.1, drainageCapacity: 320, infiltrationRate: 2.5, floodThreshold: 11.0, surchargeDepth: 8.2, neighbors: [] },
    ],
  },

  narmada: {
    id: 'narmada',
    name: 'Narmada River Basin',
    category: 'national_river',
    description: 'Central-Western westward-flowing river originating at Amarkantak and discharging into the Arabian Sea',
    center: [22.2500, 76.5000],
    defaultZoom: 7,
    catchmentAreaKm2: 98796,
    channelLengthKm: 1312,
    riverChannel: [
      [22.6734, 81.7588], // Amarkantak source
      [23.1290, 79.8000], // Jabalpur Bhedaghat
      [22.7533, 77.7249], // Hoshangabad (Narmadapuram)
      [22.2435, 76.1500], // Omkareshwar
      [21.8322, 73.7489], // Garudeshwar / Kevadia
      [21.7051, 72.9959], // Bharuch Estuary (Gulf of Khambhat)
    ],
    regions: [
      { id: 'amarkantak', name: 'Amarkantak Source', lat: 22.6734, lng: 81.7588, areaKm2: 30.0, elevation: 1048, waterLevel: 0.8, drainageCapacity: 75, infiltrationRate: 8, floodThreshold: 3.5, surchargeDepth: 2.2, neighbors: [{ id: 'jabalpur', width: 85, length: 210000, roughness: 0.038 }] },
      { id: 'jabalpur', name: 'Jabalpur Bhedaghat', lat: 23.1290, lng: 79.8000, areaKm2: 65.0, elevation: 411, waterLevel: 1.5, drainageCapacity: 95, infiltrationRate: 5, floodThreshold: 6.0, surchargeDepth: 4.0, neighbors: [{ id: 'hoshangabad', width: 160, length: 230000, roughness: 0.034 }] },
      { id: 'hoshangabad', name: 'Narmadapuram Sethani Ghat', lat: 22.7533, lng: 77.7249, areaKm2: 85.0, elevation: 298, waterLevel: 2.2, drainageCapacity: 125, infiltrationRate: 4, floodThreshold: 8.5, surchargeDepth: 6.0, neighbors: [{ id: 'omkareshwar', width: 220, length: 190000, roughness: 0.032 }] },
      { id: 'omkareshwar', name: 'Omkareshwar Island', lat: 22.2435, lng: 76.1500, areaKm2: 90.0, elevation: 199, waterLevel: 2.4, drainageCapacity: 140, infiltrationRate: 3.8, floodThreshold: 9.0, surchargeDepth: 6.5, neighbors: [{ id: 'garudeshwar', width: 340, length: 260000, roughness: 0.030 }] },
      { id: 'garudeshwar', name: 'Garudeshwar Weir', lat: 21.8322, lng: 73.7489, areaKm2: 120.0, elevation: 48, waterLevel: 2.8, drainageCapacity: 180, infiltrationRate: 3.0, floodThreshold: 10.2, surchargeDepth: 7.5, neighbors: [{ id: 'bharuch', width: 550, length: 95000, roughness: 0.026 }] },
      { id: 'bharuch', name: 'Bharuch Golden Bridge', lat: 21.7051, lng: 72.9959, areaKm2: 140.0, elevation: 15, waterLevel: 3.1, drainageCapacity: 230, infiltrationRate: 2.5, floodThreshold: 11.5, surchargeDepth: 8.5, neighbors: [] },
    ],
  },

  godavari: {
    id: 'godavari',
    name: 'Godavari River Basin',
    category: 'national_river',
    description: 'Dakshin Ganga flowing across Maharashtra, Telangana, and Andhra Pradesh to the Bay of Bengal',
    center: [18.9000, 78.5000],
    defaultZoom: 7,
    catchmentAreaKm2: 312812,
    channelLengthKm: 1465,
    riverChannel: [
      [19.9975, 73.7898], // Nashik Trimbakeshwar
      [19.8821, 74.4789], // Kopargaon
      [19.1526, 77.3196], // Nanded
      [17.6688, 80.8936], // Bhadrachalam
      [16.9891, 81.7840], // Rajahmundry Dowleswaram Barrage
    ],
    regions: [
      { id: 'nashik', name: 'Nashik Ramkund', lat: 19.9975, lng: 73.7898, areaKm2: 40.0, elevation: 585, waterLevel: 1.1, drainageCapacity: 80, infiltrationRate: 6, floodThreshold: 4.8, surchargeDepth: 3.0, neighbors: [{ id: 'kopargaon', width: 95, length: 85000, roughness: 0.035 }] },
      { id: 'kopargaon', name: 'Kopargaon Weir', lat: 19.8821, lng: 74.4789, areaKm2: 55.0, elevation: 492, waterLevel: 1.5, drainageCapacity: 95, infiltrationRate: 4.5, floodThreshold: 5.5, surchargeDepth: 3.8, neighbors: [{ id: 'nanded', width: 220, length: 340000, roughness: 0.032 }] },
      { id: 'nanded', name: 'Nanded Sachkhand Ghat', lat: 19.1526, lng: 77.3196, areaKm2: 85.0, elevation: 355, waterLevel: 2.3, drainageCapacity: 130, infiltrationRate: 3.5, floodThreshold: 7.8, surchargeDepth: 5.4, neighbors: [{ id: 'bhadrachalam', width: 480, length: 420000, roughness: 0.029 }] },
      { id: 'bhadrachalam', name: 'Bhadrachalam Temple Ghat', lat: 17.6688, lng: 80.8936, areaKm2: 120.0, elevation: 62, waterLevel: 3.2, drainageCapacity: 175, infiltrationRate: 3.0, floodThreshold: 9.8, surchargeDepth: 7.0, neighbors: [{ id: 'rajahmundry', width: 850, length: 145000, roughness: 0.026 }] },
      { id: 'rajahmundry', name: 'Rajahmundry Dowleswaram', lat: 16.9891, lng: 81.7840, areaKm2: 160.0, elevation: 18, waterLevel: 2.9, drainageCapacity: 250, infiltrationRate: 2.5, floodThreshold: 11.2, surchargeDepth: 8.0, neighbors: [] },
    ],
  },

  krishna: {
    id: 'krishna',
    name: 'Krishna River Basin',
    category: 'national_river',
    description: 'Major southern basin originating in Mahabaleshwar and flowing into Andhra Pradesh delta',
    center: [16.5000, 76.5000],
    defaultZoom: 7,
    catchmentAreaKm2: 258948,
    channelLengthKm: 1400,
    riverChannel: [
      [17.9237, 73.6586], // Mahabaleshwar
      [16.8524, 74.5815], // Sangli Irwin Bridge
      [16.3317, 75.8883], // Almatti Reservoir
      [16.0886, 78.8970], // Srisailam Gorge
      [16.5062, 80.6480], // Vijayawada Prakasam Barrage
    ],
    regions: [
      { id: 'mahabaleshwar', name: 'Mahabaleshwar Source', lat: 17.9237, lng: 73.6586, areaKm2: 28.0, elevation: 1353, waterLevel: 0.9, drainageCapacity: 70, infiltrationRate: 9, floodThreshold: 3.8, surchargeDepth: 2.4, neighbors: [{ id: 'sangli', width: 90, length: 145000, roughness: 0.036 }] },
      { id: 'sangli', name: 'Sangli Irwin Bridge', lat: 16.8524, lng: 74.5815, areaKm2: 75.0, elevation: 549, waterLevel: 2.1, drainageCapacity: 110, infiltrationRate: 4, floodThreshold: 7.2, surchargeDepth: 5.0, neighbors: [{ id: 'almatti', width: 240, length: 165000, roughness: 0.032 }] },
      { id: 'almatti', name: 'Almatti Tailrace', lat: 16.3317, lng: 75.8883, areaKm2: 95.0, elevation: 519, waterLevel: 2.4, drainageCapacity: 140, infiltrationRate: 3.5, floodThreshold: 8.5, surchargeDepth: 6.0, neighbors: [{ id: 'srisailam', width: 380, length: 330000, roughness: 0.030 }] },
      { id: 'srisailam', name: 'Srisailam Gorge', lat: 16.0886, lng: 78.8970, areaKm2: 130.0, elevation: 270, waterLevel: 3.1, drainageCapacity: 190, infiltrationRate: 3.0, floodThreshold: 10.4, surchargeDepth: 7.5, neighbors: [{ id: 'vijayawada', width: 750, length: 210000, roughness: 0.026 }] },
      { id: 'vijayawada', name: 'Vijayawada Prakasam Barrage', lat: 16.5062, lng: 80.6480, areaKm2: 170.0, elevation: 22, waterLevel: 3.0, drainageCapacity: 260, infiltrationRate: 2.5, floodThreshold: 11.8, surchargeDepth: 8.5, neighbors: [] },
    ],
  },

  /* =========================================================
     MAJOR STRATEGIC DAMS & RESERVOIRS (INDIA)
  ========================================================= */
  'sardar-sarovar': {
    id: 'sardar-sarovar',
    name: 'Sardar Sarovar Dam',
    category: 'dam',
    description: 'Narmada River terminal megadam in Gujarat. Protects downstream Bharuch through 30 radial spillway gates.',
    center: [21.8322, 73.7489],
    defaultZoom: 12,
    catchmentAreaKm2: 88000,
    channelLengthKm: 98,
    damSpecs: {
      river: 'Narmada',
      state: 'Gujarat',
      frl: 138.68, // Full Reservoir Level (m)
      mddl: 110.64, // Minimum Drawdown Level (m)
      crestLevel: 121.92,
      currentLevel: 133.20,
      grossCapacityMm3: 9500,
      liveStorageMm3: 5800,
      gateCount: 30,
      openGates: 0,
      spillwayRatingCusecs: 3000000, // ~85,000 m3/s
      inflowCusecs: 45000,
      outflowCusecs: 15000,
    },
    riverChannel: [
      [21.8500, 73.8500], // Reservoir Head
      [21.8322, 73.7489], // Dam Axis & Spillway
      [21.8150, 73.6800], // Garudeshwar Weir
      [21.7800, 73.5500], // Tilakwada
      [21.7500, 73.3500], // Sinor
      [21.7051, 72.9959], // Bharuch City & Golden Bridge
    ],
    regions: [
      { id: 'ss-reservoir', name: 'Reservoir Deep Pool', lat: 21.8500, lng: 73.8500, areaKm2: 375.0, elevation: 138, waterLevel: 0.4, drainageCapacity: 50, infiltrationRate: 2, floodThreshold: 1.8, surchargeDepth: 1.2, isReservoir: true, neighbors: [{ id: 'ss-spillway', width: 850, length: 10500, roughness: 0.020 }] },
      { id: 'ss-spillway', name: 'Main Spillway Chute', lat: 21.8322, lng: 73.7489, areaKm2: 45.0, elevation: 105, waterLevel: 1.2, drainageCapacity: 250, infiltrationRate: 1, floodThreshold: 6.5, surchargeDepth: 4.5, isSpillway: true, neighbors: [{ id: 'garudeshwar-weir', width: 650, length: 7500, roughness: 0.025 }] },
      { id: 'garudeshwar-weir', name: 'Garudeshwar Weir', lat: 21.8150, lng: 73.6800, areaKm2: 35.0, elevation: 52, waterLevel: 1.5, drainageCapacity: 140, infiltrationRate: 3, floodThreshold: 6.8, surchargeDepth: 4.8, neighbors: [{ id: 'tilakwada', width: 500, length: 18000, roughness: 0.028 }] },
      { id: 'tilakwada', name: 'Tilakwada Ghat', lat: 21.7800, lng: 73.5500, areaKm2: 40.0, elevation: 36, waterLevel: 1.8, drainageCapacity: 130, infiltrationRate: 3.5, floodThreshold: 7.5, surchargeDepth: 5.2, neighbors: [{ id: 'bharuch-port', width: 620, length: 65000, roughness: 0.028 }] },
      { id: 'bharuch-port', name: 'Bharuch Vulnerable Delta', lat: 21.7051, lng: 72.9959, areaKm2: 95.0, elevation: 15, waterLevel: 2.2, drainageCapacity: 160, infiltrationRate: 2.5, floodThreshold: 8.5, surchargeDepth: 6.0, neighbors: [] },
    ],
  },

  'tehri-dam': {
    id: 'tehri-dam',
    name: 'Tehri Dam & Reservoir',
    category: 'dam',
    description: 'India\'s tallest dam (260.5m) on Bhagirathi River in Uttarakhand. Regulates flows to Rishikesh and Haridwar.',
    center: [30.3781, 78.4806],
    defaultZoom: 12,
    catchmentAreaKm2: 7511,
    channelLengthKm: 78,
    damSpecs: {
      river: 'Bhagirathi',
      state: 'Uttarakhand',
      frl: 830.0, // Full Reservoir Level (m)
      mddl: 740.0, // Minimum Drawdown Level (m)
      crestLevel: 839.5,
      currentLevel: 818.5,
      grossCapacityMm3: 3540,
      liveStorageMm3: 2615,
      gateCount: 4,
      openGates: 0,
      spillwayRatingCusecs: 549000, // ~15,540 m3/s
      inflowCusecs: 28000,
      outflowCusecs: 9500,
    },
    riverChannel: [
      [30.4200, 78.5300], // Tehri Reservoir Head
      [30.3781, 78.4806], // Tehri Dam Axis
      [30.1458, 78.5989], // Devprayag (Alaknanda Confluence)
      [30.0869, 78.2676], // Rishikesh
      [29.9457, 78.1642], // Haridwar Bhimgoda Barrage
    ],
    regions: [
      { id: 'tehri-reservoir', name: 'Tehri Lake Pool', lat: 30.4200, lng: 78.5300, areaKm2: 52.0, elevation: 830, waterLevel: 0.5, drainageCapacity: 60, infiltrationRate: 2, floodThreshold: 2.0, surchargeDepth: 1.4, isReservoir: true, neighbors: [{ id: 'tehri-chute', width: 220, length: 7000, roughness: 0.022 }] },
      { id: 'tehri-chute', name: 'Chute Spillway Tailrace', lat: 30.3781, lng: 78.4806, areaKm2: 25.0, elevation: 590, waterLevel: 1.2, drainageCapacity: 220, infiltrationRate: 1.5, floodThreshold: 6.0, surchargeDepth: 4.2, isSpillway: true, neighbors: [{ id: 'devprayag-sangam', width: 140, length: 32000, roughness: 0.035 }] },
      { id: 'devprayag-sangam', name: 'Devprayag Sangam', lat: 30.1458, lng: 78.5989, areaKm2: 30.0, elevation: 472, waterLevel: 1.8, drainageCapacity: 120, infiltrationRate: 4, floodThreshold: 6.8, surchargeDepth: 4.6, neighbors: [{ id: 'rishikesh-ghat', width: 180, length: 35000, roughness: 0.032 }] },
      { id: 'rishikesh-ghat', name: 'Rishikesh Triveni Ghat', lat: 30.0869, lng: 78.2676, areaKm2: 42.0, elevation: 356, waterLevel: 2.1, drainageCapacity: 140, infiltrationRate: 5, floodThreshold: 7.4, surchargeDepth: 5.2, neighbors: [{ id: 'haridwar-bhimgoda', width: 260, length: 24000, roughness: 0.030 }] },
      { id: 'haridwar-bhimgoda', name: 'Haridwar Bhimgoda Barrage', lat: 29.9457, lng: 78.1642, areaKm2: 58.0, elevation: 314, waterLevel: 2.4, drainageCapacity: 170, infiltrationRate: 6, floodThreshold: 8.2, surchargeDepth: 5.8, neighbors: [] },
    ],
  },

  'hirakud-dam': {
    id: 'hirakud-dam',
    name: 'Hirakud Dam & Reservoir',
    category: 'dam',
    description: 'One of the world\'s longest earthen dams (25.8km) on Mahanadi River, controlling Odisha delta floodplains.',
    center: [21.5284, 83.8690],
    defaultZoom: 12,
    catchmentAreaKm2: 83400,
    channelLengthKm: 110,
    damSpecs: {
      river: 'Mahanadi',
      state: 'Odisha',
      frl: 192.02, // 630 ft
      mddl: 179.83, // 590 ft
      crestLevel: 195.68,
      currentLevel: 189.40,
      grossCapacityMm3: 8136,
      liveStorageMm3: 5378,
      gateCount: 98,
      openGates: 0,
      spillwayRatingCusecs: 1500000, // ~42,475 m3/s
      inflowCusecs: 65000,
      outflowCusecs: 25000,
    },
    riverChannel: [
      [21.5800, 83.7500], // Reservoir Headwaters
      [21.5284, 83.8690], // Left Spillway Axis
      [21.4669, 83.9812], // Sambalpur Town
      [20.8400, 83.9100], // Sonepur Confluence
      [20.4625, 85.8828], // Cuttack Naraj Barrage
    ],
    regions: [
      { id: 'hirakud-pool', name: 'Hirakud Reservoir Pool', lat: 21.5800, lng: 83.7500, areaKm2: 743.0, elevation: 192, waterLevel: 0.6, drainageCapacity: 65, infiltrationRate: 2, floodThreshold: 2.2, surchargeDepth: 1.5, isReservoir: true, neighbors: [{ id: 'hirakud-spillway', width: 1100, length: 14000, roughness: 0.022 }] },
      { id: 'hirakud-spillway', name: 'Left & Right Crest Gates', lat: 21.5284, lng: 83.8690, areaKm2: 55.0, elevation: 160, waterLevel: 1.4, drainageCapacity: 260, infiltrationRate: 1.5, floodThreshold: 6.5, surchargeDepth: 4.5, isSpillway: true, neighbors: [{ id: 'sambalpur-ghat', width: 750, length: 12000, roughness: 0.026 }] },
      { id: 'sambalpur-ghat', name: 'Sambalpur Ghats', lat: 21.4669, lng: 83.9812, areaKm2: 65.0, elevation: 145, waterLevel: 2.0, drainageCapacity: 150, infiltrationRate: 3.5, floodThreshold: 7.2, surchargeDepth: 5.0, neighbors: [{ id: 'sonepur', width: 900, length: 78000, roughness: 0.028 }] },
      { id: 'sonepur', name: 'Sonepur Tel Confluence', lat: 20.8400, lng: 83.9100, areaKm2: 85.0, elevation: 115, waterLevel: 2.6, drainageCapacity: 180, infiltrationRate: 3.0, floodThreshold: 8.8, surchargeDepth: 6.2, neighbors: [{ id: 'cuttack-naraj', width: 1200, length: 180000, roughness: 0.025 }] },
      { id: 'cuttack-naraj', name: 'Cuttack Naraj Delta Barrage', lat: 20.4625, lng: 85.8828, areaKm2: 140.0, elevation: 32, waterLevel: 3.0, drainageCapacity: 240, infiltrationRate: 2.2, floodThreshold: 10.5, surchargeDepth: 7.8, neighbors: [] },
    ],
  },

  'idukki-dam': {
    id: 'idukki-dam',
    name: 'Idukki Dam & Cheruthoni Spillway',
    category: 'dam',
    description: 'Double curvature arch dam on Periyar River in Kerala. Cheruthoni spillway regulates flow to Aluva & Kochi.',
    center: [9.8499, 76.9725],
    defaultZoom: 12,
    catchmentAreaKm2: 649,
    channelLengthKm: 85,
    damSpecs: {
      river: 'Periyar',
      state: 'Kerala',
      frl: 732.43, // 2403 ft
      mddl: 700.00,
      crestLevel: 736.00,
      currentLevel: 724.80,
      grossCapacityMm3: 1996,
      liveStorageMm3: 1460,
      gateCount: 5,
      openGates: 0,
      spillwayRatingCusecs: 194000, // ~5,500 m3/s
      inflowCusecs: 18000,
      outflowCusecs: 4500,
    },
    riverChannel: [
      [9.8600, 77.0200], // Reservoir Deep Waters
      [9.8499, 76.9725], // Idukki Arch & Cheruthoni Axis
      [9.8750, 76.9200], // Thadiyampadu
      [10.1076, 76.3516], // Aluva Town (Periyar Basin)
      [9.9816, 76.2999], // Kochi Estuary / Arabian Sea
    ],
    regions: [
      { id: 'idukki-reservoir', name: 'Idukki Arch Reservoir', lat: 9.8600, lng: 77.0200, areaKm2: 60.0, elevation: 732, waterLevel: 0.5, drainageCapacity: 50, infiltrationRate: 3, floodThreshold: 1.8, surchargeDepth: 1.2, isReservoir: true, neighbors: [{ id: 'cheruthoni-spillway', width: 280, length: 5000, roughness: 0.024 }] },
      { id: 'cheruthoni-spillway', name: 'Cheruthoni 5-Radial Gates', lat: 9.8499, lng: 76.9725, areaKm2: 20.0, elevation: 680, waterLevel: 1.1, drainageCapacity: 210, infiltrationRate: 2, floodThreshold: 5.5, surchargeDepth: 3.8, isSpillway: true, neighbors: [{ id: 'thadiyampadu', width: 160, length: 9000, roughness: 0.038 }] },
      { id: 'thadiyampadu', name: 'Thadiyampadu Bridge', lat: 9.8750, lng: 76.9200, areaKm2: 32.0, elevation: 420, waterLevel: 1.7, drainageCapacity: 110, infiltrationRate: 4, floodThreshold: 6.5, surchargeDepth: 4.4, neighbors: [{ id: 'aluwa-manappuram', width: 240, length: 65000, roughness: 0.030 }] },
      { id: 'aluwa-manappuram', name: 'Aluva Manappuram Ghat', lat: 10.1076, lng: 76.3516, areaKm2: 55.0, elevation: 12, waterLevel: 2.5, drainageCapacity: 140, infiltrationRate: 3.5, floodThreshold: 7.8, surchargeDepth: 5.5, neighbors: [{ id: 'kochi-backwaters', width: 450, length: 22000, roughness: 0.026 }] },
      { id: 'kochi-backwaters', name: 'Kochi Backwaters Estuary', lat: 9.9816, lng: 76.2999, areaKm2: 85.0, elevation: 2, waterLevel: 2.1, drainageCapacity: 190, infiltrationRate: 3.0, floodThreshold: 8.5, surchargeDepth: 6.2, neighbors: [] },
    ],
  },

  'koyna-dam': {
    id: 'koyna-dam',
    name: 'Koyna Dam & Shivajisagar',
    category: 'dam',
    description: 'Rubble-concrete dam in Maharashtra Western Ghats. Protects Karad, Sangli, and Kolhapur along Krishna river.',
    center: [17.4000, 73.7500],
    defaultZoom: 12,
    catchmentAreaKm2: 891,
    channelLengthKm: 95,
    damSpecs: {
      river: 'Koyna / Krishna',
      state: 'Maharashtra',
      frl: 657.91, // 2158.5 ft
      mddl: 610.00,
      crestLevel: 662.00,
      currentLevel: 651.20,
      grossCapacityMm3: 2797,
      liveStorageMm3: 2678,
      gateCount: 6,
      openGates: 0,
      spillwayRatingCusecs: 250000, // ~7,000 m3/s
      inflowCusecs: 35000,
      outflowCusecs: 12000,
    },
    riverChannel: [
      [17.4800, 73.7200], // Shivajisagar Lake
      [17.4000, 73.7500], // Koyna Dam Axis
      [17.3800, 73.8500], // Helwak / Patan
      [17.2890, 74.1816], // Karad Sangam (Krishna Confluence)
      [16.8524, 74.5815], // Sangli Irwin Bridge
    ],
    regions: [
      { id: 'koyna-reservoir', name: 'Shivajisagar Reservoir', lat: 17.4800, lng: 73.7200, areaKm2: 115.0, elevation: 658, waterLevel: 0.5, drainageCapacity: 55, infiltrationRate: 3, floodThreshold: 1.8, surchargeDepth: 1.2, isReservoir: true, neighbors: [{ id: 'koyna-spillway', width: 350, length: 11000, roughness: 0.022 }] },
      { id: 'koyna-spillway', name: 'Koyna 6-Radial Spillway', lat: 17.4000, lng: 73.7500, areaKm2: 30.0, elevation: 615, waterLevel: 1.3, drainageCapacity: 230, infiltrationRate: 1.5, floodThreshold: 6.0, surchargeDepth: 4.0, isSpillway: true, neighbors: [{ id: 'patan-ghat', width: 180, length: 14000, roughness: 0.034 }] },
      { id: 'patan-ghat', name: 'Patan Koyna Bridge', lat: 17.3800, lng: 73.8500, areaKm2: 45.0, elevation: 580, waterLevel: 1.8, drainageCapacity: 120, infiltrationRate: 4, floodThreshold: 6.8, surchargeDepth: 4.8, neighbors: [{ id: 'karad-sangam', width: 280, length: 38000, roughness: 0.032 }] },
      { id: 'karad-sangam', name: 'Karad Preeti Sangam', lat: 17.2890, lng: 74.1816, areaKm2: 60.0, elevation: 562, waterLevel: 2.2, drainageCapacity: 140, infiltrationRate: 3.8, floodThreshold: 7.5, surchargeDepth: 5.2, neighbors: [{ id: 'sangli-bridge', width: 420, length: 58000, roughness: 0.028 }] },
      { id: 'sangli-bridge', name: 'Sangli Flood Plain', lat: 16.8524, lng: 74.5815, areaKm2: 85.0, elevation: 545, waterLevel: 2.8, drainageCapacity: 160, infiltrationRate: 3.0, floodThreshold: 8.8, surchargeDepth: 6.2, neighbors: [] },
    ],
  },

  'nagarjuna-sagar': {
    id: 'nagarjuna-sagar',
    name: 'Nagarjuna Sagar Dam',
    category: 'dam',
    description: 'Massive masonry dam on Krishna River spanning Telangana & Andhra Pradesh. Protects downstream Amaravati & Vijayawada.',
    center: [16.5786, 79.3130],
    defaultZoom: 12,
    catchmentAreaKm2: 215000,
    channelLengthKm: 135,
    damSpecs: {
      river: 'Krishna',
      state: 'Telangana / Andhra Pradesh',
      frl: 179.83, // 590 ft
      mddl: 155.00,
      crestLevel: 184.00,
      currentLevel: 175.40,
      grossCapacityMm3: 11560,
      liveStorageMm3: 6840,
      gateCount: 26,
      openGates: 0,
      spillwayRatingCusecs: 700000, // ~20,000 m3/s
      inflowCusecs: 55000,
      outflowCusecs: 18000,
    },
    riverChannel: [
      [16.6500, 79.2000], // Sagar Reservoir Waters
      [16.5786, 79.3130], // Dam Crest & Radial Gates
      [16.7100, 79.6200], // Wadapally Confluence
      [16.5750, 80.3550], // Amaravati Sacred Riverbank
      [16.5062, 80.6480], // Vijayawada Prakasam Barrage
    ],
    regions: [
      { id: 'ns-reservoir', name: 'Nagarjuna Sagar Reservoir', lat: 16.6500, lng: 79.2000, areaKm2: 285.0, elevation: 180, waterLevel: 0.6, drainageCapacity: 60, infiltrationRate: 2, floodThreshold: 2.0, surchargeDepth: 1.4, isReservoir: true, neighbors: [{ id: 'ns-spillway', width: 900, length: 15000, roughness: 0.022 }] },
      { id: 'ns-spillway', name: '26 Radial Crest Gates', lat: 16.5786, lng: 79.3130, areaKm2: 45.0, elevation: 140, waterLevel: 1.3, drainageCapacity: 270, infiltrationRate: 1.5, floodThreshold: 6.8, surchargeDepth: 4.8, isSpillway: true, neighbors: [{ id: 'wadapally', width: 550, length: 38000, roughness: 0.030 }] },
      { id: 'wadapally', name: 'Wadapally Sangam', lat: 16.7100, lng: 79.6200, areaKm2: 65.0, elevation: 85, waterLevel: 2.1, drainageCapacity: 140, infiltrationRate: 3.5, floodThreshold: 7.6, surchargeDepth: 5.4, neighbors: [{ id: 'amaravati-ghat', width: 680, length: 82000, roughness: 0.028 }] },
      { id: 'amaravati-ghat', name: 'Amaravati Capital Riverfront', lat: 16.5750, lng: 80.3550, areaKm2: 85.0, elevation: 34, waterLevel: 2.6, drainageCapacity: 160, infiltrationRate: 3.0, floodThreshold: 8.5, surchargeDepth: 6.0, neighbors: [{ id: 'prakasam-barrage', width: 850, length: 35000, roughness: 0.025 }] },
      { id: 'prakasam-barrage', name: 'Prakasam Barrage Vijayawada', lat: 16.5062, lng: 80.6480, areaKm2: 120.0, elevation: 22, waterLevel: 3.1, drainageCapacity: 220, infiltrationRate: 2.5, floodThreshold: 10.2, surchargeDepth: 7.5, neighbors: [] },
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
      category: b.category || 'urban',
      description: b.description,
      center: b.center,
      defaultZoom: b.defaultZoom,
      catchmentAreaKm2: b.catchmentAreaKm2,
      channelLengthKm: b.channelLengthKm,
      stationCount: b.regions.length,
      riverChannel: b.riverChannel,
      damSpecs: b.damSpecs || null,
      regions: b.regions,
    };
  });
}

module.exports = {
  BASINS,
  getBasin,
  listBasins,
};
