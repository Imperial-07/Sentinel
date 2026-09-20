/* =====================================================
   FLOWSHIELD
   MAIN JAVASCRIPT
===================================================== */


/* =====================================================
   MAP INITIALIZATION
===================================================== */


const map = L.map("map", {

    zoomControl: false,

    attributionControl: true,

    preferCanvas: true

}).setView(

    [19.09, 72.87],

    10

);


/*
   OpenStreetMap tiles
*/

const tileLayer = L.tileLayer(

    "https://tile.openstreetmap.org/{z}/{x}/{y}.png",

    {

        maxZoom: 19,

        minZoom: 5,

        tileSize: 256,

        attribution:
            "&copy; OpenStreetMap contributors"

    }

);


tileLayer.addTo(map);


/*
   Force Leaflet to calculate the map size
   after the page has loaded.
*/

window.addEventListener(

    "load",

    function () {

        setTimeout(

            function () {

                map.invalidateSize(true);

            },

            300

        );

    }

);


/*
   Also recalculate whenever the browser
   window changes size.
*/

window.addEventListener(

    "resize",

    function () {

        map.invalidateSize(true);

    }

);


/* =====================================================
   REGION DATA
===================================================== */


let activeBasinId = "mithi";

const BASINS_DATA = {
    /* ==========================================
       URBAN BASINS (MUMBAI MMR)
    ========================================== */
    mithi: {
        id: "mithi",
        name: "Mithi River Catchment",
        category: "urban",
        center: [19.076, 72.872],
        defaultZoom: 12,
        riverChannel: [
            [19.1270, 72.9100],
            [19.1197, 72.9051],
            [19.1145, 72.8965],
            [19.1074, 72.8846],
            [19.0980, 72.8815],
            [19.0880, 72.8835],
            [19.0726, 72.8845],
            [19.0668, 72.8686],
            [19.0550, 72.8580],
            [19.0435, 72.8510],
            [19.0410, 72.8493],
            [19.0410, 72.8397],
            [19.0380, 72.8310]
        ],
        regions: [
            { id: "powai", name: "Powai", lat: 19.1197, lng: 72.9051 },
            { id: "saki-naka", name: "Saki Naka", lat: 19.1074, lng: 72.8846 },
            { id: "kurla", name: "Kurla", lat: 19.0726, lng: 72.8845 },
            { id: "bkc", name: "BKC", lat: 19.0668, lng: 72.8686 },
            { id: "dharavi", name: "Dharavi", lat: 19.0410, lng: 72.8493 },
            { id: "mahim", name: "Mahim", lat: 19.0410, lng: 72.8397 }
        ]
    },
    ulhas: {
        id: "ulhas",
        name: "Ulhas River Basin",
        category: "urban",
        center: [19.225, 73.115],
        defaultZoom: 11,
        riverChannel: [
            [19.1663, 73.2370],
            [19.1850, 73.1820],
            [19.2210, 73.1550],
            [19.2437, 73.1355],
            [19.2183, 73.0867],
            [19.1890, 73.0450],
            [19.1982, 72.9781],
            [19.1550, 72.9980]
        ],
        regions: [
            { id: "badlapur", name: "Badlapur", lat: 19.1663, lng: 73.2370 },
            { id: "ulhasnagar", name: "Ulhasnagar", lat: 19.2210, lng: 73.1550 },
            { id: "kalyan", name: "Kalyan Creek", lat: 19.2437, lng: 73.1355 },
            { id: "dombivli", name: "Dombivli", lat: 19.2183, lng: 73.0867 },
            { id: "diva", name: "Diva Junction", lat: 19.1890, lng: 73.0450 },
            { id: "thane-estuary", name: "Thane Estuary", lat: 19.1982, lng: 72.9781 }
        ]
    },
    dahisar: {
        id: "dahisar",
        name: "Dahisar River Basin",
        category: "urban",
        center: [19.245, 72.860],
        defaultZoom: 13,
        riverChannel: [
            [19.2315, 72.9150],
            [19.2410, 72.8870],
            [19.2475, 72.8680],
            [19.2520, 72.8530],
            [19.2505, 72.8390],
            [19.2430, 72.8220]
        ],
        regions: [
            { id: "sgnp-upper", name: "SGNP Forest", lat: 19.2315, lng: 72.9150 },
            { id: "dahisar-east", name: "Dahisar East", lat: 19.2410, lng: 72.8870 },
            { id: "weh-culvert", name: "WEH Culvert", lat: 19.2475, lng: 72.8680 },
            { id: "dahisar-west", name: "Dahisar West", lat: 19.2520, lng: 72.8530 },
            { id: "gorai-creek", name: "Gorai Creek", lat: 19.2430, lng: 72.8220 }
        ]
    },
    oshiwara: {
        id: "oshiwara",
        name: "Oshiwara River Basin",
        category: "urban",
        center: [19.145, 72.840],
        defaultZoom: 13,
        riverChannel: [
            [19.1460, 72.8930],
            [19.1550, 72.8750],
            [19.1580, 72.8520],
            [19.1500, 72.8360],
            [19.1380, 72.8260],
            [19.1320, 72.8120]
        ],
        regions: [
            { id: "aarey-hills", name: "Aarey Hills", lat: 19.1460, lng: 72.8930 },
            { id: "goregaon-hub", name: "Goregaon Hub", lat: 19.1580, lng: 72.8520 },
            { id: "oshiwara-link", name: "Oshiwara Link", lat: 19.1500, lng: 72.8360 },
            { id: "millat-nagar", name: "Millat Nagar", lat: 19.1380, lng: 72.8260 },
            { id: "versova-creek", name: "Versova Creek", lat: 19.1320, lng: 72.8120 }
        ]
    },

    /* ==========================================
       NATIONAL RIVER BASINS (INDIA)
    ========================================== */
    ganga: {
        id: "ganga",
        name: "Ganga River Basin",
        category: "national_river",
        center: [25.6127, 85.1444],
        defaultZoom: 7,
        riverChannel: [
            [30.0869, 78.2676],
            [29.9457, 78.1642],
            [26.4499, 80.3319],
            [25.4358, 81.8463],
            [25.3176, 83.0062],
            [25.6127, 85.1444],
            [24.8016, 87.9257]
        ],
        regions: [
            { id: "rishikesh", name: "Rishikesh", lat: 30.0869, lng: 78.2676 },
            { id: "haridwar", name: "Haridwar", lat: 29.9457, lng: 78.1642 },
            { id: "kanpur", name: "Kanpur", lat: 26.4499, lng: 80.3319 },
            { id: "prayagraj", name: "Prayagraj Sangam", lat: 25.4358, lng: 81.8463 },
            { id: "varanasi", name: "Varanasi Ghats", lat: 25.3176, lng: 83.0062 },
            { id: "patna", name: "Patna", lat: 25.6127, lng: 85.1444 },
            { id: "farakka", name: "Farakka Barrage", lat: 24.8016, lng: 87.9257 }
        ]
    },
    brahmaputra: {
        id: "brahmaputra",
        name: "Brahmaputra River Basin",
        category: "national_river",
        center: [26.1856, 91.7476],
        defaultZoom: 7,
        riverChannel: [
            [28.0664, 95.3268],
            [27.4728, 94.9120],
            [26.6528, 92.7926],
            [26.1856, 91.7476],
            [26.1786, 90.6277],
            [26.0208, 89.9754]
        ],
        regions: [
            { id: "pasighat", name: "Pasighat Entry", lat: 28.0664, lng: 95.3268 },
            { id: "dibrugarh", name: "Dibrugarh Dykes", lat: 27.4728, lng: 94.9120 },
            { id: "tezpur", name: "Tezpur", lat: 26.6528, lng: 92.7926 },
            { id: "guwahati", name: "Guwahati Saraighat", lat: 26.1856, lng: 91.7476 },
            { id: "goalpara", name: "Goalpara", lat: 26.1786, lng: 90.6277 },
            { id: "dhubri", name: "Dhubri Delta Entry", lat: 26.0208, lng: 89.9754 }
        ]
    },
    narmada: {
        id: "narmada",
        name: "Narmada River Basin",
        category: "national_river",
        center: [22.2500, 76.5000],
        defaultZoom: 7,
        riverChannel: [
            [22.6734, 81.7588],
            [23.1290, 79.8000],
            [22.7533, 77.7249],
            [22.2435, 76.1500],
            [21.8322, 73.7489],
            [21.7051, 72.9959]
        ],
        regions: [
            { id: "amarkantak", name: "Amarkantak Source", lat: 22.6734, lng: 81.7588 },
            { id: "jabalpur", name: "Jabalpur Bhedaghat", lat: 23.1290, lng: 79.8000 },
            { id: "hoshangabad", name: "Narmadapuram Sethani", lat: 22.7533, lng: 77.7249 },
            { id: "omkareshwar", name: "Omkareshwar", lat: 22.2435, lng: 76.1500 },
            { id: "garudeshwar", name: "Garudeshwar Weir", lat: 21.8322, lng: 73.7489 },
            { id: "bharuch", name: "Bharuch Golden Bridge", lat: 21.7051, lng: 72.9959 }
        ]
    },
    godavari: {
        id: "godavari",
        name: "Godavari River Basin",
        category: "national_river",
        center: [18.9000, 78.5000],
        defaultZoom: 7,
        riverChannel: [
            [19.9975, 73.7898],
            [19.8821, 74.4789],
            [19.1526, 77.3196],
            [17.6688, 80.8936],
            [16.9891, 81.7840]
        ],
        regions: [
            { id: "nashik", name: "Nashik Ramkund", lat: 19.9975, lng: 73.7898 },
            { id: "kopargaon", name: "Kopargaon Weir", lat: 19.8821, lng: 74.4789 },
            { id: "nanded", name: "Nanded Sachkhand", lat: 19.1526, lng: 77.3196 },
            { id: "bhadrachalam", name: "Bhadrachalam Temple", lat: 17.6688, lng: 80.8936 },
            { id: "rajahmundry", name: "Rajahmundry Barrage", lat: 16.9891, lng: 81.7840 }
        ]
    },
    krishna: {
        id: "krishna",
        name: "Krishna River Basin",
        category: "national_river",
        center: [16.5000, 76.5000],
        defaultZoom: 7,
        riverChannel: [
            [17.9237, 73.6586],
            [16.8524, 74.5815],
            [16.3317, 75.8883],
            [16.0886, 78.8970],
            [16.5062, 80.6480]
        ],
        regions: [
            { id: "mahabaleshwar", name: "Mahabaleshwar Source", lat: 17.9237, lng: 73.6586 },
            { id: "sangli", name: "Sangli Irwin Bridge", lat: 16.8524, lng: 74.5815 },
            { id: "almatti", name: "Almatti Tailrace", lat: 16.3317, lng: 75.8883 },
            { id: "srisailam", name: "Srisailam Gorge", lat: 16.0886, lng: 78.8970 },
            { id: "vijayawada", name: "Vijayawada Barrage", lat: 16.5062, lng: 80.6480 }
        ]
    },

    /* ==========================================
       HIMALAYAN & TRANSBOUNDARY BASINS (NEPAL)
    ========================================== */
    "bagmati-nepal": {
        id: "bagmati-nepal",
        name: "Bagmati River Basin (Nepal)",
        category: "national_river",
        center: [27.7000, 85.3200],
        defaultZoom: 10,
        riverChannel: [
            [27.7650, 85.4250],
            [27.7105, 85.3485],
            [27.6880, 85.3020],
            [27.6580, 85.2920],
            [27.5620, 85.2280],
            [27.1420, 85.4850]
        ],
        regions: [
            { id: "sundarijal", name: "Sundarijal Shivapuri", lat: 27.7650, lng: 85.4250 },
            { id: "pashupatinath", name: "Pashupatinath Gaurighat", lat: 27.7105, lng: 85.3485 },
            { id: "balkhu", name: "Balkhu-Teku Floodplain", lat: 27.6880, lng: 85.3020 },
            { id: "chobhar-gorge", name: "Chobhar Gorge Bottleneck", lat: 27.6580, lng: 85.2920 },
            { id: "sisneri", name: "Sisneri Makwanpur", lat: 27.5620, lng: 85.2280 },
            { id: "karmaiya", name: "Karmaiya Bagmati Barrage", lat: 27.1420, lng: 85.4850 }
        ]
    },
    "koshi-nepal": {
        id: "koshi-nepal",
        name: "Koshi River Basin (Saptakoshi / Nepal)",
        category: "national_river",
        center: [26.8680, 87.1580],
        defaultZoom: 8,
        riverChannel: [
            [27.7850, 85.9000],
            [26.9320, 87.3320],
            [26.8680, 87.1580],
            [26.8150, 87.1400],
            [26.5220, 86.9230]
        ],
        regions: [
            { id: "barhabise", name: "Barhabise Bhotekoshi", lat: 27.7850, lng: 85.9000 },
            { id: "mulghat", name: "Mulghat Tamor Confluence", lat: 26.9320, lng: 87.3320 },
            { id: "chatara", name: "Chatara Saptakoshi Gorge", lat: 26.8680, lng: 87.1580 },
            { id: "barahakshetra", name: "Barahakshetra Basin", lat: 26.8150, lng: 87.1400 },
            { id: "koshi-barrage", name: "Koshi Megabarrage (56 Gates)", lat: 26.5220, lng: 86.9230 }
        ]
    },

    /* ==========================================
       MAJOR STRATEGIC DAMS & RESERVOIRS (INDIA)
    ========================================== */
    "sardar-sarovar": {
        id: "sardar-sarovar",
        name: "Sardar Sarovar Dam",
        category: "dam",
        center: [21.8322, 73.7489],
        defaultZoom: 12,
        damSpecs: {
            river: "Narmada",
            state: "Gujarat",
            frl: 138.68,
            mddl: 110.64,
            currentLevel: 133.20,
            grossCapacityMm3: 9500,
            liveStorageMm3: 5800,
            gateCount: 30
        },
        riverChannel: [
            [21.8500, 73.8500],
            [21.8322, 73.7489],
            [21.8150, 73.6800],
            [21.7800, 73.5500],
            [21.7500, 73.3500],
            [21.7051, 72.9959]
        ],
        regions: [
            { id: "ss-reservoir", name: "Reservoir Deep Pool", lat: 21.8500, lng: 73.8500, isReservoir: true },
            { id: "ss-spillway", name: "Main Spillway Chute", lat: 21.8322, lng: 73.7489, isSpillway: true },
            { id: "garudeshwar-weir", name: "Garudeshwar Weir", lat: 21.8150, lng: 73.6800 },
            { id: "tilakwada", name: "Tilakwada Ghat", lat: 21.7800, lng: 73.5500 },
            { id: "bharuch-port", name: "Bharuch Vulnerable Delta", lat: 21.7051, lng: 72.9959 }
        ]
    },
    "tehri-dam": {
        id: "tehri-dam",
        name: "Tehri Dam & Reservoir",
        category: "dam",
        center: [30.3781, 78.4806],
        defaultZoom: 12,
        damSpecs: {
            river: "Bhagirathi",
            state: "Uttarakhand",
            frl: 830.0,
            mddl: 740.0,
            currentLevel: 818.5,
            grossCapacityMm3: 3540,
            liveStorageMm3: 2615,
            gateCount: 4
        },
        riverChannel: [
            [30.4200, 78.5300],
            [30.3781, 78.4806],
            [30.1458, 78.5989],
            [30.0869, 78.2676],
            [29.9457, 78.1642]
        ],
        regions: [
            { id: "tehri-reservoir", name: "Tehri Lake Pool", lat: 30.4200, lng: 78.5300, isReservoir: true },
            { id: "tehri-chute", name: "Chute Spillway Tailrace", lat: 30.3781, lng: 78.4806, isSpillway: true },
            { id: "devprayag-sangam", name: "Devprayag Sangam", lat: 30.1458, lng: 78.5989 },
            { id: "rishikesh-ghat", name: "Rishikesh Triveni Ghat", lat: 30.0869, lng: 78.2676 },
            { id: "haridwar-bhimgoda", name: "Haridwar Bhimgoda Barrage", lat: 29.9457, lng: 78.1642 }
        ]
    },
    "hirakud-dam": {
        id: "hirakud-dam",
        name: "Hirakud Dam & Reservoir",
        category: "dam",
        center: [21.5284, 83.8690],
        defaultZoom: 12,
        damSpecs: {
            river: "Mahanadi",
            state: "Odisha",
            frl: 192.02,
            mddl: 179.83,
            currentLevel: 189.40,
            grossCapacityMm3: 8136,
            liveStorageMm3: 5378,
            gateCount: 98
        },
        riverChannel: [
            [21.5800, 83.7500],
            [21.5284, 83.8690],
            [21.4669, 83.9812],
            [20.8400, 83.9100],
            [20.4625, 85.8828]
        ],
        regions: [
            { id: "hirakud-pool", name: "Hirakud Reservoir Pool", lat: 21.5800, lng: 83.7500, isReservoir: true },
            { id: "hirakud-spillway", name: "Crest Spillway Gates", lat: 21.5284, lng: 83.8690, isSpillway: true },
            { id: "sambalpur-ghat", name: "Sambalpur Ghats", lat: 21.4669, lng: 83.9812 },
            { id: "sonepur", name: "Sonepur Tel Confluence", lat: 20.8400, lng: 83.9100 },
            { id: "cuttack-naraj", name: "Cuttack Naraj Barrage", lat: 20.4625, lng: 85.8828 }
        ]
    },
    "idukki-dam": {
        id: "idukki-dam",
        name: "Idukki Dam & Cheruthoni Spillway",
        category: "dam",
        center: [9.8499, 76.9725],
        defaultZoom: 12,
        damSpecs: {
            river: "Periyar",
            state: "Kerala",
            frl: 732.43,
            mddl: 700.00,
            currentLevel: 724.80,
            grossCapacityMm3: 1996,
            liveStorageMm3: 1460,
            gateCount: 5
        },
        riverChannel: [
            [9.8600, 77.0200],
            [9.8499, 76.9725],
            [9.8750, 76.9200],
            [10.1076, 76.3516],
            [9.9816, 76.2999]
        ],
        regions: [
            { id: "idukki-reservoir", name: "Idukki Arch Reservoir", lat: 9.8600, lng: 77.0200, isReservoir: true },
            { id: "cheruthoni-spillway", name: "Cheruthoni 5-Radial Gates", lat: 9.8499, lng: 76.9725, isSpillway: true },
            { id: "thadiyampadu", name: "Thadiyampadu Bridge", lat: 9.8750, lng: 76.9200 },
            { id: "aluwa-manappuram", name: "Aluva Manappuram Ghat", lat: 10.1076, lng: 76.3516 },
            { id: "kochi-backwaters", name: "Kochi Backwaters Estuary", lat: 9.9816, lng: 76.2999 }
        ]
    },
    "koyna-dam": {
        id: "koyna-dam",
        name: "Koyna Dam & Shivajisagar",
        category: "dam",
        center: [17.4000, 73.7500],
        defaultZoom: 12,
        damSpecs: {
            river: "Koyna / Krishna",
            state: "Maharashtra",
            frl: 657.91,
            mddl: 610.00,
            currentLevel: 651.20,
            grossCapacityMm3: 2797,
            liveStorageMm3: 2678,
            gateCount: 6
        },
        riverChannel: [
            [17.4800, 73.7200],
            [17.4000, 73.7500],
            [17.3800, 73.8500],
            [17.2890, 74.1816],
            [16.8524, 74.5815]
        ],
        regions: [
            { id: "koyna-reservoir", name: "Shivajisagar Reservoir", lat: 17.4800, lng: 73.7200, isReservoir: true },
            { id: "koyna-spillway", name: "Koyna 6-Radial Spillway", lat: 17.4000, lng: 73.7500, isSpillway: true },
            { id: "patan-ghat", name: "Patan Koyna Bridge", lat: 17.3800, lng: 73.8500 },
            { id: "karad-sangam", name: "Karad Preeti Sangam", lat: 17.2890, lng: 74.1816 },
            { id: "sangli-bridge", name: "Sangli Flood Plain", lat: 16.8524, lng: 74.5815 }
        ]
    },
    "nagarjuna-sagar": {
        id: "nagarjuna-sagar",
        name: "Nagarjuna Sagar Dam",
        category: "dam",
        center: [16.5786, 79.3130],
        defaultZoom: 12,
        damSpecs: {
            river: "Krishna",
            state: "Telangana / Andhra Pradesh",
            frl: 179.83,
            mddl: 155.00,
            currentLevel: 175.40,
            grossCapacityMm3: 11560,
            liveStorageMm3: 6840,
            gateCount: 26
        },
        riverChannel: [
            [16.6500, 79.2000],
            [16.5786, 79.3130],
            [16.7100, 79.6200],
            [16.5750, 80.3550],
            [16.5062, 80.6480]
        ],
        regions: [
            { id: "ns-reservoir", name: "Nagarjuna Sagar Reservoir", lat: 16.6500, lng: 79.2000, isReservoir: true },
            { id: "ns-spillway", name: "26 Radial Crest Gates", lat: 16.5786, lng: 79.3130, isSpillway: true },
            { id: "wadapally", name: "Wadapally Sangam", lat: 16.7100, lng: 79.6200 },
            { id: "amaravati-ghat", name: "Amaravati Capital Riverfront", lat: 16.5750, lng: 80.3550 },
            { id: "prakasam-barrage", name: "Prakasam Barrage Vijayawada", lat: 16.5062, lng: 80.6480 }
        ]
    }
};

