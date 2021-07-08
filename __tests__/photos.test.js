import pool from '../lib/utils/pool.js';
import setup from '../data/setup.js';
import request, { agent } from 'supertest';
import app from '../lib/app.js';

describe('photos routes', () => {
  beforeEach(() => {
    return setup(pool);
  });

  it('POST a photo', async () => {
    const res = await agent
      .post('/api/v1/photos')
      .send({
        
      })
  })
}); 
