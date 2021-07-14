import pool from '../lib/utils/pool.js';
import setup from '../data/setup.js';
import request from 'supertest';
import app from '../lib/app.js';
import Spot from '../lib/models/Spot.js';
import UserService from '../lib/services/UserService.js';

const home = {
  name: 'home',
  userId: '1',
  radius: 1,
  latitude: '45.505100',
  longitude: '-122.675000',
  tags: ['couch', 'lamp']
};

const work = {
  name: 'work',
  userId: '1',
  radius: 1,
  latitude: '45.505100',
  longitude: '-122.675000',
  tags: ['couch', 'lamp']
};


describe.skip('spot routes', () => {

  const agent = request.agent(app);
  let user;

  beforeEach(async () => {
    await setup(pool);

    user = await UserService.create({
      username: 'Tis',
      password: 'password',
      phoneNumber: '+15036106163'
    });

    await agent
      .post('/api/v1/auth/login')
      .send({
        username: 'Tis',
        password: 'password'
      });

    return user;
  });

  it('creates a spot via POST', async () => {
    const res = await agent
      .post('/api/v1/spots')
      .send(home);

    expect(res.body).toEqual({
      id: '1',
      ...home,
  
    });
  });

  it('gets all spots via GET', async () => {
    
    await Spot.create(home);
    await Spot.create(work);

    const res = await agent
      .get('/api/v1/spots');
    
    const expected = [
      {
        id: '1',
        ...home
      },
      {
        id: '2',
        ...work
      }
    ];
    
    expect(res.body).toEqual(expected);
  });

  it('gets a spot by ID using GET', async () => {
    const spot = await Spot.create(home);

    const res = await agent
      .get(`/api/v1/spots/${spot.id}`);

    const expected = {
      id: '1',
      ...home
    };

    expect(res.body).toEqual(expected);
  });

  it('updates a spot via PUT', async () => {
    const spot = await Spot.create(home);
    spot.radius = '2';
    
    const res = await agent
      .put(`/api/v1/spots/${spot.id}`)
      .send(spot);

    const expected = {
      id: '1',
      name: 'home',
      userId: '1',
      radius: 2,
      latitude: '45.505100',
      longitude: '-122.675000',
      tags: ['couch', 'lamp']
    };
    
    expect(res.body).toEqual(expected);
  });

  it('deletes a spot via DELETE', async () => {
    const spot = await Spot.create(home);

    const res = await agent
      .delete(`/api/v1/spots/${spot.id}`);

    expect(res.body).toEqual(spot);
  });



});
