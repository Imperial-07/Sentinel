const express = require('express');
const router = express.Router();
const { runSimulation } = require('../Math/simulator');

router.post('/simulate', (req, res) => {
    try {
        // Make sure the variable name matches what you send back!
        const simulationResults = runSimulation(req.body);
        
        res.json({
            success: true,
            data: simulationResults
        });
    } catch (error) {
        console.error("Simulation error:", error.message);
        res.status(500).json({ success: false, error: "Internal Server Error during simulation" });
    }
});

module.exports = router;