let regions = BASINS_DATA.mithi.regions;


/* =====================================================
   APPLICATION STATE
===================================================== */

const API_BASE =
    (typeof window !== "undefined" && window.location && window.location.protocol.startsWith("http"))
        ? `${window.location.origin}/api`
        : "http://localhost:5001/api";

let backendOnline = false;

let latestSimulationData = null;

let simulationDebounceTimer = null;

let rainfall = 9;

let simulationHour = 0;

let activeTab = null;

let selectedRegion = null;

let liveWeatherActive = false;

let liveWeatherPollTimer = null;

let currentWeatherData = null;


/* =====================================================
   DOM REFERENCES
===================================================== */


const navButtons =
    document.querySelectorAll(
        ".nav-button"
    );


const tabPanels =
    document.querySelectorAll(
        ".tab-panel"
    );


const rainfallSlider =
    document.getElementById(
        "rainfallSlider"
    );


const simulationSlider =
    document.getElementById(
        "simulationSlider"
    );


const runSimulationBtn =
    document.getElementById(
        "runSimulationBtn"
    );


const resetBtn =
    document.getElementById(
        "resetBtn"
    );


const alertsList =
    document.getElementById(
        "alertsList"
    );


const simulationHourElement =
    document.getElementById(
        "simulationHour"
    );


