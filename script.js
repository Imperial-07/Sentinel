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
    mithi: {
        id: "mithi",
        name: "Mithi River Catchment",
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
            radius: 400,
            color: initialColor,
            fillColor: initialColor,
            fillOpacity: 0.16,
            weight: 1.5,
            dashArray: '5, 5'
        }).addTo(map);

        circle.bindTooltip(`<strong>${region.name.toUpperCase()}</strong><br>Monitoring Station`, {
            direction: 'top',
            className: 'flood-tooltip'
        });

        circle.on('click', function () {
            openRegionInspector(region, index);
        });

        inundationLayers.push(circle);

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
                        ${region.name.toUpperCase()}
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
            duration: 1.2,
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
        titleElem.textContent = `${(basin.name || basinId).toUpperCase()} • LIVE HYDROLOGY`;
    }

    // Reset inspector
    selectedRegion = null;
    const inspector = document.getElementById("regionInspector");
    if (inspector) {
        inspector.classList.remove("open");
    }

    // Rebuild station markers & hazard circles
    rebuildStationLayers();

    // Reset current simulation state & trigger fresh simulation for this basin
    latestSimulationData = null;
    updateDashboard();
    await requestSimulation(rainfall, simulationHour);
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