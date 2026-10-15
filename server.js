
const express = require('express');

const app = express();
const PORT = 3000;

app.use(express.json());

let numbers = [];

/**
 * Accepts a number and returns the average of all numbers
 * submitted since the server started.
 *
 * @param {import('express').Request} req - HTTP request.
 * @param {import('express').Response} res - HTTP response.
 * @returns {void}
 */
app.post('/average', (req, res) => {
    const number = req.body.number;

    if (typeof number !== 'number' || !Number.isFinite(number)) {
        return res.status(400).json({
            error: 'Please provide a valid number.'
        });
    }

    numbers.push(number);

    const sum = numbers.reduce((total, value) => total + value, 0);
    const average = sum / numbers.length;

    res.json({
        number: number,
        count: numbers.length,
        average: average
    });
});

if (require.main === module) {
    app.listen(PORT, () => {
        console.log(`Server running at http://localhost:${PORT}`);
    });
}

module.exports = app;
