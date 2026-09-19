const express = require('express');
const router = express.Router();
const { runSimulation } = require('../Math/simulator');

router.post('/simulate', (req, res) => {
  try{ 
    const userInput = req.body;

    const  simulationResult = runSimulation(userInput);

    res.status(200).json({
            success: true,
            data: simulationResults
        });
    } catch (error) {
        console.error('Simulation error:', error);
        res.status(500).json({ success: false, error: 'Internal Server Error during simulation' });
    }
});

module.exports = router;