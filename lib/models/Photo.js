import pool from '../utils/pool.js';

export default class Photo {
  id;
  userId;
  findId;
  photo;

  constructor(row) {
    this.id = row.id;
    this.userId = row.user_id;
    this.findId = row.find_id;
    this.photo = row.photo;
  }
}
