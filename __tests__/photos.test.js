import pool from '../lib/utils/pool.js';
import setup from '../data/setup.js';
import request from 'supertest';
import app from '../lib/app.js';

describe('photos routes', () => {
  beforeEach(() => {
    return setup(pool);
  });
});
