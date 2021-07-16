import pool from '../utils/pool.js';

export default class Find {
  id;
  userId;
  title;
  isClaimed;
  latitude;
  longitude;
  category;
  tags;
  createdAt;

  constructor(row) {
    this.id = row.id;
    this.userId = row.user_id;
    this.title = row.title;
    this.isClaimed = row.is_claimed;
    this.latitude = row.latitude;
    this.longitude = row.longitude;
    this.category = row.category;
    this.tags = row.tags;
    this.createdAt = row.created_at;
  }

  static async insert({ userId, title, latitude, longitude, category, tags }) {
    const { rows } = await pool.query(`
        INSERT INTO finds (user_id, title, latitude, longitude, category, tags) 
        VALUES ($1, $2, $3, $4, $5, $6) 
        RETURNING *;
      `, [userId, title, latitude, longitude, category, tags]
    );

    return new Find(rows[0]);
  }

  static async findAll() {
    const { rows } = await pool.query(
      'SELECT * FROM finds'
    );

    return rows.map(row => new Find(row));
  }

  static async findById(id) {
    const { rows } = await pool.query(
      'SELECT * FROM finds WHERE id = $1', [id]
    );

    return new Find(rows[0]);
  }

  static async findBy(val, key = 'id') {
    const { rows } = await pool.query(`
      SELECT * 
      FROM finds 
      WHERE ${key} = $1;
      `, [val]
    );
    
    return new Find(rows[0]);
  }

  static async claim(id) {
    const { rows } = await pool.query(`
      UPDATE finds
      SET is_claimed = TRUE
      WHERE id = $1
      RETURNING *
    `, [id]);
    return new Find(rows[0]);
  }

  static async update(find, id) {
    const {rows} = await pool.query(`
      UPDATE finds
      SET user_id = $1,
          title = $2, 
          is_claimed = $3, 
          latitude = $4, 
          longitude = $5, 
          category = $6, 
          tags = $7 
      WHERE id = $8
      RETURNING *
    `, [find.userId, find.title, find.isClaimed, find.latitude, find.longitude, find.category, find.tags, id]);

    return new Find(rows[0]);
  }

  static async delete(id) {
    const { rows } = await pool.query(`
      DELETE FROM finds
      WHERE id = $1
      RETURNING *
    `, [id]);

    return new Find(rows[0]);
  }
};
