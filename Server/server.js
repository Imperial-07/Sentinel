const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const DEFAULT_PORT = parseInt(process.env.PORT, 10) || 5001;

// Middleware
app.use(cors());
app.use(express.json());

// API Routes
const simulationRoutes = require('./Routes/Simulationroutes');
app.use('/api', simulationRoutes);

// Serve static frontend from workspace root
app.use(express.static(path.join(__dirname, '..')));

// Fallback to index.html for root if needed
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'index.html'));
});

// Start the server with automatic port recovery
function startServer(port) {
  const server = app.listen(port, () => {
    console.log(`=========================================`);
    console.log(`FlowShield Sentinel Backend is running!`);
    console.log(`API URL:      http://localhost:${port}/api`);
    console.log(`Health Check: http://localhost:${port}/api/health`);
    console.log(`Frontend HUD: http://localhost:${port}/`);
    console.log(`=========================================`);
  });

  server.on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
      console.warn(`Port ${port} in use, trying port ${port + 1}...`);
      startServer(port + 1);
    } else {
      console.error('Server error:', err);
    }
  });
}

startServer(DEFAULT_PORT);