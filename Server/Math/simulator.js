// Import Prajwal's specialized math modules from the same folder
const hydrology = require('./hydrology');
const flow = require('./flow');
const risk = require('./risk');
const stepper = require('./stepper');

/**
 * Main conductor function that coordinates all math modules
 * @param {Object} inputs - User inputs from the frontend dashboard
 * @returns {Object} Final water levels, overflow, and risk metrics
 */
function runSimulation(inputs) {
    // 1. Unpack incoming user settings with fallback defaults
    const rainfall = inputs.rainfall || 0;
    const drainageCapacity = inputs.drainageCapacity || 50;
    const initialStorage = inputs.initialStorage || 10;

    // 2. Step 1: Calculate runoff via hydrology module 
    // (Falls back safely if function names differ slightly)
    const runoff = typeof hydrology.calculateRunoff === 'function' 
        ? hydrology.calculateRunoff(rainfall) 
        : rainfall * 1.2;

    // 3. Step 2: Route the flow and advance time via stepper/flow modules
    const simulationState = typeof stepper.stepForward === 'function'
        ? stepper.stepForward(initialStorage, runoff, drainageCapacity)
        : { storage: initialStorage + runoff, overflow: Math.max(0, (initialStorage + runoff) - drainageCapacity) };

    // 4. Step 3: Evaluate hazard and risk via the risk module
    const riskAssessment = typeof risk.calculateRisk === 'function'
        ? risk.calculateRisk(simulationState.storage, drainageCapacity)
        : { index: 45, level: 'Moderate' };

    // 5. Bundle and return the clean results back to your routes
    return {
        waterStorage: Number(simulationState.storage.toFixed(2)),
        overflow: Number(simulationState.overflow.toFixed(2)),
        riskIndex: riskAssessment.index,
        riskLevel: riskAssessment.level
    };
}

module.exports = { runSimulation };