/* =====================================================
   RISK CALCULATION
===================================================== */


function getRisk(
    rainfallValue,
    regionIndex
) {

    if (
        regions[regionIndex] &&
        regions[regionIndex].risk
    ) {

        return regions[regionIndex].risk.toLowerCase();

    }


    const regionalEffect =
        regionIndex * 0.8;


    const value =
        rainfallValue +
        regionalEffect;


    if (value >= 24) {

        return "critical";

    }


    if (value >= 17) {

        return "warning";

    }


    if (value >= 8) {

        return "watch";

    }


    return "safe";

}


/* =====================================================
   RISK COLOR
===================================================== */


function getRiskColor(risk) {

    if (risk === "critical") {

        return "#ff4d5a";

    }


    if (risk === "warning") {

        return "#ff8b3d";

    }


    if (risk === "watch") {

        return "#f0c84b";

    }


    return "#42e6a4";

}


/* =====================================================
   RIVER LEVEL
===================================================== */


function calculateRiverLevel() {

    if (
        latestSimulationData &&
        typeof latestSimulationData.riverLevel === "number"
    ) {

        return latestSimulationData.riverLevel.toFixed(1);

    }


    return (

        1.5 +

        rainfall * 0.08

    ).toFixed(1);

}


/* =====================================================
   RIVER & FLOOD HAZARD LAYERS
===================================================== */

