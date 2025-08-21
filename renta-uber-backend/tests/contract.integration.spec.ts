import request from 'supertest';
import app from '../src/app';

describe('contracts integration', () => {
  test('calculate penalty endpoint returns expected value', async () => {
    const res = await request(app)
      .post('/api/contracts/any-id/calculate-penalty')
      .send({ base: 1000, penaltyRate: 0.01, daysLate: 5, allowedDelayDays: 3 })
      .expect(200);

    expect(res.body.success).toBe(true);
    expect(res.body.data).toHaveProperty('penalty');
    expect(res.body.data.penalty).toBeCloseTo(20);
  });

  test('download contract returns attachment headers', async () => {
    const res = await request(app)
      .get('/api/contracts/test-id/download')
      .expect(200);

    expect(res.headers['content-disposition']).toContain('attachment');
    expect(res.headers['content-type']).toContain('application/pdf');
  });
});
