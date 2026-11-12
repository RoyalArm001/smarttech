'use strict';
// Passenger loads this file as a module: explicitly start the shared Express app.
const app = require('./server');
module.exports = app.start();