const currentBasin = BASINS_DATA[activeBasinId] || BASINS_DATA.mithi;

// 1. Broad Glow & Flood Corridor
const riverGlowLayer = L.polyline(currentBasin.riverChannel, {
    color: '#00e5ff',
    weight: 7,
    opacity: 0.75,
    lineCap: 'round',
    lineJoin: 'round',
    className: 'river-glow-path'
}).addTo(map);

// 2. Dynamic Animated Flow Stream
const riverFlowLayer = L.polyline(currentBasin.riverChannel, {
    color: '#ffffff',
    weight: 2.5,
    opacity: 0.9,
    lineCap: 'round',
    lineJoin: 'round',
    className: 'river-flow-path'
}).addTo(map);

// 3. Flood Inundation Hazard Zones & Station Markers
const inundationLayers = [];
const markers = [];

function rebuildStationLayers() {
    markers.forEach(function (m) {
        map.removeLayer(m);
    });
    markers.length = 0;

    inundationLayers.forEach(function (l) {
        map.removeLayer(l);
    });
    inundationLayers.length = 0;

    regions.forEach(function (region, index) {
        const initialRisk = getRisk(rainfall, index);
        const initialColor = getRiskColor(initialRisk);

        const circle = L.circle([region.lat, region.lng], {
            radius: region.isReservoir ? 1200 : 400,
            color: initialColor,
            fillColor: initialColor,
            fillOpacity: region.isReservoir ? 0.25 : 0.16,
            weight: 1.5,
            dashArray: '5, 5'
        }).addTo(map);

        let tooltipTitle = region.name.toUpperCase();
        if (region.isReservoir) tooltipTitle = `🌊 ${tooltipTitle} (Reservoir Deep Pool)`;
        if (region.isSpillway) tooltipTitle = `🏗️ ${tooltipTitle} (Spillway Gate Axis)`;

        circle.bindTooltip(`<strong>${tooltipTitle}</strong><br>Monitoring Station`, {
            direction: 'top',
            className: 'flood-tooltip'
        });

        circle.on('click', function () {
            openRegionInspector(region, index);
        });

        inundationLayers.push(circle);

        let labelText = region.name.toUpperCase();
        if (region.isReservoir) labelText = `🌊 ${labelText}`;
        if (region.isSpillway) labelText = `🏗️ ${labelText}`;

        const icon = L.divIcon({
            className: "",
            html: `
                <div
                    class="target-marker"
                    style="--marker-color:${initialColor};"
                >
                    <div class="marker-pulse"></div>
                    <div class="marker-core"></div>
                    <div class="marker-label">
                        ${labelText}
                    </div>
                </div>
            `,
            iconSize: [64, 64],
            iconAnchor: [32, 32]
        });

        const marker = L.marker([region.lat, region.lng], { icon: icon }).addTo(map);

        marker.on('click', function () {
            openRegionInspector(region, index);
        });

        markers.push(marker);
    });
}

// Initial build
rebuildStationLayers();

/* =====================================================
   LIVE WEATHER / SATELLITE INTEGRATION
===================================================== */

async function fetchAndApplyLiveWeather(basinId) {
    const badge = document.getElementById("mapLiveWeatherBadge");
    const badgeText = document.getElementById("mapLiveWeatherText");

    try {
        const res = await fetch(`${API_BASE}/live-weather?basinId=${basinId}`);
        if (res.ok) {
            const json = await res.json();
            if (json.success && json.data) {
                currentWeatherData = json.data;
                const rainVal = Number(json.data.rainfall ?? 0);

                // If observational rain is registered, use it, else realistic baseline
                rainfall = rainVal > 0 ? rainVal : (json.data.description.toLowerCase().includes("rain") ? 6 : 0);

                if (rainfallSlider) rainfallSlider.value = rainfall;
                if (simulationSlider) simulationSlider.value = rainfall;

                if (badge && badgeText) {
                    badge.style.display = "inline-flex";
                    badgeText.textContent = `SATELLITE: ${rainfall.toFixed(1)} mm/h (${json.data.description || 'Observed'})`;
                }

                updateDashboard();
                await requestSimulation(rainfall, simulationHour);
                return;
            }
        }
    } catch (err) {
        console.warn("Live weather fetch error:", err.message);
    }
}

/* =====================================================
   BASIN SWITCHING LOGIC
===================================================== */

async function switchBasin(basinId) {
    if (!basinId || !BASINS_DATA[basinId]) {
        basinId = "mithi";
    }

    activeBasinId = basinId;
    const basinSelect = document.getElementById("basinSelect");
    if (basinSelect && basinSelect.value !== basinId) {
        basinSelect.value = basinId;
    }

    let basin = BASINS_DATA[basinId];

    // Fetch live basin topology & real stations from backend if online
    try {
        const res = await fetch(`${API_BASE}/regions?basinId=${basinId}`);
        if (res.ok) {
            const json = await res.json();
            if (json.success && Array.isArray(json.data) && json.data.length > 0) {
                basin.regions = json.data;
            }
        }
    } catch (err) {
        // Fallback gracefully to bundled BASINS_DATA
    }

    regions = basin.regions;

    // Pan map to new basin geographic center
    if (basin.center && basin.defaultZoom) {
        map.flyTo(basin.center, basin.defaultZoom, {
            duration: 1.4,
            easeLinearity: 0.25
        });
    }

    // Update river channel flow paths
    if (basin.riverChannel) {
        riverGlowLayer.setLatLngs(basin.riverChannel);
        riverFlowLayer.setLatLngs(basin.riverChannel);
    }

    // Update Live Map Header Title
    const titleElem = document.getElementById("activeBasinTitle");
    if (titleElem) {
        const typeLabel = basin.category === 'dam' ? 'DAM & RESERVOIR SYSTEM' : 'LIVE HYDROLOGY';
        titleElem.textContent = `${(basin.name || basinId).toUpperCase()} • ${typeLabel}`;
    }

    // Reset inspector
    selectedRegion = null;
    const inspector = document.getElementById("regionInspector");
    if (inspector) {
        inspector.classList.remove("open");
    }

    // Rebuild station markers & hazard circles
    rebuildStationLayers();

    // If live weather toggle is ON, fetch real satellite precipitation for this new basin
    if (liveWeatherActive) {
        await fetchAndApplyLiveWeather(basinId);
    } else {
        latestSimulationData = null;
        updateDashboard();
        await requestSimulation(rainfall, simulationHour);
    }
}


