import pool from '../lib/utils/pool.js';
import setup from '../data/setup.js';
import request from 'supertest';
import app from '../lib/app.js';
// import Find from '../lib/models/Find.js';

const couch = {
  title: 'couch',
  userId: '1',
  isClaimed: false,
  latitude: 45.5051,
  longitude: -122.6750,
  category: 'furniture',
  tags: ['couch', 'orange', 'sofa']
};


describe('finds routes', () => {
  beforeEach(() => {
    return setup(pool);
  });

  it('creates a find via POST', async () => {
    const res = await request(app)
      .post('/api/v1/finds')
      .send(couch);

    expect(res.body).toEqual({
      id: 1,
      ...couch,
      createdAt: expect.any(String)
    });
  });





});
