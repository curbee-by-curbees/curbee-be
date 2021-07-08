import pool from '../lib/utils/pool.js';
import setup from '../data/setup.js';
import request from 'supertest';
import app from '../lib/app.js';
// import Spot from '../lib/models/Spot.js';

const home = {
  name: 'home',
  // userId: '1',
  radius: 1,
  latitude: '45.505100',
  longitude: '-122.675000',
};


describe('spot routes', () => {
  beforeEach(() => {
    return setup(pool);
  });

  it('creates a spot via POST', async () => {
    const res = await request(app)
      .post('/api/v1/spots')
      .send(home);

    expect(res.body).toEqual({
      id: '1',
      ...home,
  
    });
  });





});