/* =====================================================
   UPDATE MAP MARKERS & FLOOD VISUALIZATIONS
===================================================== */


function updateMarkers() {

    const overallRisk = calculateOverallRisk();
    const riverLevel = calculateRiverLevel();

    // 1. Update River Glow Layer (color, thickness, and glow effect)
    let riverColor = '#00e5ff';
    let baseWeight = 7;

    if (overallRisk === 'CRITICAL') {
        riverColor = '#ff4d5a';
        baseWeight = 18;
    } else if (overallRisk === 'WARNING') {
        riverColor = '#ff8b3d';
        baseWeight = 14;
    } else if (overallRisk === 'WATCH') {
        riverColor = '#f0c84b';
        baseWeight = 10;
    } else {
        baseWeight = Math.min(10, 6 + Number(riverLevel) * 1.5);
    }

    riverGlowLayer.setStyle({
        color: riverColor,
        weight: baseWeight
    });

    // Speed up flow dash animation if heavy storm
    const flowPathElem = riverFlowLayer.getElement();
    if (flowPathElem) {
        if (rainfall > 35 || overallRisk === 'WARNING' || overallRisk === 'CRITICAL') {
            flowPathElem.classList.add('river-flow-fast');
        } else {
            flowPathElem.classList.remove('river-flow-fast');
        }
    }

    // 2. Update Station Markers & Flood Inundation Zones
    regions.forEach(

        function (region, index) {

            const risk =
                getRisk(
                    rainfall,
                    index
                );


            const color =
                getRiskColor(
                    risk
                );


            const icon =
                L.divIcon({

                    className: "",

                    html: `

                        <div
                            class="target-marker"
                            style="--marker-color:${color};"
                        >

                            <div
                                class="marker-pulse"
                            ></div>

                            <div
                                class="marker-core"
                            ></div>

                            <div
                                class="marker-label"
                            >
                                ${region.name.toUpperCase()}
                            </div>

                        </div>

                    `,

                    iconSize: [
                        64,
                        64
                    ],

                    iconAnchor: [
                        32,
                        32
                    ]

                });


            markers[index].setIcon(
                icon
            );

            // Update Inundation Circle
            if (inundationLayers[index]) {
                let zoneRadius = 380;
                let fillOpacity = 0.15;
                let strokeOpacity = 0.45;

                const depth = typeof region.waterLevel === 'number'
                    ? region.waterLevel
                    : (rainfall * 0.015);

                if (risk === 'critical') {
                    zoneRadius = Math.min(1800, 1100 + depth * 700);
                    fillOpacity = 0.50;
                    strokeOpacity = 0.95;
                } else if (risk === 'warning') {
                    zoneRadius = Math.min(1300, 750 + depth * 500);
                    fillOpacity = 0.35;
                    strokeOpacity = 0.80;
                } else if (risk === 'watch') {
                    zoneRadius = Math.min(900, 500 + depth * 350);
                    fillOpacity = 0.25;
                    strokeOpacity = 0.60;
                } else {
                    zoneRadius = Math.min(500, 350 + depth * 200);
                }

                inundationLayers[index].setRadius(zoneRadius);
                inundationLayers[index].setStyle({
                    color: color,
                    fillColor: color,
                    fillOpacity: fillOpacity,
                    opacity: strokeOpacity
                });

                // Update tooltip with real live metrics
                const depthDisplay = typeof region.waterLevel === 'number'
                    ? `${(region.waterLevel * 100).toFixed(1)} cm`
                    : `${(rainfall * 1.6).toFixed(1)} cm`;

                const scoreDisplay = typeof region.score === 'number'
                    ? `${region.score} / 100`
                    : `${Math.min(100, Math.round(rainfall * 3.2))} / 100`;

                const floodTimeDisplay = region.hoursToFlood != null
                    ? `<br>⚠️ Breach in: ${region.hoursToFlood} hrs`
                    : '';

                inundationLayers[index].setTooltipContent(`
                    <div style="font-family: sans-serif; font-size: 11px; line-height: 1.4;">
                        <strong style="color:${color}; font-size: 12px;">${region.name.toUpperCase()}</strong><br>
                        Status: <span style="font-weight:700; color:${color};">${risk.toUpperCase()}</span><br>
                        Water Depth: <strong>${depthDisplay}</strong><br>
                        Risk Score: <strong>${scoreDisplay}</strong>
                        ${floodTimeDisplay}
                    </div>
                `);

                // Apply pulsing CSS class when elevated
                const circleElem = inundationLayers[index].getElement();
                if (circleElem) {
                    if (risk === 'critical' || risk === 'warning') {
                        circleElem.classList.add('flood-zone-pulsing');
                    } else {
                        circleElem.classList.remove('flood-zone-pulsing');
                    }
                }
            }

        }

    );

}


/* =====================================================
   STATISTICS
===================================================== */


function calculateStatistics() {

    if (
        latestSimulationData &&
        latestSimulationData.stats
    ) {

        return latestSimulationData.stats;

    }


    let activeZones = 0;

    let criticalZones = 0;


    regions.forEach(

        function (region, index) {

            const risk =
                getRisk(
                    rainfall,
                    index
                );


            if (

                risk === "watch" ||

                risk === "warning" ||

                risk === "critical"

            ) {

                activeZones++;

            }


            if (
                risk === "critical"
            ) {

                criticalZones++;

            }

        }

    );


    return {

        activeZones:
            activeZones,

        criticalZones:
            criticalZones

    };

}


/* =====================================================
   OVERALL RISK
===================================================== */


function calculateOverallRisk() {

    if (
        latestSimulationData &&
        latestSimulationData.overallRisk
    ) {

        return latestSimulationData.overallRisk;

    }


    const stats =
        calculateStatistics();


    if (
        stats.criticalZones > 0
    ) {

        return "CRITICAL";

    }


    if (
        rainfall >= 17
    ) {

        return "WARNING";

    }


    if (
        rainfall >= 8
    ) {

        return "WATCH";

    }


    return "MONITORING";

}


/* =====================================================
   UPDATE DASHBOARD
===================================================== */


