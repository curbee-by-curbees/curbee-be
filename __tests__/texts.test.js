import pool from '../lib/utils/pool.js';
import setup from '../data/setup.js';
import request from 'supertest';
import app from '../lib/app.js';
import TextService from '../lib/services/TextService.js';
import Find from '../lib/models/Find.js';
import User from '../lib/models/User.js';
import Spot from '../lib/models/Spot.js';


describe('demo routes', () => {
  beforeEach(() => {
    return setup(pool);
  });

  it('returns an array of user phone numbers by subscribed lookout spots', async () => {
    const cat = await Find.insert({
      title: 'Porcelain cat statue',
      isClaimed: false,
      latitude: '45.519960',
      longitude: '-122.637980',
      category: 'decor',
      tags: ['statue', 'cat']
    });
    const user1 = await User.create({
      username: 'me',
      password: 'password',
      phoneNumber: '+15036106163‬'
    });
    await Spot.create({
      name: 'home',
      userId: '1',
      radius: 5,
      latitude: '45.519958',
      longitude: '-122.637992',
      tags: ['couch', 'lamp']
    });
    const user2 = await User.create({
      username: 'you',
      password: 'password',
      phoneNumber: '+12672100393‬'
    });
    await Spot.create({
      name: 'work',
      userId: '2',
      radius: 5,
      latitude: '45.519965',
      longitude: '-122.637960',
      tags: ['couch', 'lamp']
    });

    const actual = TextService.findSubscriberNumber({ longitude: cat.longitude, latitude: cat.latitude });
    expect(actual).toEqual([user1.phoneNumber, user2.phoneNumber]);
  });
});
