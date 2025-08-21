import request from 'supertest';
import app from '../src/app';

async function getToken() {
  const res = await request(app).post('/api/auth/login').send({ email: 'admin@rentauber.com', password: 'admin123' });
  if (!res.body?.data?.token) throw new Error('No token');
  return res.body.data.token as string;
}

function uid(prefix: string) { return `${prefix}-${Date.now()}-${Math.floor(Math.random()*10000)}`; }

async function ensureDriver(token: string) {
  const create = await request(app)
    .post('/api/drivers')
    .set('Authorization', `Bearer ${token}`)
    .send({ firstName: 'Carl', lastName: 'Zed', cedula: uid('12345'), license: uid('LIC'), phone: '099000333' });
  return create.body.data.id as string;
}

async function ensureVehicle(token: string) {
  const create = await request(app)
    .post('/api/vehicles')
    .set('Authorization', `Bearer ${token}`)
    .send({ model: 'Zeta', plate: uid('PLT'), year: 2023, color: 'White' });
  return create.body.data.id as string;
}

describe('contracts CRUD with auth', () => {
  let token = '';
  let contractId = '';
  let driverId = '';
  let vehicleId = '';

  beforeAll(async () => {
    token = await getToken();
    driverId = await ensureDriver(token);
    vehicleId = await ensureVehicle(token);
  });

  it('creates a contract', async () => {
    const res = await request(app)
      .post('/api/contracts')
      .set('Authorization', `Bearer ${token}`)
      .send({ driverId, vehicleId, startDate: new Date().toISOString(), type: 'MONTHLY', monthlyPrice: 1000 })
      .expect(201);
    contractId = res.body.data.id;
  });

  it('retrieves the contract', async () => {
    const res = await request(app)
      .get(`/api/contracts/${contractId}`)
      .expect(200);
    expect(res.body.data.id).toBe(contractId);
  });

  it('updates the contract', async () => {
    await request(app)
      .put(`/api/contracts/${contractId}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ notes: 'Updated' })
      .expect(200);
  });

  it('deletes the contract', async () => {
    await request(app)
      .delete(`/api/contracts/${contractId}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(200);
  });
});