import pool from '../lib/utils/pool.js';
import setup from '../data/setup.js';
import request from 'supertest';
import app from '../lib/app.js';
import UserService from '../lib/services/UserService.js';
import Photo from '../lib/models/Photo.js';

describe('photos routes', () => {

  let agent;
  let user, find;

  beforeEach(async () => {
    setup(pool);

    agent = await request.agent(app);

    user = await UserService.create({
      username: 'me',
      password: 'password',
      phoneNumber: '+15036106163'
    });

    await agent.post('/api/v1/auth/login')
      .send({
        username: 'me',
        password: 'password'
      });
    
    find = (await agent
      .post('/api/v1/finds')
      .send({
        title: 'huge dog',
        isClaimed: false,
        latitude: '45.519960',
        longitude: '-122.637980',
        category: 'scary',
        tags: ['dog', 'scary', 'hercules']
      })
    ).body;
  });

  it('POST a photo to /photos', async () => {
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

  test('PUT a photo to /photos/:id', async () => {
    // upload a photo
    const photo = (await agent
      .post('/api/v1/photos')
      .send({
        userId: user.id,
        findId: find.id,
        photo: 'nightmare.jpg'
      })).body;
    
    // edit the photo
    photo.photo = 'dreamboat.jpg';
    const res = await agent
      .put(`/api/v1/photos/${photo.id}`)
      .send(photo);

    // test that the edit went through
    expect(res.body.photo).toEqual('dreamboat.jpg');
  });

  it('DELETES a photo', async () => {
    const photo = await Photo.insert({
      userId: user.id,
      findId: find.id,
      photo: 'nightmare.jpg'
    });

    const res = await agent
      .delete(`/api/v1/photos/${photo.id}`)
      .send(photo);


    expect(res.body).toEqual(photo);
  });
}); 
