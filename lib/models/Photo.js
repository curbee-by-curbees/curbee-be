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

  static async insert({ userId, findId, photo }) {

    const { rows } = await pool.query(
      'INSERT INTO photos (user_id, find_id, photo) VALUES ($1, $2, $3) RETURNING *',
      [userId, findId, photo]
    );

    return new Photo(rows[0]);
  }

  static async edit({ id, userId, findId, photo }) {
    const { rows } = await pool.query(`
      UPDATE photos
      SET user_id = $2, find_id = $3, photo = $4
      WHERE id = $1
      RETURNING *;
      `,
      [id, userId, findId, photo]
    );

    return new Photo(rows[0]);
  }

  static async delete(id) {
    const { rows } = await pool.query(`
    DELETE FROM photos
    WHERE id = $1
    RETURNING *;`,
    [id]
    );
    return new Photo(rows[0]);
  }

  static async getBy(id, col = 'find_id' ) {
    const { rows } = await pool.query(
      `SELECT *
        FROM photos
        WHERE ${col} = $1` ,
        [id]
    );
      return rows.map(photo => new Photo(photo));
  }
}