function updateDashboard() {

    const riverLevel =
        calculateRiverLevel();


    const stats =
        calculateStatistics();


    const overallRisk =
        calculateOverallRisk();


    /* ---------------------------------------------
       OVERVIEW
    --------------------------------------------- */


    document.getElementById(
        "overviewRainfall"
    ).textContent =
        rainfall;


    document.getElementById(
        "overviewRiverLevel"
    ).textContent =
        riverLevel;


    document.getElementById(
        "overviewActiveZones"
    ).textContent =
        stats.activeZones;


    document.getElementById(
        "overviewCritical"
    ).textContent =
        stats.criticalZones;


    const overviewRisk =
        document.getElementById(
            "overviewRisk"
        );


    overviewRisk.textContent =
        overallRisk;


    if (
        overallRisk === "CRITICAL"
    ) {

        overviewRisk.style.color =
            "var(--red)";

    }

    else if (
        overallRisk === "WARNING"
    ) {

        overviewRisk.style.color =
            "var(--orange)";

    }

    else if (
        overallRisk === "WATCH"
    ) {

        overviewRisk.style.color =
            "var(--yellow)";

    }

    else {

        overviewRisk.style.color =
            "var(--green)";

    }


    document.getElementById(
        "overviewMessage"
    ).textContent =

        stats.activeZones === 0

            ? "All monitored regions are currently within normal conditions."

            : `${stats.activeZones} region(s) are currently under elevated flood risk.`;


    /* ---------------------------------------------
       DAM & RESERVOIR TELEMETRY CARD
    --------------------------------------------- */

    const damCard = document.getElementById("damTelemetryCard");
    const activeBasin = BASINS_DATA[activeBasinId] || BASINS_DATA.mithi;
    const isDam = activeBasin.category === 'dam' || (latestSimulationData && latestSimulationData.damMetrics);

    if (damCard) {
        if (isDam) {
            damCard.style.display = "block";
            const metrics = (latestSimulationData && latestSimulationData.damMetrics) ? latestSimulationData.damMetrics : null;
            const specs = activeBasin.damSpecs || {};

            const nameDisp = document.getElementById("damNameDisplay");
            const subDisp = document.getElementById("damSubtextDisplay");
            const pillDisp = document.getElementById("damStatusPill");
            const levelVal = document.getElementById("damLevelVal");
            const frlVal = document.getElementById("damFrlVal");
            const frlMeter = document.getElementById("damFrlMeter");
            const storageVal = document.getElementById("damLiveStorageVal");
            const storagePercentVal = document.getElementById("damStoragePercentVal");
            const storageMeter = document.getElementById("damStorageMeter");
            const gatesVal = document.getElementById("damGatesVal");
            const gateDesc = document.getElementById("damGateDesc");
            const inflowVal = document.getElementById("damInflowVal");
            const outflowVal = document.getElementById("damOutflowVal");
            const downStatus = document.getElementById("damDownstreamStatus");
            const alertBanner = document.getElementById("damAlertBanner");
            const alertText = document.getElementById("damAlertText");

            if (nameDisp) nameDisp.textContent = activeBasin.name;
            if (subDisp) subDisp.textContent = `${specs.river || 'River Basin'} • ${specs.state || 'India'}`;

            const frl = metrics ? metrics.frl : (specs.frl || 100);
            const curLvl = metrics ? metrics.currentLevel : (specs.currentLevel || (frl - 3));
            const liveCap = metrics ? metrics.liveStorageMm3 : (specs.liveStorageMm3 || 5000);
            const livePct = metrics ? metrics.liveStoragePercent : 85;
            const openGates = metrics ? metrics.openGates : 0;
            const totalGates = specs.gateCount || 10;
            const inCfs = metrics ? metrics.inflowCusecs : (specs.inflowCusecs || 25000);
            const outCfs = metrics ? metrics.outflowCusecs : (specs.outflowCusecs || 8000);
            const damStatus = metrics ? metrics.status : 'NORMAL';

            if (levelVal) levelVal.textContent = curLvl.toFixed(2);
            if (frlVal) frlVal.textContent = frl.toFixed(2);
            if (frlMeter) frlMeter.style.width = `${Math.min(100, Math.max(5, (curLvl / frl) * 100))}%`;

            if (storageVal) storageVal.textContent = Number(liveCap).toLocaleString();
            if (storagePercentVal) storagePercentVal.textContent = `${livePct}%`;
            if (storageMeter) storageMeter.style.width = `${livePct}%`;

            if (gatesVal) gatesVal.textContent = `${openGates} / ${totalGates} GATES OPEN`;
            if (gateDesc) gateDesc.textContent = openGates > 0 ? `Active Discharge: Flood Release` : `Gates Closed: Routine Baseflow`;

            if (inflowVal) inflowVal.textContent = Number(inCfs).toLocaleString();
            if (outflowVal) outflowVal.textContent = Number(outCfs).toLocaleString();

            if (pillDisp) {
                pillDisp.textContent = damStatus.replace('_', ' ');
                pillDisp.className = 'dam-status-pill';
                if (damStatus === 'EMERGENCY_DISCHARGE') {
                    pillDisp.classList.add('critical');
                } else if (damStatus === 'CONTROLLED_SPILL' || damStatus === 'PRECAUTIONARY_DISCHARGE') {
                    pillDisp.classList.add('warning');
                }
            }

            if (downStatus) {
                if (openGates > 0) {
                    downStatus.textContent = `⚠️ High flood surge propagating into downstream channel!`;
                    downStatus.style.color = 'var(--orange)';
                } else {
                    downStatus.textContent = `Downstream channel capacity: Safe`;
                    downStatus.style.color = '#64748b';
                }
            }

            if (alertBanner && alertText) {
                if (metrics && metrics.spillwayAlert) {
                    alertBanner.style.display = "flex";
                    alertText.textContent = metrics.spillwayAlert;
                } else {
                    alertBanner.style.display = "none";
                }
            }
        } else {
            damCard.style.display = "none";
        }
    }


    /* ---------------------------------------------
       RAINFALL
    --------------------------------------------- */


    document.getElementById(
        "rainfallBigValue"
    ).textContent =
        rainfall;


    rainfallSlider.value =
        rainfall;


    simulationSlider.value =
        rainfall;


    document.getElementById(
        "simulationRainfall"
    ).textContent =
        `${rainfall} mm/h`;


    /* ---------------------------------------------
       REGIONAL RAINFALL
    --------------------------------------------- */

    const barsContainer = document.getElementById("rainfallBarsContainer");
    if (barsContainer && regions && regions.length > 0) {
        barsContainer.innerHTML = regions.map(function (region, idx) {
            const regRain = Math.max(0, rainfall + (idx % 3) * 1.5 - (idx === 0 ? 1 : 0));
            const percent = Math.min(100, (regRain / 100) * 100);
            const risk = getRisk(rainfall, idx);
            const col = getRiskColor(risk);
            const depth = typeof region.waterLevel === 'number'
                ? ` • ${(region.waterLevel * 100).toFixed(1)} cm`
                : '';

            return `
                <div class="rainfall-bar-item" style="margin-bottom: 12px; cursor: pointer;" onclick="openRegionInspector(regions[${idx}], ${idx})">
                    <div class="rainfall-bar-header" style="display: flex; justify-content: space-between; margin-bottom: 5px; font-size: 12px;">
                        <span class="region-name" style="font-weight: 600; color: #fff;">${region.name}</span>
                        <span class="rainfall-rate" style="color: ${col}; font-weight: 700;">
                            ${regRain.toFixed(1)} mm/h<span style="color: #94a3b8; font-weight: 400; font-size: 11px;">${depth}</span>
                        </span>
                    </div>
                    <div class="bar-track" style="height: 6px; background: rgba(255,255,255,0.08); border-radius: 3px; overflow: hidden;">
                        <div class="bar-fill" style="width: ${percent}%; height: 100%; background-color: ${col}; border-radius: 3px; transition: width 0.3s ease;"></div>
                    </div>
                </div>
            `;
        }).join('');
    }


    /* ---------------------------------------------
       SIMULATION
    --------------------------------------------- */


    document.getElementById(
        "simulationRisk"
    ).textContent =
        overallRisk;


    document.getElementById(
        "simulationRiver"
    ).textContent =
        `${riverLevel} m`;


    document.getElementById(
        "simulationZones"
    ).textContent =
        stats.activeZones;


    const simulationRisk =
        document.getElementById(
            "simulationRisk"
        );


    if (
        overallRisk === "CRITICAL"
    ) {

        simulationRisk.style.color =
            "var(--red)";

    }

    else if (
        overallRisk === "WARNING"
    ) {

        simulationRisk.style.color =
            "var(--orange)";

    }

    else if (
        overallRisk === "WATCH"
    ) {

        simulationRisk.style.color =
            "var(--yellow)";

    }

    else {

        simulationRisk.style.color =
            "var(--green)";

    }


    const simulationStorage =
        document.getElementById(
            "simulationStorage"
        );

    if (simulationStorage) {

        if (latestSimulationData && latestSimulationData.waterStorage != null) {

            simulationStorage.textContent =
                `${Number(latestSimulationData.waterStorage).toLocaleString()} m³`;

        } else {

            simulationStorage.textContent =
                `${Number((rainfall * 1540).toFixed(0)).toLocaleString()} m³`;

        }

    }


    const simulationEngine =
        document.getElementById(
            "simulationEngine"
        );

    if (simulationEngine) {

        if (backendOnline) {

            simulationEngine.textContent =
                "PHYSICS LIVE";

            simulationEngine.style.color =
                "var(--green)";

        } else {

            simulationEngine.textContent =
                "LOCAL MODE";

            simulationEngine.style.color =
                "var(--yellow)";

        }

    }


    /* ---------------------------------------------
       MAP
    --------------------------------------------- */


    updateMarkers();


    /* ---------------------------------------------
       ALERTS
    --------------------------------------------- */


    updateAlerts();


    /* ---------------------------------------------
       INSPECTOR
    --------------------------------------------- */


    if (
        selectedRegion !== null
    ) {

        updateInspector(

            selectedRegion.region,

            selectedRegion.index

        );

    }

}


