import pool from '../lib/utils/pool.js';
import setup from '../data/setup.js';
import request, { agent } from 'supertest';
import app from '../lib/app.js';
import UserService from '../lib/services/UserService.js';
import { jest } from '@jest/globals'

describe('photos routes', () => {


  let agent;
  let user, find;

  beforeEach( async () => {
    setup(pool);
    agent = await request.agent(app);
    user = await UserService.create({
      username: 'me',
      password: 'password',
      phoneNumber: '14206661234'
    });
    await agent.post('/api/v1/auth/login')
      .send({
        username: 'me',
        password: 'password'
      });
    find = await agent
      .post('/api/v1/finds')
      .send({
        title: 'huge dog',
        isClaimed: false,
        latitude: '45.519960',
        longitude: '-122.637980',
        category: 'scary',
        tags: ['dog', 'scary', 'hercules']
      })
    
  });

  it('POST a photo', async () => {
    const res = await agent
      .post('/api/v1/photos')
      .send({
        userId: user.id,
        findId: find.id,
        photo: 'nightmare.jpg'
      });

    expect(res.body).toEqual({
      id: '1',
      userId: user.id,
      findId: find.id,
      photo: 'nightmare.jpg'
    });
  });
}); 
