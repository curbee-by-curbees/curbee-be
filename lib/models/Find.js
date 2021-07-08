import pool from '../utils/pool.js';

export default class Find {
  id;
  // userId;
  title;
  isClaimed;
  latitude;
  longitude;
  category;
  tags;
  createdAt;

  constructor(row) {
    this.id = row.id;
    // this.userId = row.user_id;
    this.title = row.title;
    this.isClaimed = row.is_claimed;
    this.latitude = row.latitude;
    this.longitude = row.longitude;
    this.category = row.category;
    this.tags = row.tags;
    this.createdAt = row.created_at;
  }

  static async insert({ title, isClaimed, latitude, longitude, category, tags }) {
    const { rows } = await pool.query(
      'INSERT INTO finds (title, is_claimed, latitude, longitude, category, tags) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *', [title, isClaimed, latitude, longitude, category, tags]
    );
    return new Find(rows[0]);
  }

  static async findAll() {
    const { rows } = await pool.query(
      'SELECT * FROM finds'
    );
    return rows.map(row => new Find(row));
  }
};


