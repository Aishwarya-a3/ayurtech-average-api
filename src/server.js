/**
 * @fileoverview Application entry point. Boots the Express HTTP server.
 * @module server
 */

const app = require('./app');

/**
 * Server listening port configured via environment variable PORT or default 3000.
 * @type {number|string}
 */
const PORT = process.env.PORT || 3000;

/**
 * Starts listening on the configured port.
 */
const server = app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`=======================================================`);
  // eslint-disable-next-line no-console
  console.log(` Average REST API Server is running on port ${PORT}`);
  // eslint-disable-next-line no-console
  console.log(` - Web Client UI:   http://localhost:${PORT}/`);
  // eslint-disable-next-line no-console
  console.log(` - API Endpoint:    POST http://localhost:${PORT}/average`);
  // eslint-disable-next-line no-console
  console.log(` - Health Status:   GET  http://localhost:${PORT}/health`);
  // eslint-disable-next-line no-console
  console.log(`=======================================================`);
});

/**
 * Graceful termination handling for SIGTERM and SIGINT.
 */
function handleShutdown(signal) {
  // eslint-disable-next-line no-console
  console.log(`\nReceived ${signal}. Shutting down gracefully...`);
  server.close(() => {
    // eslint-disable-next-line no-console
    console.log('HTTP server closed.');
    process.exit(0);
  });
}

process.on('SIGTERM', () => handleShutdown('SIGTERM'));
process.on('SIGINT', () => handleShutdown('SIGINT'));

module.exports = server;
