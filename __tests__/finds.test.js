import pool from '../lib/utils/pool.js';
import setup from '../data/setup.js';
import request from 'supertest';
import app from '../lib/app.js';
import Find from '../lib/models/Find.js';
import Spot from '../lib/models/Spot.js';
import UserService from '../lib/services/UserService.js';
import FindService from '../lib/services/FindService.js';

describe('finds routes', () => {
  
  const agent = request.agent(app);
  let user;

  beforeEach(async() => {
    await setup(pool);

    user = await UserService.create({
      username: 'me',
      password: 'password',
      phoneNumber: '+15036106163‬'
    });    
    
    await agent
      .post('/api/v1/auth/login')
      .send({
        username: 'me',
        password: 'password' 
      });

    return user;
  });

  const find1 = {
    title: 'Porcelain cat statue',
    isClaimed: false,
    latitude: '45.519958',
    longitude: '-122.637992',
    category: 'decor',
    tags: ['statue', 'cat']
  };

  const find2 = {
    title: 'Marble dog statue',
    isClaimed: false,
    latitude: '45.519960',
    longitude: '-122.637980',
    category: 'decor',
    tags: ['statue', 'dog']
  };

  const find3 = {
    title: 'Crow water',
    isClaimed: false,
    latitude: '55.519960',
    longitude: '-122.637980',
    category: 'beverage',
    tags: ['water', 'crow']
  };

  it('creates a find via POST', async () => {
    await Spot.create({
      name: 'home',
      userId: user.id,
      radius: 5,
      latitude: '45.519958',
      longitude: '-122.637992',
      tags: ['couch', 'lamp']
    });

    await Spot.create({
      name: 'work',
      userId: user.id,
      radius: 5,
      latitude: '45.519965',
      longitude: '-122.637960',
      tags: ['couch', 'lamp']
    });

    const res = await agent
      .post('/api/v1/finds')
      .send(find1);

    expect(res.body).toEqual({ ...find1, id: '1', userId: user.id, createdAt: expect.any(String) });
  });

  it('retrieves all finds', async () => {
    const cat = await Find.insert(find1);
    const dog = await Find.insert(find2);

    const res = await agent
      .get('/api/v1/finds');
    
    const catDateFix = { ...cat, createdAt: expect.any(String) };
    const dogDateFix = { ...dog, createdAt: expect.any(String) };
    
    expect(res.body).toEqual([catDateFix, dogDateFix]);
  });

  it('gets find by id', async () => {
    const cat = await Find.insert(find1);

    const res = await agent
      .get(`/api/v1/finds/${cat.id}`);
    
    const catDateFix = { ...cat, createdAt: expect.any(String), photos: expect.any(Array), city: expect.any(String) };

    expect(res.body).toEqual(catDateFix);
  });

  it('updates a find via PUT', async() => {
    const find = await Find.insert(find1);

    find.isClaimed = true;
    find.tags = ['statue', 'cat', 'porcelain'];

    const actual = await FindService.updateFind({ ...find, isClaimed: true }, '1');

    expect(actual).toEqual({
      ...find, 
      isClaimed: true, 
      tags: ['statue', 'cat', 'porcelain'],
      createdAt: expect.any(Date)
    }); 
  });

  it('claims a find', async() => {
    const find = await Find.insert(find1);
    find.isClaimed = true;

    const actual = await FindService.claimFind('1');   
    
    expect(actual).toEqual({
      ...find, 
      isClaimed: true, 
      createdAt: expect.any(Date)
    });
  });

  it('delete a find via DELETE', async() => {
    const cat = await Find.insert(find1);

    const res = await agent
      .delete(`/api/v1/finds/${cat.id}`)
      .send(cat);

    const catDateFix = { ...cat, createdAt: expect.any(String) };

    expect(res.body).toEqual(catDateFix);
  });

  it('takes in a radius and spot location and returns finds and their distances', async() => {
    const cat = await Find.insert(find1);
    const dog = await Find.insert(find2);
    await Find.insert(find3);

    const location = {
      latitude: '45.519958',
      longitude: '-122.637992',
      radius: 5
    };

    const actual = await FindService.getNearbyFindsAndDistances(location);

    const expected = [{ ...cat, distance: expect.any(Number) }, { ...dog, distance: expect.any(Number) }];

    expect(actual).toEqual(expected);
  });
});
