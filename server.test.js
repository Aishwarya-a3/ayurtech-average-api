
const request = require('supertest');
const app = require('./server');

describe('POST /average', () => {
    test('returns the number as the first average', async () => {
        const response = await request(app)
            .post('/average')
            .send({ number: 10 });

        expect(response.status).toBe(200);
        expect(response.body.average).toBe(10);
    });

    test('rejects invalid input', async () => {
        const response = await request(app)
            .post('/average')
            .send({ number: 'hello' });

        expect(response.status).toBe(400);
    });

    test('rejects a missing number', async () => {
        const response = await request(app)
            .post('/average')
            .send({});

        expect(response.status).toBe(400);
    });
});
