import pool from '../lib/utils/pool.js';
import setup from '../data/setup.js';
import request from 'supertest';
import app from '../lib/app.js';
import Text from '../lib/models/Text.js';

describe('demo routes', () => {
  beforeEach(() => {
    return setup(pool);
  });

  it.skip('creates a item in users database with name', async () => {
    const res = await request(app)
      .post('/api/v1/texts')
      .send({ 
        username: 'Tis',
        passwordHash: 'lalalala',
        phoneNumber: '8675309'
      });
    
    expect(res.body).toEqual({
      id: 1,
      username: 'Tis',
      phoneNumber: '8675309',
      passwordHash: 'lalalala'
    });
  });

});