/* =====================================================
   TAB SYSTEM
===================================================== */


navButtons.forEach(

    function (button) {

        button.addEventListener(

            "click",

            function () {

                const targetTab =
                    this.dataset.tab;


                /*
                   Clicking the same tab
                   closes the panel.
                */


                if (
                    activeTab === targetTab
                ) {

                    tabPanels.forEach(

                        function (panel) {

                            panel.classList.remove(
                                "active"
                            );

                        }

                    );


                    navButtons.forEach(

                        function (btn) {

                            btn.classList.remove(
                                "active"
                            );

                        }

                    );


                    activeTab = null;

                    return;

                }


                /*
                   Close all panels.
                */


                tabPanels.forEach(

                    function (panel) {

                        panel.classList.remove(
                            "active"
                        );

                    }

                );


                /*
                   Remove all active buttons.
                */


                navButtons.forEach(

                    function (btn) {

                        btn.classList.remove(
                            "active"
                        );

                    }

                );


                /*
                   Find selected panel.
                */


                const selectedPanel =
                    document.querySelector(

                        `[data-panel="${targetTab}"]`

                    );


                if (
                    selectedPanel
                ) {

                    selectedPanel.classList.add(
                        "active"
                    );

                }


                /*
                   Highlight selected button.
                */


                this.classList.add(
                    "active"
                );


                activeTab =
                    targetTab;


            }

        );

    }

);


/* =====================================================
   RAINFALL SLIDER
===================================================== */


rainfallSlider.addEventListener(

    "input",

    function () {

        rainfall =
            Number(
                this.value
            );


        simulationSlider.value =
            rainfall;


        updateDashboard();


        clearTimeout(simulationDebounceTimer);

        simulationDebounceTimer = setTimeout(function () {

            requestSimulation(rainfall, simulationHour);

        }, 200);

    }

);


/* =====================================================
   SIMULATION SLIDER
===================================================== */


simulationSlider.addEventListener(

    "input",

    function () {

        rainfall =
            Number(
                this.value
            );


        rainfallSlider.value =
            rainfall;


        updateDashboard();


        clearTimeout(simulationDebounceTimer);

        simulationDebounceTimer = setTimeout(function () {

            requestSimulation(rainfall, simulationHour);

        }, 200);

    }

);


/* =====================================================
   RUN SIMULATION
===================================================== */


runSimulationBtn.addEventListener(

    "click",

    async function () {

        simulationHour++;

        if (
            simulationHour > 24
        ) {

            simulationHour = 0;

        }


        simulationHourElement.textContent =

            String(
                simulationHour
            ).padStart(
                2,
                "0"
            );


        const originalText = runSimulationBtn.textContent;

        runSimulationBtn.textContent = "SIMULATING...";

        runSimulationBtn.disabled = true;


        try {

            await requestSimulation(rainfall, simulationHour);

        } finally {

            runSimulationBtn.textContent = originalText;

            runSimulationBtn.disabled = false;

        }


        addSimulationAlert();

    }

);


/* =====================================================
   RESET
===================================================== */


resetBtn.addEventListener(

    "click",

    async function () {

        rainfall = 1;

        simulationHour = 0;


        rainfallSlider.value =
            rainfall;


        simulationSlider.value =
            rainfall;


        simulationHourElement.textContent =
            "00";


        latestSimulationData = null;


        updateDashboard();


        clearAlerts();


        await requestSimulation(rainfall, simulationHour);

    }

);


/* =====================================================
   BASIN SELECTOR & SCENARIO CONTROLS
===================================================== */

const basinSelectElement = document.getElementById("basinSelect");

if (basinSelectElement) {
    basinSelectElement.addEventListener("change", function () {
        switchBasin(this.value);
    });
}

const liveDataToggleElement = document.getElementById("liveDataToggle");
const liveStatusTextElement = document.getElementById("liveStatusText");
const mapLiveBadgeElement = document.getElementById("mapLiveWeatherBadge");

if (liveDataToggleElement) {
    liveDataToggleElement.addEventListener("change", async function () {
        liveWeatherActive = this.checked;

        if (liveStatusTextElement) {
            if (liveWeatherActive) {
                liveStatusTextElement.textContent = "ON";
                liveStatusTextElement.classList.add("active");
            } else {
                liveStatusTextElement.textContent = "OFF";
                liveStatusTextElement.classList.remove("active");
            }
        }

        if (liveWeatherActive) {
            await fetchAndApplyLiveWeather(activeBasinId);
            clearInterval(liveWeatherPollTimer);
            liveWeatherPollTimer = setInterval(function () {
                if (liveWeatherActive) {
                    fetchAndApplyLiveWeather(activeBasinId);
                }
            }, 30000);
        } else {
            clearInterval(liveWeatherPollTimer);
            if (mapLiveBadgeElement) {
                mapLiveBadgeElement.style.display = "none";
            }
            updateDashboard();
        }
    });
}

document.querySelectorAll(".scenario-btn").forEach(function (btn) {
    btn.addEventListener("click", function () {
        const rain = Number(this.dataset.rain);
        rainfall = rain;

        if (rainfallSlider) {
            rainfallSlider.value = rainfall;
        }

        if (simulationSlider) {
            simulationSlider.value = rainfall;
        }

        document.querySelectorAll(".scenario-btn").forEach(function (b) {
            if (Number(b.dataset.rain) === rain) {
                b.classList.add("active");
            } else {
                b.classList.remove("active");
            }
        });

        updateDashboard();
        requestSimulation(rainfall, simulationHour);
    });
});


/* =====================================================
   REGION INSPECTOR
===================================================== */


function openRegionInspector(
    region,
    index
) {

    selectedRegion = {

        region:
            region,

        index:
            index

    };


    updateInspector(
        region,
        index
    );


    document.getElementById(
        "regionInspector"
    ).classList.add(
        "open"
    );

}


/* =====================================================
   UPDATE INSPECTOR
===================================================== */


