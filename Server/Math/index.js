'use strict';

/**
 * Math/index.js — single entry point.
 *
 *   const Flood = require('./Math');
 *   let state = Flood.normalizeState({ regions });
 *   const result = Flood.stepSimulation(state, { dtSeconds: 300, rainfall: 45 });
 */

module.exports = {
  ...require('./units'),
  ...require('./hydrology'),
  ...require('./flow'),
  ...require('./risk'),
  ...require('./stepper'),
};
