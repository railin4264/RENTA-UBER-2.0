import request from 'supertest';
import app from '../src/app';

describe('auth integration', () => {
  it('fails login with missing fields', async () => {
    const res = await request(app).post('/api/auth/login').send({}).expect(400);
    expect(res.body.success).toBe(false);
  });

  it('fails login with wrong credentials', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'no@user.com', password: 'wrong' })
      .expect(401);
    expect(res.body.success).toBe(false);
  });
});