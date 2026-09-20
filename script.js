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


const regions = [

    {
        name: "Powai",
        lat: 19.1197,
        lng: 72.9051
    },

    {
        name: "Saki Naka",
        lat: 19.1074,
        lng: 72.8846
    },

    {
        name: "Kurla",
        lat: 19.0726,
        lng: 72.8845
    },

    {
        name: "BKC",
        lat: 19.0668,
        lng: 72.8686
    },

    {
        name: "Dharavi",
        lat: 19.0410,
        lng: 72.8493
    },

    {
        name: "Mahim",
        lat: 19.0410,
        lng: 72.8397
    }

];


/* =====================================================
   APPLICATION STATE
===================================================== */


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

    return (

        1.5 +

        rainfall * 0.08

    ).toFixed(1);

}


/* =====================================================
   MAP MARKERS
===================================================== */


const markers = [];


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


        const marker =
            L.marker(

                [
                    region.lat,
                    region.lng
                ],

                {
                    icon: icon
                }

            ).addTo(map);


        marker.on(

            "click",

            function () {

                openRegionInspector(
                    region,
                    index
                );

            }

        );


        markers.push(
            marker
        );

    }

);


/* =====================================================
   UPDATE MAP MARKERS
===================================================== */


function updateMarkers() {

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

        }

    );

}


/* =====================================================
   STATISTICS
===================================================== */


function calculateStatistics() {

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


    const mithi =
        rainfall;


    const powai =
        rainfall;


    const kurla =
        rainfall + 2;


    const mahim =
        rainfall + 3;


    document.getElementById(
        "mithiRainfall"
    ).textContent =
        mithi;


    document.getElementById(
        "powaiRainfall"
    ).textContent =
        powai;


    document.getElementById(
        "kurlaRainfall"
    ).textContent =
        kurla;


    document.getElementById(
        "mahimRainfall"
    ).textContent =
        mahim;


    document.getElementById(
        "mithiBar"
    ).style.width =
        `${Math.min(
            100,
            (mithi / 30) * 100
        )}%`;


    document.getElementById(
        "powaiBar"
    ).style.width =
        `${Math.min(
            100,
            (powai / 30) * 100
        )}%`;


    document.getElementById(
        "kurlaBar"
    ).style.width =
        `${Math.min(
            100,
            (kurla / 30) * 100
        )}%`;


    document.getElementById(
        "mahimBar"
    ).style.width =
        `${Math.min(
            100,
            (mahim / 30) * 100
        )}%`;


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


        updateDashboard();

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

    }

);


/* =====================================================
   RUN SIMULATION
===================================================== */


runSimulationBtn.addEventListener(

    "click",

    function () {

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


        updateDashboard();


        addSimulationAlert();

    }

);


/* =====================================================
   RESET
===================================================== */


resetBtn.addEventListener(

    "click",

    function () {

        rainfall = 1;

        simulationHour = 0;


        rainfallSlider.value =
            rainfall;


        simulationSlider.value =
            rainfall;


        simulationHourElement.textContent =
            "00";


        updateDashboard();

        clearAlerts();

    }

);


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

        }

    },

    5000

);


/* =====================================================
   INITIALIZE
===================================================== */


updateDashboard();


clearAlerts();


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