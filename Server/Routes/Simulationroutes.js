'use strict';

const express = require('express');
const router = express.Router();
const { runSimulation, getRegions, listBasins, getBasin } = require('../Math/simulator');

/**
 * Health check endpoint for dashboard connection status
 */
router.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    service: 'FlowShield Simulation Engine',
    model: 'Mumbai Multi-Catchment Hydrology v2.0',
    supportedBasins: ['mithi', 'ulhas', 'dahisar', 'oshiwara'],
    timestamp: new Date().toISOString(),
  });
});

/**
 * Status check endpoint
 */
router.get('/status', (req, res) => {
  res.json({
    status: 'online',
    version: '2.0.0',
    uptimeSeconds: Math.round(process.uptime()),
    timestamp: new Date().toISOString(),
  });
});

/**
 * Returns available river basins with geographical metadata & channel paths
 */
router.get('/basins', (req, res) => {
  try {
    const basins = listBasins();
    res.json({
      success: true,
      data: basins,
    });
  } catch (error) {
    console.error('Error fetching basins:', error.message);
    res.status(500).json({ success: false, error: 'Failed to fetch catchment basins' });
  }
});

/**
 * Returns baseline regional monitoring metadata for a specific basin or default (Mithi)
 */
router.get('/regions', (req, res) => {
  try {
    const basinId = req.query.basin || req.query.basinId || 'mithi';
    const regions = getRegions(basinId);
    const basin = getBasin(basinId);
    res.json({
      success: true,
      basin: {
        id: basin.id,
        name: basin.name,
        center: basin.center,
        defaultZoom: basin.defaultZoom,
        riverChannel: basin.riverChannel,
      },
      data: regions,
    });
  } catch (error) {
    console.error('Error fetching regions:', error.message);
    res.status(500).json({ success: false, error: 'Failed to fetch regional topology' });
  }
});

/**
 * Runs the hydrological flood simulation given rainfall, simulationHour, and basinId
 */
router.post('/simulate', (req, res) => {
  try {
    const simulationResults = runSimulation(req.body);

    res.json({
      success: true,
      data: simulationResults,
    });
  } catch (error) {
    console.error('Simulation error:', error.message);
    res.status(500).json({
      success: false,
      error: error.message || 'Internal Server Error during simulation',
    });
  }
});

module.exports = router;