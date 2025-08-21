import request from 'supertest';
import app from '../src/app';

async function getToken() {
  const res = await request(app).post('/api/auth/login').send({ email: 'admin@rentauber.com', password: 'admin123' });
  if (!res.body?.data?.token) throw new Error('No token');
  return res.body.data.token as string;
}

function uid(prefix: string) { return `${prefix}-${Date.now()}-${Math.floor(Math.random()*10000)}`; }

describe('vehicles CRUD with auth', () => {
  let token = '';
  let createdId = '';
  const plate = uid('ABC');

  beforeAll(async () => {
    token = await getToken();
  });

  it('creates a vehicle', async () => {
    const res = await request(app)
      .post('/api/vehicles')
      .set('Authorization', `Bearer ${token}`)
      .send({ model: 'Model X', plate, year: 2024, color: 'Black' })
      .expect(201);
    createdId = res.body.data.id;
  });

  it('gets the created vehicle', async () => {
    const res = await request(app)
      .get(`/api/vehicles/${createdId}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(200);
    expect(res.body.data.id).toBe(createdId);
  });

  it('updates the vehicle', async () => {
    await request(app)
      .put(`/api/vehicles/${createdId}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ color: 'Blue' })
      .expect(200);
  });

  it('deletes the vehicle', async () => {
    await request(app)
      .delete(`/api/vehicles/${createdId}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(200);
  });
});