import pool from '../lib/utils/pool.js';
import setup from '../data/setup.js';
import request from 'supertest';
import app from '../lib/app.js';

describe('auth routes', () => {
  // test data
  const user = {
    username: 'me',
    password: 'password',
    phoneNumber: '14206661234'
  };

  beforeEach(() => {
    return setup(pool);
  });

  test('POST user to /auth/signup', async () => {
    const res = await request(app)
      .post('/api/v1/auth/signup')
      .send(user)
    ;

    expect(res.body).toEqual({
      id: '1',
      username: user.username,
      phoneNumber: user.phoneNumber,
      passwordHash: expect.any(String)
    });
  });
});
