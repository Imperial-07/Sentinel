import { useEffect, useRef, useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "./App.css";

const API_URLS = [
  "http://localhost:5000/api/simulate",
  "http://localhost:5001/api/simulate",
];

/* =========================================================
   SENTINEL MONITORING SYSTEMS
   Based on the original Sentinel basin configuration
========================================================= */

const SYSTEMS = [
  /* =====================================================
     URBAN BASINS
  ===================================================== */

  {
    id: "mithi",
    group: "Urban Basins (Mumbai MMR)",
    name: "Mithi River (Central Mumbai)",
    monitorName: "Mithi River Catchment",
    river: "Mithi River",
    region: "Central Mumbai",
    center: [19.076, 72.872],
    zoom: 12,
    riverPath: [
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
      [19.0380, 72.8310],
    ],
  },

  {
    id: "ulhas",
    group: "Urban Basins (Mumbai MMR)",
    name: "Ulhas River (Eastern Metro / Thane)",
    monitorName: "Ulhas River Basin",
    river: "Ulhas River",
    region: "Eastern Metro / Thane",
    center: [19.225, 73.115],
    zoom: 11,
    riverPath: [
      [19.1663, 73.2370],
      [19.1850, 73.1820],
      [19.2210, 73.1550],
      [19.2437, 73.1355],
      [19.2183, 73.0867],
      [19.1890, 73.0450],
      [19.1982, 72.9781],
      [19.1550, 72.9980],
    ],
  },

  {
    id: "dahisar",
    group: "Urban Basins (Mumbai MMR)",
    name: "Dahisar River (North / SGNP)",
    monitorName: "Dahisar River Basin",
    river: "Dahisar River",
    region: "North Mumbai / SGNP",
    center: [19.245, 72.860],
    zoom: 13,
    riverPath: [
      [19.2315, 72.9150],
      [19.2410, 72.8870],
      [19.2475, 72.8680],
      [19.2520, 72.8530],
      [19.2505, 72.8390],
      [19.2430, 72.8220],
    ],
  },

  {
    id: "oshiwara",
    group: "Urban Basins (Mumbai MMR)",
    name: "Oshiwara River (Western Suburbs)",
    monitorName: "Oshiwara River Basin",
    river: "Oshiwara River",
    region: "Western Suburbs",
    center: [19.145, 72.840],
    zoom: 13,
    riverPath: [
      [19.1460, 72.8930],
      [19.1550, 72.8750],
      [19.1580, 72.8520],
      [19.1500, 72.8360],
      [19.1380, 72.8260],
      [19.1320, 72.8120],
    ],
  },

  /* =====================================================
     NATIONAL RIVER BASINS
  ===================================================== */

  {
    id: "ganga",
    group: "National River Basins (India)",
    name: "Ganga River Basin (Rishikesh to Farakka)",
    monitorName: "Ganga River Basin",
    river: "Ganga",
    region: "Rishikesh to Farakka",
    center: [25.6127, 85.1444],
    zoom: 7,
    riverPath: [
      [30.0869, 78.2676],
      [29.9457, 78.1642],
      [26.4499, 80.3319],
      [25.4358, 81.8463],
      [25.3176, 83.0062],
      [25.6127, 85.1444],
      [24.8016, 87.9257],
    ],
  },

  {
    id: "brahmaputra",
    group: "National River Basins (India)",
    name: "Brahmaputra Basin (Assam Corridor)",
    monitorName: "Brahmaputra River Basin",
    river: "Brahmaputra",
    region: "Assam Corridor",
    center: [26.1856, 91.7476],
    zoom: 7,
    riverPath: [
      [28.0664, 95.3268],
      [27.4728, 94.9120],
      [26.6528, 92.7926],
      [26.1856, 91.7476],
      [26.1786, 90.6277],
      [26.0208, 89.9754],
    ],
  },

  {
    id: "narmada",
    group: "National River Basins (India)",
    name: "Narmada Basin (Amarkantak to Bharuch)",
    monitorName: "Narmada River Basin",
    river: "Narmada",
    region: "Amarkantak to Bharuch",
    center: [22.2500, 76.5000],
    zoom: 7,
    riverPath: [
      [22.6734, 81.7588],
      [23.1290, 79.8000],
      [22.7533, 77.7249],
      [22.2435, 76.1500],
      [21.8322, 73.7489],
      [21.7051, 72.9959],
    ],
  },

  {
    id: "godavari",
    group: "National River Basins (India)",
    name: "Godavari Basin (Nashik to Rajahmundry)",
    monitorName: "Godavari River Basin",
    river: "Godavari",
    region: "Nashik to Rajahmundry",
    center: [18.9000, 78.5000],
    zoom: 7,
    riverPath: [
      [19.9975, 73.7898],
      [19.8821, 74.4789],
      [19.1526, 77.3196],
      [17.6688, 80.8936],
      [16.9891, 81.7840],
    ],
  },

  {
    id: "krishna",
    group: "National River Basins (India)",
    name: "Krishna Basin (Mahabaleshwar to Delta)",
    monitorName: "Krishna River Basin",
    river: "Krishna",
    region: "Mahabaleshwar to Delta",
    center: [16.5000, 76.5000],
    zoom: 7,
    riverPath: [
      [17.9237, 73.6586],
      [16.8524, 74.5815],
      [16.3317, 75.8883],
      [16.0886, 78.8970],
      [16.5062, 80.6480],
    ],
  },

  /* =====================================================
     HIMALAYAN & TRANSBOUNDARY
  ===================================================== */

  {
    id: "bagmati-nepal",
    group: "Himalayan & Transboundary (Nepal)",
    name: "Bagmati River (Kathmandu Valley & Terai)",
    monitorName: "Bagmati River Basin",
    river: "Bagmati",
    region: "Kathmandu Valley & Terai",
    center: [27.7000, 85.3200],
    zoom: 10,
    riverPath: [
      [27.7650, 85.4250],
      [27.7105, 85.3485],
      [27.6880, 85.3020],
      [27.6580, 85.2920],
      [27.5620, 85.2280],
      [27.1420, 85.4850],
    ],
  },

  {
    id: "koshi-nepal",
    group: "Himalayan & Transboundary (Nepal)",
    name: "Koshi River Basin (Saptakoshi / Nepal - Bihar)",
    monitorName: "Koshi River Basin",
    river: "Koshi",
    region: "Nepal - Bihar",
    center: [26.8680, 87.1580],
    zoom: 8,
    riverPath: [
      [27.7850, 85.9000],
      [26.9320, 87.3320],
      [26.8680, 87.1580],
      [26.8150, 87.1400],
      [26.5220, 86.9230],
    ],
  },

  /* =====================================================
     MAJOR DAMS & RESERVOIRS
  ===================================================== */

  {
    id: "sardar-sarovar",
    group: "Major Dams & Reservoirs",
    name: "Sardar Sarovar Dam (Narmada / Gujarat)",
    monitorName: "Sardar Sarovar Dam",
    river: "Narmada",
    region: "Gujarat",
    center: [21.8322, 73.7489],
    zoom: 12,
    frl: 138.68,
    currentLevel: 133.20,
    capacity: 9500,
    gates: 30,
    riverPath: [
      [21.8500, 73.8500],
      [21.8322, 73.7489],
      [21.8150, 73.6800],
      [21.7800, 73.5500],
      [21.7500, 73.3500],
      [21.7051, 72.9959],
    ],
  },

  {
    id: "tehri-dam",
    group: "Major Dams & Reservoirs",
    name: "Tehri Dam & Reservoir (Bhagirathi / Uttarakhand)",
    monitorName: "Tehri Dam & Reservoir",
    river: "Bhagirathi",
    region: "Uttarakhand",
    center: [30.3781, 78.4806],
    zoom: 12,
    frl: 830.0,
    currentLevel: 818.5,
    capacity: 3540,
    gates: 4,
    riverPath: [
      [30.4200, 78.5300],
      [30.3781, 78.4806],
      [30.1458, 78.5989],
      [30.0869, 78.2676],
      [29.9457, 78.1642],
    ],
  },

  {
    id: "hirakud-dam",
    group: "Major Dams & Reservoirs",
    name: "Hirakud Dam & Reservoir (Mahanadi / Odisha)",
    monitorName: "Hirakud Dam & Reservoir",
    river: "Mahanadi",
    region: "Odisha",
    center: [21.5284, 83.8690],
    zoom: 12,
    frl: 192.02,
    currentLevel: 189.40,
    capacity: 8136,
    gates: 98,
    riverPath: [
      [21.5800, 83.7500],
      [21.5284, 83.8690],
      [21.4669, 83.9812],
      [20.8400, 83.9100],
      [20.4625, 85.8828],
    ],
  },

  {
    id: "idukki-dam",
    group: "Major Dams & Reservoirs",
    name: "Idukki Dam & Cheruthoni Spillway (Periyar / Kerala)",
    monitorName: "Idukki Dam & Cheruthoni Spillway",
    river: "Periyar",
    region: "Kerala",
    center: [9.8499, 76.9725],
    zoom: 12,
    frl: 732.43,
    currentLevel: 724.80,
    capacity: 1996,
    gates: 5,
    riverPath: [
      [9.8600, 77.0200],
      [9.8499, 76.9725],
      [9.8750, 76.9200],
      [10.1076, 76.3516],
      [9.9816, 76.2999],
    ],
  },

  {
    id: "koyna-dam",
    group: "Major Dams & Reservoirs",
    name: "Koyna Dam & Shivajisagar (Koyna / Krishna)",
    monitorName: "Koyna Dam & Shivajisagar",
    river: "Koyna / Krishna",
    region: "Maharashtra",
    center: [17.4000, 73.7500],
    zoom: 12,
    frl: 657.91,
    currentLevel: 651.20,
    capacity: 2797,
    gates: 6,
    riverPath: [
      [17.4800, 73.7200],
      [17.4000, 73.7500],
      [17.3800, 73.8500],
      [17.2890, 74.1816],
      [16.8524, 74.5815],
    ],
  },

  {
    id: "nagarjuna-sagar",
    group: "Major Dams & Reservoirs",
    name: "Nagarjuna Sagar Dam (Krishna / AP-TS)",
    monitorName: "Nagarjuna Sagar Dam",
    river: "Krishna",
    region: "Telangana / Andhra Pradesh",
    center: [16.5786, 79.3130],
    zoom: 12,
    frl: 179.83,
    currentLevel: 175.40,
    capacity: 11560,
    gates: 26,
    riverPath: [
      [16.6500, 79.2000],
      [16.5786, 79.3130],
      [16.7100, 79.6200],
      [16.5750, 80.3550],
      [16.5062, 80.6480],
    ],
  },
];


const SYSTEM_COLORS = {
  mithi: "#c28b72",
  ulhas: "#7fa6a0",
  dahisar: "#9a91b5",
  oshiwara: "#b39a63",

  ganga: "#6f9f9a",
  brahmaputra: "#8f9f72",
  narmada: "#a98578",
  godavari: "#7e96ad",
  krishna: "#9b826f",

  "bagmati-nepal": "#728fa1",
  "koshi-nepal": "#9b8a67",

  "sardar-sarovar": "#8c9b78",
  "tehri-dam": "#718e9d",
  "hirakud-dam": "#a58b73",
  "idukki-dam": "#769b8c",
  "koyna-dam": "#9a7f8c",
  "nagarjuna-sagar": "#7d8f9f",
};

const GROUPS = [
  "Urban Basins (Mumbai MMR)",
  "National River Basins (India)",
  "Himalayan & Transboundary (Nepal)",
  "Major Dams & Reservoirs",
];

/* =========================================================
   CUSTOM SYSTEM DROPDOWN
   This replaces the browser-native <select>
========================================================= */

function SystemDropdown({
  selectedSystem,
  selectedSystemId,
  onSelect,
}) {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target)
      ) {
        setOpen(false);
      }
    };

    document.addEventListener(
      "mousedown",
      handleOutsideClick
    );

    return () => {
      document.removeEventListener(
        "mousedown",
        handleOutsideClick
      );
    };
  }, []);

  return (
    <div
      ref={dropdownRef}
      style={{
        position: "relative",
        width: "100%",
      }}
    >
      {/* Current selected system */}

      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        style={{
          width: "100%",
          minHeight: "46px",
          padding: "0 38px 0 14px",
          border: "1px solid rgba(135, 210, 218, 0.35)",
          borderRadius: "6px",
          background: "rgba(9, 18, 20, 0.94)",
          color: "#e7f2f1",
          fontFamily: "inherit",
          fontSize: "12px",
          fontWeight: "600",
          textAlign: "left",
          cursor: "pointer",
          position: "relative",
          boxSizing: "border-box",
          overflow: "hidden",
          whiteSpace: "nowrap",
          textOverflow: "ellipsis",
        }}
      >
        {selectedSystem.name}

        <span
          style={{
            position: "absolute",
            right: "14px",
            top: "50%",
            transform: open
              ? "translateY(-50%) rotate(180deg)"
              : "translateY(-50%)",
            fontSize: "15px",
            color: "#c5d9d8",
            transition: "transform 0.2s ease",
          }}
        >
          ▾
        </span>
      </button>

      {/* Custom dropdown panel */}

      {open && (
        <div
          style={{
            position: "absolute",
            top: "calc(100% + 8px)",
            left: 0,
            width: "min(560px, 78vw)",
            maxHeight: "min(560px, calc(100vh - 120px))",
            overflowY: "auto",
            overflowX: "hidden",
            zIndex: 99999,
            padding: "8px",
            boxSizing: "border-box",
            border: "1px solid rgba(140, 205, 211, 0.38)",
            borderRadius: "12px",
            background: "rgba(13, 21, 23, 0.98)",
            boxShadow:
              "0 18px 50px rgba(0, 0, 0, 0.55), 0 0 0 1px rgba(255,255,255,0.03)",
            backdropFilter: "blur(18px)",
            WebkitBackdropFilter: "blur(18px)",
          }}
        >
          {GROUPS.map((group) => {
            const groupSystems = SYSTEMS.filter(
              (system) => system.group === group
            );

            return (
              <div
                key={group}
                style={{
                  marginBottom: "7px",
                }}
              >
                {/* Group title */}

                <div
                  style={{
                    padding: "10px 12px 7px",
                    color: "#7eaaa9",
                    fontSize: "10px",
                    fontWeight: "700",
                    letterSpacing: "0.12em",
                    textTransform: "uppercase",
                    borderBottom:
                      "1px solid rgba(130, 190, 195, 0.12)",
                  }}
                >
                  {group}
                </div>

                {/* Group options */}

                {groupSystems.map((system) => {
                  const isSelected =
                    system.id === selectedSystemId;

                  return (
                    <button
                      key={system.id}
                      type="button"
                      onClick={() => {
                        onSelect(system.id);
                        setOpen(false);
                      }}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        width: "100%",
                        minHeight: "38px",
                        padding: "8px 12px",
                        border: "none",
                        borderRadius: "6px",
                        background: isSelected
                          ? "rgba(38, 111, 129, 0.52)"
                          : "transparent",
                        color: isSelected
                          ? "#ffffff"
                          : "#d3dfde",
                        fontFamily: "inherit",
                        fontSize: "12px",
                        fontWeight: isSelected
                          ? "700"
                          : "500",
                        textAlign: "left",
                        cursor: "pointer",
                        marginTop: "2px",
                        boxSizing: "border-box",
                        transition:
                          "background 0.15s ease, color 0.15s ease",
                      }}
                      onMouseEnter={(event) => {
                        if (!isSelected) {
                          event.currentTarget.style.background =
                            "rgba(96, 151, 160, 0.16)";
                          event.currentTarget.style.color =
                            "#ffffff";
                        }
                      }}
                      onMouseLeave={(event) => {
                        if (!isSelected) {
                          event.currentTarget.style.background =
                            "transparent";
                          event.currentTarget.style.color =
                            "#d3dfde";
                        }
                      }}
                    >
                      {isSelected && (
                        <span
                          style={{
                            width: "18px",
                            marginRight: "4px",
                            color: "#8de0df",
                            fontSize: "13px",
                          }}
                        >
                          ✓
                        </span>
                      )}

                      {!isSelected && (
                        <span
                          style={{
                            width: "18px",
                            marginRight: "4px",
                          }}
                        />
                      )}

                      <span
                        style={{
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {system.name}
                      </span>
                    </button>
                  );
                })}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

/* =========================================================
   MAIN APP
========================================================= */

function App() {
  const [selectedSystemId, setSelectedSystemId] =
    useState("idukki-dam");

  const [activeTab, setActiveTab] =
    useState("Overview");

  const [panelOpen, setPanelOpen] =
    useState(true);

  const [liveData, setLiveData] =
    useState(false);

  const [backendOnline, setBackendOnline] =
    useState(false);

  const [rainfall, setRainfall] =
    useState(120);

  const [drainageCapacity, setDrainageCapacity] =
    useState(80);

  const [riskLevel, setRiskLevel] =
    useState("WATCH");

  const [riskIndex, setRiskIndex] =
    useState(37);

  const [simulationRunning, setSimulationRunning] =
    useState(false);

  const [simulationResult, setSimulationResult] =
    useState(null);

  const mapRef = useRef(null);
  const mapInstance = useRef(null);
  const mapLayers = useRef(null);

  const selectedSystem =
    SYSTEMS.find(
      (system) =>
        system.id === selectedSystemId
    ) || SYSTEMS[0];

  const systemColor =
    SYSTEM_COLORS[selectedSystem.id] ||
    "#7eaaa9";

  /* =====================================================
     FALLBACK RISK
  ===================================================== */

  const calculateFallbackRisk = (
    rain,
    drainage
  ) => {
    const pressure =
      Number(rain) - Number(drainage);

    let level = "NORMAL";

    if (pressure >= 180) {
      level = "CRITICAL";
    } else if (pressure >= 100) {
      level = "HIGH";
    } else if (pressure >= 40) {
      level = "WATCH";
    }

    const index = Math.max(
      0,
      Math.min(
        100,
        Math.round(
          (Number(rain) / 300) * 65 +
            (pressure / 300) * 35
        )
      )
    );

    return {
      level,
      index,
    };
  };

  /* =====================================================
     RUN SIMULATION
  ===================================================== */

  const runSimulation = async () => {
    setSimulationRunning(true);

    let backendResult = null;

    for (const apiUrl of API_URLS) {
      try {
        const response = await fetch(
          apiUrl,
          {
            method: "POST",
            headers: {
              "Content-Type":
                "application/json",
            },
            body: JSON.stringify({
              rainfall:
                Number(rainfall),
              drainageCapacity:
                Number(
                  drainageCapacity
                ),
              systemId:
                selectedSystem.id,
            }),
          }
        );

        if (!response.ok) {
          continue;
        }

        const result =
          await response.json();

        backendResult = result;

        setBackendOnline(true);

        break;
      } catch (error) {
        // Try next backend.
      }
    }

    if (backendResult) {
      const data =
        backendResult.data ||
        backendResult;

      const backendRisk =
        data.riskLevel ||
        data.level ||
        data.risk ||
        null;

      const backendIndex =
        data.riskIndex ??
        data.index ??
        data.score ??
        null;

      if (backendRisk) {
        setRiskLevel(
          String(
            backendRisk
          ).toUpperCase()
        );
      }

      if (
        backendIndex !== null &&
        !Number.isNaN(
          Number(backendIndex)
        )
      ) {
        setRiskIndex(
          Math.round(
            Number(backendIndex)
          )
        );
      }

      setSimulationResult(data);
    } else {
      setBackendOnline(false);

      const fallback =
        calculateFallbackRisk(
          rainfall,
          drainageCapacity
        );

      setRiskLevel(
        fallback.level
      );

      setRiskIndex(
        fallback.index
      );

      setSimulationResult({
        rainfall,
        drainageCapacity,
        source:
          "Local fallback calculation",
      });
    }

    setSimulationRunning(false);
  };

  /* =====================================================
     MAP INITIALIZATION
  ===================================================== */

  useEffect(() => {
    if (
      !mapRef.current ||
      mapInstance.current
    ) {
      return;
    }

    const map =
      L.map(mapRef.current, {
        zoomControl: false,
        attributionControl: true,
        preferCanvas: true,
      }).setView(
        selectedSystem.center,
        selectedSystem.zoom
      );

    L.tileLayer(
      "https://tile.openstreetmap.org/{z}/{x}/{y}.png",
      {
        maxZoom: 19,
        minZoom: 4,
        attribution:
          "&copy; OpenStreetMap contributors",
      }
    ).addTo(map);

    mapInstance.current = map;

    mapLayers.current =
      L.layerGroup().addTo(map);

    setTimeout(() => {
      map.invalidateSize(true);
    }, 300);

    return () => {
      map.remove();
      mapInstance.current = null;
    };
  }, []);

  /* =====================================================
     UPDATE MAP WHEN SYSTEM CHANGES
  ===================================================== */

  useEffect(() => {
    const map =
      mapInstance.current;

    if (!map) {
      return;
    }

    map.flyTo(
      selectedSystem.center,
      selectedSystem.zoom,
      {
        duration: 1.2,
      }
    );

    if (mapLayers.current) {
      mapLayers.current.clearLayers();
    }

    const layers =
      mapLayers.current;

    /* River */

    if (
      selectedSystem.riverPath &&
      selectedSystem.riverPath.length > 1
    ) {
      L.polyline(
        selectedSystem.riverPath,
        {
          color: systemColor,
          weight: 5,
          opacity: 0.9,
          lineCap: "round",
          lineJoin: "round",
        }
      ).addTo(layers);

      L.polyline(
        selectedSystem.riverPath,
        {
          color: systemColor,
          weight: 1,
          opacity: 0.55,
        }
      ).addTo(layers);
    }

    /* Monitoring zone */

    L.circle(
      selectedSystem.center,
      {
        radius:
          selectedSystem.group ===
          "Major Dams & Reservoirs"
            ? 4500
            : selectedSystem.zoom >= 10
            ? 5500
            : 18000,

        color: systemColor,
        weight: 1,
        opacity: 0.55,
        fillColor: systemColor,
        fillOpacity: 0.07,
      }
    ).addTo(layers);

    /* Main monitoring point */

    const marker =
      L.circleMarker(
        selectedSystem.center,
        {
          radius: 8,
          color: "#edf2ef",
          weight: 2,
          fillColor: systemColor,
          fillOpacity: 0.95,
        }
      ).addTo(layers);

    marker.bindTooltip(
      selectedSystem.name,
      {
        direction: "top",
        offset: [0, -8],
        className:
          "sentinel-map-tooltip",
      }
    );

    /* Start/end river points */

    if (
      selectedSystem.riverPath &&
      selectedSystem.riverPath.length > 2
    ) {
      selectedSystem.riverPath.forEach(
        (point, index) => {
          if (
            index === 0 ||
            index ===
              selectedSystem
                .riverPath
                .length -
                1
          ) {
            L.circleMarker(
              point,
              {
                radius: 3,
                color: systemColor,
                weight: 1,
                fillColor:
                  systemColor,
                fillOpacity: 0.8,
              }
            ).addTo(layers);
          }
        }
      );
    }
  }, [selectedSystem]);

  /* =====================================================
     MAP RESIZE
  ===================================================== */

  useEffect(() => {
    const handleResize = () => {
      if (mapInstance.current) {
        mapInstance.current.invalidateSize(
          true
        );
      }
    };

    window.addEventListener(
      "resize",
      handleResize
    );

    return () => {
      window.removeEventListener(
        "resize",
        handleResize
      );
    };
  }, []);

  /* =====================================================
     SYSTEM SELECTION
  ===================================================== */

  const handleSystemSelect = (
    systemId
  ) => {
    setSelectedSystemId(
      systemId
    );

    setSimulationResult(null);

    setRiskLevel("WATCH");

    setRiskIndex(37);
  };

  /* =====================================================
     RAINFALL GRAPH
  ===================================================== */

  const rainfallPattern = [
    0.42,
    0.58,
    0.48,
    0.72,
    0.55,
    0.82,
    0.66,
    0.94,
    0.70,
    0.86,
    0.78,
    1.0,
  ];

  const rainfallBars =
    rainfallPattern.map((factor, index) => {
      const variation =
        1 +
        Math.sin(
          (Number(rainfall) + index * 17) / 45
        ) *
          0.06;

      return Math.max(
        3,
        Math.min(
          100,
          Math.round(
            (Number(rainfall) / 300) *
              factor *
              variation *
              100
          )
        )
      );
    });

  return (
    <div className="app-shell">

      {/* =================================================
          MAP
      ================================================= */}

      <div
        ref={mapRef}
        className="map-background"
      />

      <div className="map-overlay" />

      {/* =================================================
          HEADER
      ================================================= */}

      <header className="topbar">

        <div className="brand-block">

          <div className="brand-mark">
            S
          </div>

          <div>
            <div className="brand-name">
              SENTINEL
            </div>

            <div className="brand-subtitle">
              FLOOD INTELLIGENCE SYSTEM
            </div>
          </div>

        </div>

        {/* SYSTEM SELECTOR */}

        <div className="system-selector">

          <label>
            SYSTEM CATCHMENT
          </label>

          <SystemDropdown
            selectedSystem={
              selectedSystem
            }
            selectedSystemId={
              selectedSystemId
            }
            onSelect={
              handleSystemSelect
            }
          />

        </div>

        {/* STATUS */}

        <div className="top-status">

          <div className="status-item">

            <div className="status-label">
              LIVE DATA
            </div>

            <button
              className={`toggle ${
                liveData
                  ? "active"
                  : ""
              }`}
              onClick={() =>
                setLiveData(
                  !liveData
                )
              }
            >
              <span />
            </button>

            <span className="status-value">
              {liveData
                ? "ON"
                : "OFF"}
            </span>

          </div>

          <div className="status-item">

            <div className="status-label">
              SYSTEM
            </div>

            <div className="system-online">
              <span className="online-dot" />
              ONLINE
            </div>

          </div>

          <div className="status-item">

            <div className="status-label">
              BACKEND
            </div>

            <div
              className={
                backendOnline
                  ? "backend-status online"
                  : "backend-status"
              }
            >
              <span className="online-dot" />

              {backendOnline
                ? "CONNECTED"
                : "READY"}
            </div>

          </div>

        </div>

      </header>

      {/* =================================================
          TABS
      ================================================= */}

      <nav className="tabbar">

        {[
          "Overview",
          "Live Map",
          "Rainfall",
          "Simulation",
          "Alerts",
        ].map((tab) => (
          <button
            key={tab}
            className={
              activeTab === tab
                ? "tab active"
                : "tab"
            }
            onClick={() =>
              setActiveTab(tab)
            }
          >
            {tab}
          </button>
        ))}

      </nav>

      {/* =================================================
          OVERVIEW
      ================================================= */}

      {activeTab === "Overview" &&
        panelOpen && (
          <section className="monitor-panel">

            <button
              className="panel-close"
              onClick={() =>
                setPanelOpen(false)
              }
              title="Hide flood monitor"
            >
              −
            </button>

            <div className="panel-header">

              <div>

                <div className="eyebrow">
                  LIVE FLOOD MONITORING
                </div>

                <h1>
                  {
                    selectedSystem.monitorName
                  }
                </h1>

                <p>
                  {
                    selectedSystem.river
                  }
                  {" • "}
                  {
                    selectedSystem.region
                  }
                </p>

              </div>

              <div className="panel-status">
                <span className="pulse-dot" />
                MONITORING
              </div>

            </div>

            <div className="metrics-grid">

              <div className="metric-card">

                <div className="metric-label">
                  RAINFALL
                </div>

                <div className="metric-value">
                  {rainfall}
                  <span>
                    {" "}
                    mm/hr
                  </span>
                </div>

                <div className="metric-note">
                  Simulated intensity
                </div>

              </div>

              <div className="metric-card">

                <div className="metric-label">
                  DRAINAGE CAPACITY
                </div>

                <div className="metric-value">
                  {
                    drainageCapacity
                  }
                  <span>
                    {" "}
                    mm/hr
                  </span>
                </div>

                <div className="metric-note">
                  Current scenario
                </div>

              </div>

              <div className="metric-card">

                <div className="metric-label">
                  RISK INDEX
                </div>

                <div className="metric-value">
                  {riskIndex}
                  <span>
                    /100
                  </span>
                </div>

                <div className="metric-note">
                  Sentinel assessment
                </div>

              </div>

              <div className="metric-card">

                <div className="metric-label">
                  STATUS
                </div>

                <div className="metric-risk">
                  {riskLevel}
                </div>

                <div className="metric-note">
                  Current simulation
                </div>

              </div>

            </div>

            <div className="risk-section">

              <div className="risk-header">
                <span>
                  FLOOD RISK
                </span>

                <span>
                  {riskIndex}%
                </span>
              </div>

              <div className="risk-track">

                <div
                  className="risk-fill"
                  style={{
                    width: `${riskIndex}%`,
                  }}
                />

              </div>

            </div>

            <div className="overview-lower">

              <div className="info-box">

                <div className="info-title">
                  MONITORING NETWORK
                </div>

                <div className="info-value">
                  ACTIVE
                </div>

                <div className="info-small">
                  Sentinel hydraulic
                  observation network
                </div>

              </div>

              <div className="info-box">

                <div className="info-title">
                  CURRENT SYSTEM
                </div>

                <div className="info-value">
                  {
                    selectedSystem.region
                  }
                </div>

                <div className="info-small">
                  {
                    selectedSystem.river
                  }
                </div>

              </div>

              {selectedSystem.frl && (
                <div className="info-box">

                  <div className="info-title">
                    RESERVOIR LEVEL
                  </div>

                  <div className="info-value">
                    {
                      selectedSystem.currentLevel
                    }{" "}
                    m
                  </div>

                  <div className="info-small">
                    FRL:{" "}
                    {
                      selectedSystem.frl
                    }{" "}
                    m
                  </div>

                </div>
              )}

            </div>

          </section>
        )}

      {/* =================================================
          REOPEN MONITOR
      ================================================= */}

      {activeTab === "Overview" &&
        !panelOpen && (
          <button
            className="panel-reopen"
            onClick={() =>
              setPanelOpen(true)
            }
          >
            + FLOOD MONITOR
          </button>
        )}

      {/* =================================================
          LIVE MAP
      ================================================= */}

      {activeTab ===
        "Live Map" && (
        <section className="content-panel">

          <div className="content-eyebrow">
            LIVE HYDROLOGICAL MAP
          </div>

          <h2>
            {
              selectedSystem.name
            }
          </h2>

          <p>
            Monitoring location
            centered on{" "}
            <strong>
              {
                selectedSystem.region
              }
            </strong>
            .
          </p>

          <div className="map-readout">

            <div>
              <span>
                RIVER
              </span>

              <strong>
                {
                  selectedSystem.river
                }
              </strong>
            </div>

            <div>
              <span>
                REGION
              </span>

              <strong>
                {
                  selectedSystem.region
                }
              </strong>
            </div>

            <div>
              <span>
                MONITORING
              </span>

              <strong>
                ACTIVE
              </strong>
            </div>

          </div>

        </section>
      )}

      {/* =================================================
          RAINFALL
      ================================================= */}

      {activeTab ===
        "Rainfall" && (
        <section className="content-panel rainfall-panel">

          <div className="content-eyebrow">
            PRECIPITATION OBSERVATION
          </div>

          <h2>
            Rainfall Monitoring
          </h2>

          <p>
            Current simulated
            rainfall intensity
            for{" "}
            <strong>
              {
                selectedSystem.name
              }
            </strong>
            . Adjust the value in the
            Simulation tab to update this
            chart.
          </p>

          <div className="rainfall-main-value">
            {rainfall}
            <span>
              {" "}
              mm/hr
            </span>
          </div>

          <div className="rainfall-chart">

            {rainfallBars.map(
              (height, index) => (
                <div
                  className="rain-bar"
                  key={index}
                  style={{
                    height: `${height}%`,
                  }}
                />
              )
            )}

          </div>

        </section>
      )}

      {/* =================================================
          SIMULATION
      ================================================= */}

      {activeTab ===
        "Simulation" && (
        <section className="content-panel simulation-panel">

          <div className="content-eyebrow">
            HYDROLOGICAL SCENARIO ENGINE
          </div>

          <h2>
            Flood Simulation
          </h2>

          <p>
            Adjust the environmental
            parameters and evaluate
            the projected flood response
            for{" "}
            <strong>
              {
                selectedSystem.name
              }
            </strong>
            .
          </p>

          <div className="simulation-grid">

            {/* RAINFALL SLIDER */}

            <div className="slider-group">

              <div className="slider-header">

                <span>
                  RAINFALL INTENSITY
                </span>

                <strong>
                  {rainfall} mm/hr
                </strong>

              </div>

              <input
                className="simulation-slider"
                type="range"
                min="0"
                max="300"
                step="5"
                value={rainfall}
                onChange={(event) =>
                  setRainfall(
                    Number(
                      event.target
                        .value
                    )
                  )
                }
              />

              <div className="slider-scale">
                <span>0</span>
                <span>150</span>
                <span>
                  300 mm/hr
                </span>
              </div>

            </div>

            {/* DRAINAGE SLIDER */}

            <div className="slider-group">

              <div className="slider-header">

                <span>
                  DRAINAGE CAPACITY
                </span>

                <strong>
                  {
                    drainageCapacity
                  }{" "}
                  mm/hr
                </strong>

              </div>

              <input
                className="simulation-slider"
                type="range"
                min="0"
                max="150"
                step="5"
                value={
                  drainageCapacity
                }
                onChange={(event) =>
                  setDrainageCapacity(
                    Number(
                      event.target
                        .value
                    )
                  )
                }
              />

              <div className="slider-scale">
                <span>0</span>
                <span>75</span>
                <span>
                  150 mm/hr
                </span>
              </div>

            </div>

          </div>

          <div className="simulation-summary">

            <div>
              <span>
                SYSTEM
              </span>

              <strong>
                {
                  selectedSystem.name
                }
              </strong>
            </div>

            <div>
              <span>
                RISK LEVEL
              </span>

              <strong>
                {riskLevel}
              </strong>
            </div>

            <div>
              <span>
                RISK INDEX
              </span>

              <strong>
                {riskIndex}/100
              </strong>
            </div>

          </div>

          <button
            className="run-button"
            onClick={
              runSimulation
            }
            disabled={
              simulationRunning
            }
          >
            {simulationRunning
              ? "RUNNING SIMULATION..."
              : "RUN SIMULATION"}
          </button>

          {simulationResult && (
            <div className="simulation-result">

              <span>
                SIMULATION RESULT
              </span>

              <strong>
                {riskLevel}
              </strong>

              <small>
                Rainfall:{" "}
                {rainfall} mm/hr
                {" • "}
                Drainage:{" "}
                {
                  drainageCapacity
                }{" "}
                mm/hr
              </small>

            </div>
          )}

        </section>
      )}

      {/* =================================================
          ALERTS
      ================================================= */}

      {activeTab ===
        "Alerts" && (
        <section className="content-panel">

          <div className="content-eyebrow">
            ALERT MANAGEMENT
          </div>

          <h2>
            Active Alerts
          </h2>

          <div className="alert-row">

            <div className="alert-indicator" />

            <div>
              <strong>
                Monitoring active
              </strong>

              <p>
                Sentinel is monitoring{" "}
                {
                  selectedSystem.name
                }
                .
              </p>
            </div>

            <span>
              {riskLevel}
            </span>

          </div>

          <div className="alert-row">

            <div className="alert-indicator normal" />

            <div>
              <strong>
                Data network operational
              </strong>

              <p>
                Sentinel monitoring
                services are available.
              </p>
            </div>

            <span>
              ONLINE
            </span>

          </div>

        </section>
      )}

      {/* =================================================
          MAP LEGEND
      ================================================= */}

      <div className="map-legend">

        <div className="legend-title">
          SENTINEL HYDRAULICS
        </div>

        <div className="legend-row">
          <span
            className="legend-line river"
            style={{
              background: systemColor,
            }}
          />
          {selectedSystem.river}
        </div>

        <div className="legend-row">
          <span
            className="legend-point"
            style={{
              background: systemColor,
              boxShadow: `0 0 5px ${systemColor}66`,
            }}
          />
          Monitoring point
        </div>

        <div className="legend-row">
          <span
            className="legend-zone"
            style={{
              borderColor: systemColor,
              background: `${systemColor}14`,
            }}
          />
          Monitoring zone
        </div>

      </div>

      {/* =================================================
          COORDINATES
      ================================================= */}

      <div className="map-coordinates">

        <span>
          {
            selectedSystem
              .center[0]
              .toFixed(4)
          }
          ° N
        </span>

        <span>
          {
            selectedSystem
              .center[1]
              .toFixed(4)
          }
          ° E
        </span>

      </div>

    </div>
  );
}

export default App;