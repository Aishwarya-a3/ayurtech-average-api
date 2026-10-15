/**
 * @fileoverview Express application setup and route registration.
 * @module app
 */

const path = require('path');
const express = require('express');
const {
  postAverage,
  getAverage,
  resetAverage
} = require('./controllers/averageController');

const app = express();

/**
 * Middleware: Parse JSON payloads.
 * Supports standard application/json requests.
 */
app.use(express.json());

/**
 * Middleware: Parse URL-encoded bodies.
 */
app.use(express.urlencoded({ extended: true }));

/**
 * Middleware: Handle JSON syntax parsing errors gracefully.
 */
app.use((err, req, res, next) => {
  if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
    return res.status(400).json({
      error: 'Bad Request',
      message: 'Malformed JSON payload. Please provide valid JSON, e.g. { "number": 10 }.'
    });
  }
  next(err);
});

/**
 * Serve static assets for the Web Page Client.
 */
app.use(express.static(path.join(__dirname, '..', 'public')));

/**
 * @route POST /average
 * @description Submit a number to calculate the cumulative average.
 */
app.post('/average', postAverage);

/**
 * @route GET /average
 * @description Retrieve current cumulative average and statistics.
 */
app.get('/average', getAverage);

/**
 * @route POST /average/reset
 * @description Reset accumulator state (useful for testing and admin operations).
 */
app.post('/average/reset', resetAverage);

/**
 * Health check endpoint.
 */
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
});

/**
 * 404 handler for unrecognized endpoints.
 */
app.use((req, res) => {
  res.status(404).json({
    error: 'Not Found',
    message: `Cannot ${req.method} ${req.originalUrl}. Available API endpoint: POST /average`
  });
});

/**
 * Global 500 error handler.
 */
app.use((err, req, res, next) => {
  // eslint-disable-next-line no-console
  console.error('Unhandled server error:', err);
  res.status(500).json({
    error: 'Internal Server Error',
    message: 'An unexpected error occurred while processing the request.'
  });
});

module.exports = app;
