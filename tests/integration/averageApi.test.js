/**
 * @fileoverview Integration tests for the POST /average API and endpoints using Supertest.
 */

const request = require('supertest');
const app = require('../../src/app');
const averageService = require('../../src/services/averageService');

describe('REST API - POST /average (Integration Tests)', () => {
  beforeEach(() => {
    // Reset service state before every test to ensure isolation
    averageService.reset();
  });

  describe('POST /average - Valid Requests', () => {
    test('should return status 200 and average equal to the single submitted number', async () => {
      const res = await request(app)
        .post('/average')
        .send({ number: 10 });

      expect(res.status).toBe(200);
      expect(res.body).toEqual({
        average: 10,
        count: 1,
        sum: 10,
        received: 10
      });
    });

    test('should calculate progressive running average for consecutive numbers', async () => {
      // First number: 10 => avg 10
      let res = await request(app)
        .post('/average')
        .send({ number: 10 });
      expect(res.status).toBe(200);
      expect(res.body.average).toBe(10);
      expect(res.body.count).toBe(1);

      // Second number: 20 => avg (10+20)/2 = 15
      res = await request(app)
        .post('/average')
        .send({ number: 20 });
      expect(res.status).toBe(200);
      expect(res.body.average).toBe(15);
      expect(res.body.count).toBe(2);
      expect(res.body.sum).toBe(30);

      // Third number: 30 => avg (10+20+30)/3 = 20
      res = await request(app)
        .post('/average')
        .send({ number: 30 });
      expect(res.status).toBe(200);
      expect(res.body.average).toBe(20);
      expect(res.body.count).toBe(3);
      expect(res.body.sum).toBe(60);
    });

    test('should support "value" as an alternative key in JSON payload', async () => {
      const res = await request(app)
        .post('/average')
        .send({ value: 42 });

      expect(res.status).toBe(200);
      expect(res.body.average).toBe(42);
      expect(res.body.count).toBe(1);
    });

    test('should accept negative numbers and calculate correctly', async () => {
      await request(app).post('/average').send({ number: 50 });
      const res = await request(app).post('/average').send({ number: -20 });

      expect(res.status).toBe(200);
      expect(res.body.sum).toBe(30);
      expect(res.body.count).toBe(2);
      expect(res.body.average).toBe(15);
    });

    test('should handle decimal / floating point numbers', async () => {
      await request(app).post('/average').send({ number: 2.5 });
      const res = await request(app).post('/average').send({ number: 7.5 });

      expect(res.status).toBe(200);
      expect(res.body.average).toBe(5);
      expect(res.body.sum).toBe(10);
    });

    test('should parse valid numeric strings in JSON payload', async () => {
      const res = await request(app)
        .post('/average')
        .send({ number: '100' });

      expect(res.status).toBe(200);
      expect(res.body.average).toBe(100);
      expect(res.body.received).toBe(100);
    });
  });

  describe('POST /average - Validation and Error Handling', () => {
    test('should return 400 Bad Request if request body is empty', async () => {
      const res = await request(app)
        .post('/average')
        .set('Content-Type', 'application/json')
        .send({});

      expect(res.status).toBe(400);
      expect(res.body.error).toBe('Bad Request');
      expect(res.body.message).toContain('Please provide a valid finite number');
    });

    test('should return 400 Bad Request if number field contains non-numeric string', async () => {
      const res = await request(app)
        .post('/average')
        .send({ number: 'not-a-number' });

      expect(res.status).toBe(400);
      expect(res.body.error).toBe('Bad Request');
    });

    test('should return 400 Bad Request if number field is null or boolean', async () => {
      const resNull = await request(app)
        .post('/average')
        .send({ number: null });
      expect(resNull.status).toBe(400);

      const resBool = await request(app)
        .post('/average')
        .send({ number: true });
      expect(resBool.status).toBe(400);
    });

    test('should return 400 Bad Request for malformed JSON syntax', async () => {
      const res = await request(app)
        .post('/average')
        .set('Content-Type', 'application/json')
        .send('{ invalid json ');

      expect(res.status).toBe(400);
      expect(res.body.error).toBe('Bad Request');
      expect(res.body.message).toContain('Malformed JSON');
    });
  });

  describe('Auxiliary Endpoints & Client Support', () => {
    test('GET /average should return current cumulative stats without mutating state', async () => {
      await request(app).post('/average').send({ number: 10 });
      await request(app).post('/average').send({ number: 20 });

      const res = await request(app).get('/average');
      expect(res.status).toBe(200);
      expect(res.body.average).toBe(15);
      expect(res.body.count).toBe(2);
      expect(res.body.sum).toBe(30);
      expect(res.body.history).toEqual([10, 20]);
    });

    test('POST /average/reset should reset cumulative metrics to zero', async () => {
      await request(app).post('/average').send({ number: 45 });
      expect(averageService.getCount()).toBe(1);

      const res = await request(app).post('/average/reset');
      expect(res.status).toBe(200);
      expect(res.body.average).toBe(0);
      expect(res.body.count).toBe(0);
      expect(averageService.getCount()).toBe(0);
    });

    test('GET / should serve the Web Client HTML application', async () => {
      const res = await request(app).get('/');
      expect(res.status).toBe(200);
      expect(res.headers['content-type']).toContain('text/html');
      expect(res.text).toContain('POST /average Client Dashboard');
    });

    test('GET /health should return 200 OK status', async () => {
      const res = await request(app).get('/health');
      expect(res.status).toBe(200);
      expect(res.body.status).toBe('ok');
    });

    test('Unknown endpoint should return 404 Not Found', async () => {
      const res = await request(app).get('/non-existent-route');
      expect(res.status).toBe(404);
      expect(res.body.error).toBe('Not Found');
    });
  });
});
