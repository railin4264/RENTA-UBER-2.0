import request from 'supertest';
import app from '../src/app';

async function getToken() {
  const res = await request(app).post('/api/auth/login').send({ email: 'admin@rentauber.com', password: 'admin123' });
  if (!res.body?.data?.token) throw new Error('No token');
  return res.body.data.token as string;
}

function uid(prefix: string) { return `${prefix}-${Date.now()}-${Math.floor(Math.random()*10000)}`; }

describe('drivers CRUD with auth', () => {
  let token = '';
  let createdId = '';

  beforeAll(async () => {
    token = await getToken();
  });

  it('creates a driver', async () => {
    const res = await request(app)
      .post('/api/drivers')
      .set('Authorization', `Bearer ${token}`)
      .send({ firstName: 'Test', lastName: 'Driver', cedula: uid('12345'), license: uid('LIC'), phone: '099000111' })
      .expect(201);
    createdId = res.body.data.id;
  });

  it('gets the created driver', async () => {
    const res = await request(app)
      .get(`/api/drivers/${createdId}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(200);
    expect(res.body.data.id).toBe(createdId);
  });

  it('updates the driver', async () => {
    await request(app)
      .put(`/api/drivers/${createdId}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ phone: '099999999' })
      .expect(200);
  });

  it('deletes the driver', async () => {
    await request(app)
      .delete(`/api/drivers/${createdId}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(200);
  });
});