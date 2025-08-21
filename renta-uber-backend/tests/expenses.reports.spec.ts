import request from 'supertest';
import app from '../src/app';

async function getToken() {
  const res = await request(app).post('/api/auth/login').send({ email: 'admin@rentauber.com', password: 'admin123' });
  if (!res.body?.data?.token) throw new Error('No token');
  return res.body.data.token as string;
}

function uid(prefix: string) { return `${prefix}-${Date.now()}-${Math.floor(Math.random()*10000)}`; }

async function ensureVehicle(token: string) {
  const res = await request(app)
    .post('/api/vehicles')
    .set('Authorization', `Bearer ${token}`)
    .send({ model: 'Exp', plate: uid('EXP'), year: 2023, color: 'Gray' });
  return res.body.data.id as string;
}

describe('expenses and reports', () => {
  let token = '';
  let vehicleId = '';
  let expenseId = '';

  beforeAll(async () => {
    token = await getToken();
    vehicleId = await ensureVehicle(token);
  });

  it('creates an expense', async () => {
    const res = await request(app)
      .post('/api/expenses')
      .set('Authorization', `Bearer ${token}`)
      .send({ amount: 100, vehicleId, date: new Date().toISOString(), category: 'maintenance', description: 'Oil' })
      .expect(201);
    expenseId = res.body.data.id;
  });

  it('gets expense by id', async () => {
    await request(app)
      .get(`/api/expenses/${expenseId}`)
      .expect(200);
  });

  it('lists reports dashboard', async () => {
    await request(app)
      .get('/api/reports/dashboard')
      .expect(200);
  });
});