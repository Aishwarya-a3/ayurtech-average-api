/**
 * @fileoverview Express controllers for handling average API requests.
 * @module controllers/averageController
 */

const averageService = require('../services/averageService');

/**
 * Extracts and parses a candidate number from diverse request body representations.
 *
 * @param {*} body - The Express request body.
 * @returns {number|null} The parsed finite number, or null if invalid.
 */
function extractNumberFromBody(body) {
  if (body === undefined || body === null) {
    return null;
  }

  let candidate;

  if (typeof body === 'number') {
    candidate = body;
  } else if (typeof body === 'object') {
    if (typeof body.number === 'number' || (typeof body.number === 'string' && body.number.trim() !== '')) {
      candidate = Number(body.number);
    } else if (typeof body.value === 'number' || (typeof body.value === 'string' && body.value.trim() !== '')) {
      candidate = Number(body.value);
    } else {
      return null;
    }
  } else if (typeof body === 'string' && body.trim() !== '') {
    candidate = Number(body);
  } else {
    return null;
  }

  if (typeof candidate === 'number' && Number.isFinite(candidate)) {
    return candidate;
  }

  return null;
}

/**
 * Controller handling POST /average requests.
 * Accepts a number in the request body, appends it to the running average,
 * and responds with the updated average.
 *
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @returns {Object} JSON response containing the updated average.
 *
 * @example
 * // Request Body: { "number": 20 }
 * // Response: 200 OK
 * // { "average": 20, "count": 1, "sum": 20, "received": 20 }
 */
function postAverage(req, res) {
  const number = extractNumberFromBody(req.body);

  if (number === null) {
    return res.status(400).json({
      error: 'Bad Request',
      message: 'Invalid input. Please provide a valid finite number in the request body (e.g., { "number": 10 }).'
    });
  }

  const result = averageService.addNumber(number);

  return res.status(200).json({
    average: result.average,
    count: result.count,
    sum: result.sum,
    received: result.received
  });
}

/**
 * Controller handling GET /average requests.
 * Retrieves current statistics including average, count, and history.
 *
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @returns {Object} JSON response containing current metrics.
 */
function getAverage(req, res) {
  return res.status(200).json({
    average: averageService.getAverage(),
    count: averageService.getCount(),
    sum: averageService.getSum(),
    history: averageService.getHistory()
  });
}

/**
 * Controller handling POST /average/reset requests.
 * Resets the in-memory calculator state.
 *
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @returns {Object} JSON confirmation message.
 */
function resetAverage(req, res) {
  averageService.reset();
  return res.status(200).json({
    message: 'Average counter has been successfully reset.',
    average: 0,
    count: 0,
    sum: 0
  });
}

module.exports = {
  extractNumberFromBody,
  postAverage,
  getAverage,
  resetAverage
};
