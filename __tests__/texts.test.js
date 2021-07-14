import pool from '../lib/utils/pool.js';
import setup from '../data/setup.js';
import request from 'supertest';
import app from '../lib/app.js';
import User from '../lib/models/User.js';
import Find from '../lib/models/Find.js';
import Spot from '../lib/models/Spot.js';
import UserService from '../lib/services/UserService.js';
import FindService from '../lib/services/FindService.js';
import TextService from '../lib/services/TextService.js';


describe('twilio utils', () => {
  beforeEach(() => {
    return setup(pool);
  });

  it('returns an array of user phone numbers by subscribed lookout spots', async () => {
    
    const user1 = await UserService.create({
      username: 'me',
      password: 'password',
      phoneNumber: '+15036106163‬'
    });

    await Spot.create({
      name: 'home',
      userId: user1.id,
      radius: 5,
      latitude: '45.519958',
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
    
    const cat = await FindService.create({
      title: 'Porcelain cat statue',
      isClaimed: false,
      latitude: '45.519960',
      longitude: '-122.637980',
      category: 'decor',
      tags: ['statue', 'cat']
    });

    const actual = await TextService.findSubscriberNumbers({ longitude: cat.longitude, latitude: cat.latitude });
    expect(actual).toEqual([user2.phoneNumber]);
  });
});
