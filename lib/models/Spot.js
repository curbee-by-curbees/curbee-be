import pool from '../utils/pool.js';


export default class Spot {
  id;
  name;
  userId;
  radius;
  latitude;
  longitude;

  constructor(row) {
    this.id = row.id;
    this.name = row.name;
    this.userId = row.user_id;
    this.radius = row.radius;
    this.latitude = row.latitude;
    this.longitude = row.longitude;
  }

  static async create({ name, userId, radius, latitude, longitude }) {
    const { rows } = await pool.query(
      `INSERT INTO spots (name, user_id, radius, latitude, longitude)
        VALUES ($1, $2, $3, $4, $5)
        RETURNING *` ,
        [name, userId, radius, latitude, longitude]
    )
    return new Spot(rows[0]);
  }
}