import pool from '../lib/utils/pool.js';
import setup from '../data/setup.js';
import request from 'supertest';
import app from '../lib/app.js';
import TextService from '../lib/services/TextService.js';
import Find from '../lib/models/Find.js';
import UserService from '../lib/services/UserService.js';
import Spot from '../lib/models/Spot.js';
import User from '../lib/models/User.js';


describe('demo routes', () => {
  beforeEach(() => {
    return setup(pool);
  });

  it.only('returns an array of user phone numbers by subscribed lookout spots', async () => {
    const cat = await Find.insert({
      title: 'Porcelain cat statue',
      isClaimed: false,
      latitude: '45.519960',
      longitude: '-122.637980',
      category: 'decor',
      tags: ['statue', 'cat']
    });

    const user1 = await UserService.create({
      username: 'me',
      password: 'password',
      phoneNumber: '+15036106163‬'
    });

    await Spot.create({
      name: 'home',
      userId: user1.id,
      radius: 5,
      latitude: '55.519958',
      longitude: '-122.637992',
      tags: ['couch', 'lamp']
    });
    
    const user2 = await UserService.create({
      username: 'you',
      password: 'password',
      phoneNumber: '+15036106163‬'
    });
    await Spot.create({
      name: 'work',
      userId: user2.id,
      radius: 5,
      latitude: '45.519965',
      longitude: '-122.637960',
      tags: ['couch', 'lamp']
    });    
    
    const actual = await TextService.findSubscriberNumbers({ longitude: cat.longitude, latitude: cat.latitude });
    expect(actual).toEqual([user2.phoneNumber]);
  });
});