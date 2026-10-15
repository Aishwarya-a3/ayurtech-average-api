#!/usr/bin/env node

/**
 * @fileoverview Command-line utility client for interacting with the Average REST API.
 * Can be used in single-shot mode (e.g., `node bin/cli.js 42`) or interactive mode (`node bin/cli.js`).
 * @module bin/cli
 */

const http = require('http');
const readline = require('readline');

/**
 * Default API host and port.
 */
const DEFAULT_HOST = process.env.API_HOST || 'localhost';
const DEFAULT_PORT = process.env.PORT || 3000;
const BASE_URL = process.env.API_URL || `http://${DEFAULT_HOST}:${DEFAULT_PORT}`;

/**
 * Dispatches an HTTP request to the Average REST API.
 *
 * @param {string} endpoint - API path, e.g. '/average'.
 * @param {string} method - HTTP method ('GET' or 'POST').
 * @param {object|null} body - Optional JSON body to send.
 * @returns {Promise<{ status: number, data: any }>} Response promise.
 */
function apiRequest(endpoint, method = 'GET', body = null) {
  return new Promise((resolve, reject) => {
    const parsedUrl = new URL(endpoint, BASE_URL);
    const postData = body ? JSON.stringify(body) : null;

    const options = {
      hostname: parsedUrl.hostname,
      port: parsedUrl.port,
      path: parsedUrl.pathname,
      method: method,
      headers: {
        'Accept': 'application/json'
      }
    };

    if (postData) {
      options.headers['Content-Type'] = 'application/json';
      options.headers['Content-Length'] = Buffer.byteLength(postData);
    }

    const req = http.request(options, (res) => {
      let rawData = '';
      res.on('data', (chunk) => {
        rawData += chunk;
      });
      res.on('end', () => {
        try {
          const parsed = JSON.parse(rawData);
          resolve({ status: res.statusCode, data: parsed });
        } catch (e) {
          resolve({ status: res.statusCode, data: rawData });
        }
      });
    });

    req.on('error', (err) => {
      reject(err);
    });

    if (postData) {
      req.write(postData);
    }
    req.end();
  });
}

/**
 * Submits a number to the REST API and prints the response.
 *
 * @param {number|string} num - Number to submit.
 * @returns {Promise<boolean>} True if successful.
 */
async function submitNumber(num) {
  const parsed = Number(num);
  if (isNaN(parsed) || !Number.isFinite(parsed)) {
    console.error(`Error: "${num}" is not a valid finite number.`);
    return false;
  }

  try {
    const { status, data } = await apiRequest('/average', 'POST', { number: parsed });

    if (status >= 200 && status < 300) {
      console.log(`\nSuccess [HTTP ${status}]:`);
      console.log(`  Submitted Number: ${data.received}`);
      console.log(`  Running Average:  ${data.average}`);
      console.log(`  Total Count:      ${data.count}`);
      console.log(`  Total Sum:        ${data.sum}`);
      return true;
    } else {
      console.error(`\nFailed [HTTP ${status}]:`, data.message || data);
      return false;
    }
  } catch (err) {
    console.error(`\nNetwork Error: Could not connect to API server at ${BASE_URL}.`);
    console.error(`Ensure the server is running ('npm start').`);
    return false;
  }
}

/**
 * Fetches and displays current API statistics.
 *
 * @returns {Promise<void>}
 */
async function fetchStatus() {
  try {
    const { status, data } = await apiRequest('/average', 'GET');
    if (status === 200) {
      console.log(`\nCurrent Server Status:`);
      console.log(`  Running Average: ${data.average}`);
      console.log(`  Numbers Count:   ${data.count}`);
      console.log(`  Numbers Sum:     ${data.sum}`);
      console.log(`  History:         [${data.history.join(', ')}]`);
    }
  } catch (err) {
    console.error(`Error connecting to server at ${BASE_URL}: ${err.message}`);
  }
}

/**
 * Resets the in-memory average on the server.
 *
 * @returns {Promise<void>}
 */
async function resetServer() {
  try {
    const { status, data } = await apiRequest('/average/reset', 'POST');
    console.log(`\n[HTTP ${status}] ${data.message || 'Counter reset.'}`);
  } catch (err) {
    console.error(`Error resetting counter: ${err.message}`);
  }
}

/**
 * Starts interactive CLI session.
 */
function startInteractiveMode() {
  console.log(`=======================================================`);
  console.log(`  Average REST API - Interactive CLI Client`);
  console.log(`  Target: ${BASE_URL}`);
  console.log(`  Commands:`);
  console.log(`    <number>  : Submit number to POST /average`);
  console.log(`    status    : View current average and history`);
  console.log(`    reset     : Reset cumulative average`);
  console.log(`    exit/quit : Exit CLI`);
  console.log(`=======================================================\n`);

  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    prompt: 'average-cli> '
  });

  rl.prompt();

  rl.on('line', async (line) => {
    const input = line.trim();

    if (!input) {
      rl.prompt();
      return;
    }

    if (input.toLowerCase() === 'exit' || input.toLowerCase() === 'quit') {
      rl.close();
      return;
    }

    if (input.toLowerCase() === 'status') {
      await fetchStatus();
      rl.prompt();
      return;
    }

    if (input.toLowerCase() === 'reset') {
      await resetServer();
      rl.prompt();
      return;
    }

    await submitNumber(input);
    rl.prompt();
  }).on('close', () => {
    console.log('\nGoodbye!');
    process.exit(0);
  });
}

/**
 * Main CLI entry point.
 */
async function main() {
  const args = process.argv.slice(2);

  if (args.length === 0) {
    startInteractiveMode();
    return;
  }

  const firstArg = args[0];

  if (firstArg === '--help' || firstArg === '-h') {
    console.log(`Usage:`);
    console.log(`  node bin/cli.js <number>       Submit a single number`);
    console.log(`  node bin/cli.js                Start interactive mode`);
    console.log(`  node bin/cli.js --status       View current average statistics`);
    console.log(`  node bin/cli.js --reset        Reset accumulator`);
    console.log(`\nExamples:`);
    console.log(`  node bin/cli.js 42`);
    console.log(`  node bin/cli.js -15.5`);
    console.log(`  npm run client -- 100`);
    return;
  }

  if (firstArg === '--status' || firstArg === '-s') {
    await fetchStatus();
    return;
  }

  if (firstArg === '--reset') {
    await resetServer();
    return;
  }

  const success = await submitNumber(firstArg);
  if (!success) {
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}

module.exports = {
  apiRequest,
  submitNumber
};