function updateInspector(
    region,
    index
) {

    const risk =
        getRisk(
            rainfall,
            index
        );


    const riverLevel =
        calculateRiverLevel();


    document.getElementById(
        "inspectorName"
    ).textContent =
        region.name;


    document.getElementById(
        "inspectorLocation"
    ).textContent =
        "Mumbai Metropolitan Region";


    document.getElementById(
        "inspectorRainfall"
    ).textContent =
        `${rainfall} mm/h`;


    document.getElementById(
        "inspectorRiver"
    ).textContent =
        `${riverLevel} m`;


    const riskElement =
        document.getElementById(
            "inspectorRisk"
        );


    riskElement.textContent =
        risk.toUpperCase();


    riskElement.style.color =
        getRiskColor(
            risk
        );


    const depthElement =
        document.getElementById(
            "inspectorDepth"
        );

    if (depthElement) {

        if (typeof region.waterLevel === "number") {

            depthElement.textContent =
                `${(region.waterLevel * 100).toFixed(1)} cm`;

        } else {

            depthElement.textContent =
                `${(rainfall * 1.6).toFixed(1)} cm`;

        }

    }


    const scoreElement =
        document.getElementById(
            "inspectorScore"
        );

    if (scoreElement) {

        if (typeof region.score === "number") {

            scoreElement.textContent =
                `${region.score} / 100`;

        } else {

            scoreElement.textContent =
                `${Math.min(100, Math.round(rainfall * 3.2))} / 100`;

        }

    }

}


/* =====================================================
   CLOSE INSPECTOR
===================================================== */


document.getElementById(
    "closeInspector"
).addEventListener(

    "click",

    function () {

        document.getElementById(
            "regionInspector"
        ).classList.remove(
            "open"
        );


        selectedRegion = null;

    }

);


/* =====================================================
   ALERT SYSTEM
===================================================== */


function updateAlerts() {

    alertsList.innerHTML = "";


    regions.forEach(

        function (region, index) {

            const risk =
                getRisk(
                    rainfall,
                    index
                );


            if (

                risk === "warning" ||

                risk === "critical"

            ) {

                addAlert(

                    region.name,

                    risk,

                    rainfall

                );

            }

        }

    );


    if (
        alertsList.children.length === 0
    ) {

        addAlert(

            "SYSTEM STATUS",

            "safe",

            rainfall

        );

    }

}


/* =====================================================
   ADD ALERT
===================================================== */


function addAlert(
    location,
    risk,
    rainfallValue
) {

    const alert =
        document.createElement(
            "div"
        );


    let alertClass =
        "warning";


    if (
        risk === "critical"
    ) {

        alertClass =
            "critical";

    }


    if (
        risk === "safe"
    ) {

        alertClass =
            "safe";

    }


    alert.className =
        `alert ${alertClass}`;


    alert.innerHTML = `

        <div class="alert-header">

            <span class="alert-location">
                ${location}
            </span>

            <span class="alert-risk">
                ${risk.toUpperCase()}
            </span>

        </div>


        <div class="alert-details">

            Rainfall:
            ${rainfallValue} mm/hr

            <br>

            Monitoring flood conditions
            in this region.

        </div>

    `;


    alertsList.appendChild(
        alert
    );

}


/* =====================================================
   SIMULATION ALERT
===================================================== */


function addSimulationAlert() {

    const overallRisk =
        calculateOverallRisk();


    if (
        overallRisk === "MONITORING"
    ) {

        return;

    }


    addAlert(

        "SIMULATION ENGINE",

        overallRisk.toLowerCase(),

        rainfall

    );

}


/* =====================================================
   CLEAR ALERTS
===================================================== */


function clearAlerts() {

    alertsList.innerHTML = "";


    addAlert(

        "SYSTEM STATUS",

        "safe",

        rainfall

    );

}


/* =====================================================
   BACKEND API INTEGRATION
===================================================== */


async function checkBackendHealth() {

    const statusElem =
        document.getElementById(
            "backendStatus"
        );

    const dotElem =
        document.getElementById(
            "backendDot"
        );

    const textElem =
        document.getElementById(
            "backendStatusText"
        );

    const engineElem =
        document.getElementById(
            "simulationEngine"
        );


    try {

        const response =
            await fetch(
                `${API_BASE}/health`
            );

        if (response.ok) {

            backendOnline = true;

            if (statusElem) {

                statusElem.className =
                    "status-value online";

            }

            if (dotElem) {

                dotElem.className =
                    "online-dot";

            }

            if (textElem) {

                textElem.textContent =
                    "ONLINE";

            }

            if (engineElem) {

                engineElem.textContent =
                    "PHYSICS LIVE";

                engineElem.style.color =
                    "var(--green)";

            }

            return true;

        }

    } catch (err) {

        // Backend unreachable

    }


    backendOnline = false;

    if (statusElem) {

        statusElem.className =
            "status-value offline";

    }

    if (dotElem) {

        dotElem.className =
            "online-dot offline-dot";

    }

    if (textElem) {

        textElem.textContent =
            "OFFLINE";

    }

    if (engineElem) {

        engineElem.textContent =
            "LOCAL MODE";

        engineElem.style.color =
            "var(--yellow)";

    }

    return false;

}


async function requestSimulation(
    rainValue,
    hourValue
) {

    try {

        const response =
            await fetch(
                `${API_BASE}/simulate`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        basinId: activeBasinId,
                        rainfall: Number(rainValue),
                        simulationHour: Number(hourValue)
                    })
                }
            );

        if (response.ok) {

            const json =
                await response.json();

            if (
                json.success &&
                json.data
            ) {

                backendOnline = true;

                latestSimulationData =
                    json.data;


                if (
                    Array.isArray(
                        latestSimulationData.regions
                    )
                ) {

                    latestSimulationData.regions.forEach(
                        function (resRegion) {

                            const matched =
                                regions.find(
                                    function (r) {

                                        return r.name.toLowerCase() === resRegion.name.toLowerCase() ||
                                               (r.id && r.id.toLowerCase() === resRegion.id.toLowerCase());

                                    }
                                );

                            if (matched) {

                                matched.waterLevel =
                                    resRegion.waterLevel;

                                matched.risk =
                                    resRegion.level
                                        ? resRegion.level.toLowerCase()
                                        : "safe";

                                matched.score =
                                    resRegion.score;

                                matched.floodThreshold =
                                    resRegion.floodThreshold;

                                matched.riseRate =
                                    resRegion.riseRate;

                                matched.fillRatio =
                                    resRegion.fillRatio;

                                matched.hoursToFlood =
                                    resRegion.hoursToFlood;

                                matched.flooded =
                                    resRegion.flooded;

                            }

                        }
                    );

                }


                updateDashboard();

                updateMarkers();

                updateAlerts();


                if (selectedRegion) {

                    updateInspector(
                        selectedRegion.region,
                        selectedRegion.index
                    );

                }

                return;

            }

        }

    } catch (err) {

        console.warn(
            "Backend simulation unreachable:",
            err.message
        );

    }


    updateDashboard();

    updateMarkers();

    updateAlerts();

    if (selectedRegion) {

        updateInspector(
            selectedRegion.region,
            selectedRegion.index
        );

    }

}


/* =====================================================
   SIMULATION CLOCK
===================================================== */


setInterval(

    function () {

        if (
            activeTab === "simulation"
        ) {

            simulationHour++;


            if (
                simulationHour > 24
            ) {

                simulationHour = 0;

            }


            simulationHourElement.textContent =

                String(
                    simulationHour
                ).padStart(
                    2,
                    "0"
                );


            requestSimulation(
                rainfall,
                simulationHour
            );

        }

    },

    5000

);


/* =====================================================
   INITIALIZE
===================================================== */


updateDashboard();


clearAlerts();


checkBackendHealth().then(

    function (isOnline) {

        if (isOnline) {

            requestSimulation(
                rainfall,
                simulationHour
            );

        }

    }

);


setInterval(
    checkBackendHealth,
    10000
);


/*
   Start with all tabs closed.
   This gives maximum map visibility.
*/


tabPanels.forEach(

    function (panel) {

        panel.classList.remove(
            "active"
        );

    }

);


navButtons.forEach(

    function (button) {

        button.classList.remove(
            "active"
        );

    }

);


activeTab = null;


/*
   Final Leaflet size correction.
*/


setTimeout(

    function () {

        map.invalidateSize(true);

    },

    500

);