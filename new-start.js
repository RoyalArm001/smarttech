'use strict';
// CloudLinux Startup File selected by the hosting provider. Reuse the existing app
// and listener if server.js already started under Passenger; never listen twice.
const app = require('./server');
module.exports = app.start();
