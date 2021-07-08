import pool from '../lib/utils/pool.js';
import setup from '../data/setup.js';
import request from 'supertest';
import app from '../lib/app.js';
import Find from '../lib/models/Find.js';
import UserService from '../lib/services/UserService.js';


describe.only('finds routes', () => {
  
  const agent = request.agent(app);
  let user;

  beforeEach(async() => {
    await setup(pool);

    user = await UserService.create({
      username: 'me',
      password: 'password',
      phoneNumber: '14206661234' 
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
    latitude: '45.519960',
    longitude: '-122.637980',
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

  it.only('creates a find via POST', async () => {
    const res = await agent
      .post('/api/v1/finds')
      .send(find1);

    expect(res.body).toEqual({ ...find1, id: '1', createdAt: expect.any(String) });
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
    
    const catDateFix = { ...cat, createdAt: expect.any(String) };

    expect(res.body).toEqual(catDateFix);
  });

  it('updates a find via PUT', async() => {
    const find = await Find.insert(find1);

    find.isClaimed = true;
    find.tags = ['statue', 'cat', 'porcelain'];

    const res = await agent
      .put(`/api/v1/${find.id}`)
      .send(find);

    expect(res.body).toEqual({
      ...find, 
      isClaimed: true, 
      tags: ['statue', 'cat', 'porcelain']
    });
    
  });
});
