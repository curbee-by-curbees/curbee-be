import pool from '../lib/utils/pool.js';
import setup from '../data/setup.js';
import request from 'supertest';
import app from '../lib/app.js';

describe('finds routes', () => {
  beforeEach(() => {
    return setup(pool);
  });

  let find1 = {
    // userId: '1',
    title: 'Porcelain cat statue',
    isClaimed: false,
    latitude: '45.519960',
    longitude: '-122.637980',
    category: 'decor',
    tags: ['statue', 'cat']
  };

  it('creates a find via POST', async () => {
    const res = await request(app)
      .post('/api/v1/finds')
      .send(find1);

    expect(res.body).toEqual({ ...find1, id: '1', createdAt: expect.any(String) });
  });
});
