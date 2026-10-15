# Average REST API Server

[![Node.js Version](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen.svg)](https://nodejs.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
[![Conventional Commits](https://img.shields.io/badge/Conventional%20Commits-1.0.0-yellow.svg)](https://conventionalcommits.org)
[![Git Hooks](https://img.shields.io/badge/Git%20Hooks-Husky%20v9-blue.svg)](https://typicode.github.io/husky/)

A robust, enterprise-grade REST API server built with **Node.js** and **Express** that exposes a `POST /average` endpoint. It accepts numbers and calculates the progressive cumulative average of all numbers submitted so far.

---

## Table of Contents

- [Features](#features)
- [Project Structure](#project-structure)
- [Prerequisites](#prerequisites)
- [Installation & Setup](#installation--setup)
- [Running the Server](#running-the-server)
- [API Reference](#api-reference)
  - [POST /average](#post-average)
  - [GET /average](#get-average)
  - [POST /average/reset](#post-averagereset)
- [Client Usage](#client-usage)
  - [1. Web Client (Dashboard)](#1-web-client-dashboard)
  - [2. Command-Line Utility (CLI)](#2-command-line-utility-cli)
  - [3. cURL](#3-curl)
  - [4. Postman](#4-postman)
- [Running Tests](#running-tests)
- [JSDoc Documentation](#jsdoc-documentation)
- [Git Hooks & Conventional Commits](#git-hooks--conventional-commits)
- [Pushing to GitHub](#pushing-to-github)

---

## Features

- **Single REST API Endpoint**: `POST /average` computes and returns the real-time running average of all submitted numbers.
- **Multiple Client Options**:
  - **Interactive Web Page UI**: Real-time browser dashboard with statistics, history, and quick preset buttons.
  - **CLI Utility**: Single-shot execution or interactive terminal prompt.
  - **cURL Examples**: Cross-platform bash and PowerShell commands.
  - **Postman Collection**: Ready-to-import `postman_collection.json`.
- **Validation & Error Handling**: Comprehensive checks against invalid types, non-numeric values, NaN, null, and malformed JSON.
- **Floating-Point Precision Guard**: Eliminates IEEE 754 precision artifacts.
- **100% Test Coverage**: Unit tests and integration tests with Jest and Supertest.
- **JSDoc Comments**: Detailed JSDoc annotations across all functions, modules, and classes.
- **Git Hooks & Conventional Commits**: Enforced via **Husky** and **Commitlint** with pre-commit testing.

---

## Project Structure

```text
average-rest-api/
├── .husky/                       # Git hooks
│   ├── commit-msg                # Enforces Conventional Commits via Commitlint
│   └── pre-commit                # Runs test suite before committing
├── bin/
│   └── cli.js                    # CLI Client Utility (single-shot & interactive)
├── public/
│   └── index.html                # Interactive Web Dashboard Client
├── src/
│   ├── controllers/
│   │   └── averageController.js  # Request validation and route controllers
│   ├── services/
│   │   └── averageService.js     # State management and math logic
│   ├── app.js                    # Express application and middleware
│   └── server.js                 # HTTP server entry point and shutdown
├── tests/
│   ├── integration/
│   │   └── averageApi.test.js    # Supertest integration tests for REST API
│   └── unit/
│       ├── averageService.test.js# Unit tests for calculation service
│       └── extractNumber.test.js # Unit tests for input parsing
├── commitlint.config.js          # Commitlint configuration
├── jsdoc.json                    # JSDoc generator configuration
├── package.json                  # Dependencies and npm scripts
├── postman_collection.json       # Postman v2.1 export
└── README.md                     # Project documentation
```

---

## Prerequisites

- **Node.js**: v18.0.0 or higher (Tested on Node v24.x)
- **npm**: v9.0.0 or higher
- **Git**: Installed and available in your terminal

---

## Installation & Setup

1. **Clone the repository** (or navigate to the project directory):
   ```bash
   git clone <YOUR_GITHUB_REPO_URL>
   cd average-rest-api
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```
   *Note: This automatically initializes Husky Git hooks via the `prepare` script.*

---

## Running the Server

### Production Mode
```bash
npm start
```

### Development Mode (with hot-reload)
```bash
npm run dev
```

The server starts on port `3000` by default:
```text
=======================================================
 Average REST API Server is running on port 3000
 - Web Client UI:   http://localhost:3000/
 - API Endpoint:    POST http://localhost:3000/average
 - Health Status:   GET  http://localhost:3000/health
=======================================================
```

> **Custom Port**: To run on a different port, set the `PORT` environment variable:
> ```bash
> PORT=8080 npm start
> ```

---

## API Reference

### POST /average

Submits a number to the accumulator and returns the recalculated running average.

#### Request
- **Method**: `POST`
- **URL**: `http://localhost:3000/average`
- **Headers**: `Content-Type: application/json`
- **Body**:
  ```json
  {
    "number": 10
  }
  ```
  *(The API also accepts `{ "value": 10 }` or numeric strings like `{ "number": "10" }`)*

#### Success Response (`200 OK`)
```json
{
  "average": 10,
  "count": 1,
  "sum": 10,
  "received": 10
}
```

If a second request is sent with `{"number": 20}`:
```json
{
  "average": 15,
  "count": 2,
  "sum": 30,
  "received": 20
}
```

#### Error Response (`400 Bad Request`)
Returned when the body is missing, not a valid number, or contains non-numeric values.
```json
{
  "error": "Bad Request",
  "message": "Invalid input. Please provide a valid finite number in the request body (e.g., { \"number\": 10 })."
}
```

---

### GET /average

Retrieves current statistics without mutating state.

- **Method**: `GET`
- **URL**: `http://localhost:3000/average`

#### Response (`200 OK`)
```json
{
  "average": 15,
  "count": 2,
  "sum": 30,
  "history": [10, 20]
}
```

---

### POST /average/reset

Resets the in-memory accumulator to zero.

- **Method**: `POST`
- **URL**: `http://localhost:3000/average/reset`

#### Response (`200 OK`)
```json
{
  "message": "Average counter has been successfully reset.",
  "average": 0,
  "count": 0,
  "sum": 0
}
```

---

## Client Usage

You can interact with the API using any of the following 4 methods:

### 1. Web Client (Dashboard)
Open your web browser and navigate to:
```text
http://localhost:3000
```
- Real-time display of running average, total count, and cumulative sum.
- Input box with one-click submit and quick preset buttons (`+10`, `+20`, `+50`, `-5`, `3.14`).
- Interactive history log and reset counter button.

### 2. Command-Line Utility (CLI)

The repository provides a built-in CLI utility in `bin/cli.js`:

#### Single-shot mode:
```bash
# Using npm script:
npm run client -- 42

# Or directly with node:
node bin/cli.js 42
node bin/cli.js -15.5
```

#### Interactive prompt mode:
```bash
npm run client
```
Output:
```text
=======================================================
  Average REST API - Interactive CLI Client
  Target: http://localhost:3000
  Commands:
    <number>  : Submit number to POST /average
    status    : View current average and history
    reset     : Reset cumulative average
    exit/quit : Exit CLI
=======================================================

average-cli> 10
Success [HTTP 200]:
  Submitted Number: 10
  Running Average:  10
  Total Count:      1
  Total Sum:        10

average-cli> 20
Success [HTTP 200]:
  Submitted Number: 20
  Running Average:  15
  Total Count:      2
  Total Sum:        30

average-cli> exit
```

### 3. cURL

#### Linux / macOS / Git Bash:
```bash
# Submit number 10
curl -X POST http://localhost:3000/average \
  -H "Content-Type: application/json" \
  -d '{"number": 10}'

# Submit number 20
curl -X POST http://localhost:3000/average \
  -H "Content-Type: application/json" \
  -d '{"number": 20}'
```

#### Windows PowerShell:
```powershell
Invoke-RestMethod -Uri "http://localhost:3000/average" -Method POST -Headers @{"Content-Type"="application/json"} -Body '{"number": 10}'
```

### 4. Postman

1. Open Postman.
2. Click **Import** (top left).
3. Select the file [`postman_collection.json`](./postman_collection.json) from this repository.
4. The imported collection contains ready-to-run requests for positive numbers, negatives, decimals, error validations, status checks, and resets.

---

## Running Tests

The test suite includes both **unit tests** (testing mathematical logic and input extraction) and **integration tests** (testing HTTP endpoints, status codes, and JSON parsing via Supertest).

### Run all tests:
```bash
npm test
```

### Run tests with coverage report:
```bash
npm run test:coverage
```

Test Results Output:
```text
Test Suites: 3 passed, 3 total
Tests:       28 passed, 28 total
Snapshots:   0 total
Time:        1.87 s
All files: 100% test coverage for core business logic and controllers.
```

---

## JSDoc Documentation

All modules, classes, and controller functions are fully documented with JSDoc tags (`@module`, `@param`, `@returns`, `@throws`, `@example`).

To generate the HTML documentation site:
```bash
npm run docs
```
The documentation will be generated into the `docs/` folder. Open `docs/index.html` in any browser to explore.

---

## Git Hooks & Conventional Commits

This project enforces the [Conventional Commits](https://www.conventionalcommits.org/) specification using **Husky** and **Commitlint**.

### Enabled Hooks:
1. **`commit-msg`**: Validates that every Git commit message follows the format:
   ```text
   <type>[optional scope]: <description>
   ```
   **Allowed Types**: `feat`, `fix`, `docs`, `style`, `refactor`, `perf`, `test`, `build`, `ci`, `chore`, `revert`.

   **Valid Examples**:
   - `feat: implement POST /average endpoint`
   - `test: add integration test cases for floating point numbers`
   - `docs: update README with CLI usage`
   - `fix: handle NaN edge case in number extractor`

   **Invalid Example**:
   - `updated stuff` *(Commit rejected with error: `type may not be empty`)*

2. **`pre-commit`**: Automatically runs `npm test` before any commit is created. If any test fails, the commit is aborted.

---

## Pushing to GitHub

Follow these steps to push this project to a new public GitHub repository:

1. **Create a new public repository** on [GitHub](https://github.com/new) (e.g. `average-rest-api`). Do **not** initialize with README or .gitignore since we already have them.

2. **Stage and commit all files**:
   ```bash
   git add .
   git commit -m "feat: complete REST API server with tests, documentation, and git hooks"
   ```

3. **Link your remote repository and push**:
   ```bash
   git branch -M main
   git remote add origin https://github.com/<YOUR_USERNAME>/average-rest-api.git
   git push -u origin main
   ```

4. **Verify**: Open your GitHub repository URL and ensure that all files, README, and commit history are visible.
