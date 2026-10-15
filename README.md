
# Ayurtech Average API

A REST API built using Node.js and Express that calculates the average of all numbers submitted since the server started.

## Requirements

- Node.js
- npm

## Installation

1. Clone or download this repository.
2. Open the project folder in a terminal.
3. Install dependencies:

   npm install

## Run the Application

npm start

The server runs at http://localhost:3000.

## API Endpoint

POST /average

Request body:

{
  "number": 10
}

Example response:

{
  "number": 10,
  "count": 1,
  "average": 10
}

Each valid request adds its number to the running collection. The response includes the submitted number, total count, and cumulative average.

Invalid or missing numbers return HTTP 400.

## Run Tests

npm test

The automated tests use Jest and Supertest.

## Git Hooks

Husky runs tests before commits and Commitlint validates commit messages using Conventional Commits.

Examples:

- feat: add average API
- test: add API test cases
- docs: update README
