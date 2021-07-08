import pool from '../utils/pool.js';


export default class Spot {
  id;
  name;;
  radius;
  latitude;
  longitude;

  constructor(row) {
    this.id = row.id;
    this.name = row.name;
    // thi = row.user_id;
    this.radius = row.radius;
    this.latitude = row.latitude;
    this.longitude = row.longitude;
  }

  static async create({ name, radius, latitude, longitude }) {
    const { rows } = await pool.query(
      `INSERT INTO spots (name, radius, latitude, longitude)
        VALUES ($1, $2, $3, $4)
        RETURNING *` ,
        [name, radius, latitude, longitude]
    )
    return new Spot(rows[0]);
  }
}