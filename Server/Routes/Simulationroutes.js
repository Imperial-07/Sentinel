'use strict';

const express = require('express');
const router = express.Router();
const { runSimulation, getRegions } = require('../Math/simulator');

/**
 * Health check endpoint for dashboard connection status
 */
router.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    service: 'FlowShield Simulation Engine',
    model: 'Mumbai Mithi River Catchment Hydrology v1.0',
    timestamp: new Date().toISOString(),
  });
});

/**
 * Status check endpoint
 */
router.get('/status', (req, res) => {
  res.json({
    status: 'online',
    version: '1.0.0',
    uptimeSeconds: Math.round(process.uptime()),
    timestamp: new Date().toISOString(),
  });
});

/**
 * Returns baseline regional monitoring metadata
 */
router.get('/regions', (req, res) => {
  try {
    const regions = getRegions();
    res.json({
      success: true,
      data: regions,
    });
  } catch (error) {
    console.error('Error fetching regions:', error.message);
    res.status(500).json({ success: false, error: 'Failed to fetch regional topology' });
  }
});

/**
 * Runs the hydrological flood simulation given rainfall and scenario options
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