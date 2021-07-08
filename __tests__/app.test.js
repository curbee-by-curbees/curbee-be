import pool from '../lib/utils/pool.js';
import setup from '../data/setup.js';
import request from 'supertest';
import app from '../lib/app.js';
import UserService from '../lib/services/UserService.js';

describe('auth routes', () => {
  // test data
  const user = {
    username: 'me',
    password: 'password',
    phoneNumber: '14206661234'
  };


<<<<<<< HEAD
describe('auth routes', () => {
  // test data
  const user = {
    username: 'me',
    password: 'password',
    phoneNumber: '14206661234'
  };

=======
>>>>>>> 6658eaa484d4319c211a81049c5ef44a21fd2982
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
<<<<<<< HEAD
=======

  it('logs a user in via POST', async () => {
    await UserService.create(user);

    const res = await request(app)
      .post('/api/v1/auth/login')
      .send({
        username: 'me',
        password: 'password'
      });

    expect(res.body).toEqual({
      id: '1',
      username: user.username,
      phoneNumber: user.phoneNumber,
      passwordHash: expect.any(String)
    });
  });
>>>>>>> 6658eaa484d4319c211a81049c5ef44a21fd2982
});