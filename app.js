'use strict';
// Passenger loads this file as a module: explicitly start the shared Express app.
const app = require('./server');
const port = Number(process.env.PORT || 3000);
if (!Number.isInteger(port) || port < 1 || port > 65535) throw new Error('Invalid PORT');
module.exports = app.listen(port);
