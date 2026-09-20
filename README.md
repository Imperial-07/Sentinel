# SENTINEL

## Flood Intelligence & Early Warning Dashboard

Sentinel is a flood intelligence dashboard that brings rainfall, river/system information, flood-risk status, simulation results, alerts, and map-based monitoring into one interface.

The project combines a **React + Vite frontend**, a **Node.js + Express backend**, and a simulation layer connected through a REST API.

---

## Key Features

- Interactive dark-themed flood monitoring dashboard
- System/catchment selector for multiple monitored locations
- Overview, Live Map, Rainfall, Simulation, and Alerts sections
- Interactive map using **Leaflet**
- Different muted colors for different monitored rivers/systems
- Map legend and coordinate readout
- Dynamic rainfall visualization linked to the simulation rainfall value
- Flood simulation controls
- Backend simulation API integration
- Responsive monitoring interface
- Practical control-room/engineering-inspired visual design

---

## Project Structure

```text
Sentinel/
│
├── client/                         # React + Vite frontend
│   ├── src/
│   │   ├── assets/
│   │   ├── App.jsx                 # Main dashboard
│   │   ├── App.css                 # Dashboard styling
│   │   ├── index.css               # Global styling
│   │   └── main.jsx                # React entry point
│   ├── index.html
│   ├── package.json
│   ├── package-lock.json
│   └── ...
│
├── Server/                         # Node.js + Express backend
│   ├── Math/
│   ├── Routes/
│   │   └── Simulationroutes.js
│   ├── Services/
│   └── server.js
│
├── README.md
├── package.json
└── package-lock.json
```

The old standalone frontend files were removed from the repository. The active frontend is the React application inside `client/`.

---

## Technologies Used

### Frontend
- React
- Vite
- JavaScript
- CSS
- Leaflet

### Backend
- Node.js
- Express.js
- CORS
- JSON API

### Development
- Git
- GitHub
- VS Code
- PowerShell

---

## Frontend

The active frontend is located in:

```text
client/
```

Main files:

```text
client/src/App.jsx
client/src/App.css
client/src/index.css
client/src/main.jsx
```

The dashboard provides:

- **Overview** — main monitoring information and flood status
- **Live Map** — map-based system monitoring
- **Rainfall** — rainfall visualization
- **Simulation** — adjustable simulation conditions
- **Alerts** — alert/status information

Leaflet is used for the interactive map.

---

## Backend

The backend is located in:

```text
Server/
```

Main files include:

```text
Server/server.js
Server/Routes/Simulationroutes.js
```

The backend exposes:

```text
POST /api/simulate
```

The frontend sends simulation input to this endpoint and receives the simulation response.

---

## Running the Project

### 1. Start the Backend

Open a terminal:

```powershell
cd "C:\Users\Admin\Desktop\Flowshield\Sentinel\Server"
```

The current frontend is configured to use port `5001`, so start the backend with:

```powershell
$env:PORT=5001
node server.js
```

Expected output:

```text
Server is running on port 5001
```

Keep this terminal open.

> `server.js` defaults to port `5000` when no `PORT` variable is supplied. The frontend currently points to port `5001`, so use the command above for the current local setup.

---

### 2. Start the Frontend

Open a second terminal:

```powershell
cd "C:\Users\Admin\Desktop\Flowshield\Sentinel\client"
```

Install dependencies if needed:

```powershell
npm install
```

Start Vite:

```powershell
npm run dev
```

Open the local URL shown by Vite, normally:

```text
http://localhost:5173/
```

---

## Backend API

### Simulation Endpoint

```text
POST http://localhost:5001/api/simulate
```

Example request:

```json
{
  "rainfall": 200,
  "drainageCapacity": 30
}
```

The backend processes the input through the simulation layer and returns simulation data to the frontend.

---

## Dynamic Rainfall Visualization

The rainfall graph is no longer completely fixed.

Its bar heights are calculated from the current rainfall simulation value and a predefined rainfall pattern.

The workflow is:

```text
Simulation rainfall value
          ↓
Rainfall calculation
          ↓
Rainfall chart
```

Changing the rainfall value therefore changes the displayed rainfall visualization.

---

## System-Specific Map Colors

Different monitored systems use different muted colors so that locations can be distinguished on the map without relying on bright neon colors.

The selected system color is also used by relevant map and legend elements.

This keeps the:

- Selected system
- River representation
- Map legend
- Monitoring interface

visually consistent.

---

## Design Direction

The dashboard was redesigned around a practical flood-monitoring/control-room concept.

The interface intentionally reduces:

- Excessive neon colors
- Heavy glow effects
- Generic AI-dashboard styling
- Unnecessary decorative elements

The design instead emphasizes:

- Clear information hierarchy
- Dark muted colors
- Map-based monitoring
- System-specific visual identification
- Compact status information
- Practical monitoring controls

---

## Repository Organization

The project separates the application into:

```text
Frontend → client/
Backend  → Server/
```

This allows frontend UI development and backend simulation development to remain independent while communicating through the REST API.

The previous root-level standalone UI files:

```text
index.html
script.js
style.css
```

were removed because they belonged to the older frontend implementation.

---

## GitHub Branch

Current development branch:

```text
feature/integrate-frontend-backend
```

The branch contains the integrated Sentinel frontend/backend work.

---

## Development Workflow

### Frontend

```text
client/
   ↓
npm run dev
   ↓
Vite development server
```

### Backend

```text
Server/
   ↓
node server.js
   ↓
Express API
```

The frontend communicates with the backend through the simulation API.

---

## Current Project Status

**Integrated frontend + backend prototype**

Current workflow:

```text
User
 ↓
Sentinel Dashboard
 ↓
Select monitored system
 ↓
View map / rainfall / alerts
 ↓
Enter simulation conditions
 ↓
Backend simulation
 ↓
Simulation response
 ↓
Dashboard visualization
```

---

## Future Improvements

Potential next steps include:

- Real-time rainfall data integration
- Live weather and river-level APIs
- Historical rainfall analysis
- More advanced flood-risk modelling
- Improved alert prioritization
- Location-based notifications
- Database integration
- Authentication and user roles
- Deployment of frontend and backend
- More detailed flood-risk visualization

---

## Project Purpose

Sentinel is being developed as a hackathon/educational project to demonstrate a practical interface for monitoring flood-related conditions and connecting simulation results with a visual decision-support dashboard.

---

## License

This project is developed for educational and hackathon purposes.
