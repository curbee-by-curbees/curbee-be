import pool from '../utils/pool.js';


export default class Spot {
  id;
  name;
  userId;
  radius;
  latitude;
  longitude;
  tags;

  constructor(row) {
    this.id = row.id;
    this.name = row.name;
    this.userId = row.user_id;
    this.radius = row.radius;
    this.latitude = row.latitude;
    this.longitude = row.longitude;
    this.tags = row.tags;
  }

  static async create({ name, userId, radius, latitude, longitude, tags }) {
    
    const { rows } = await pool.query(
      `INSERT INTO spots (name, user_id, radius, latitude, longitude, tags)
        VALUES ($1, $2, $3, $4, $5, $6)
        RETURNING *` ,
        [name, userId, radius, latitude, longitude, tags]
    )
    return new Spot(rows[0]);
  }

  static async findAll(){
    const { rows } = await pool.query(
      `SELECT * 
        FROM spots`
      );
    return rows.map(row => new Spot(row));
  }

  static async findAllByUser(userId) {
    const { rows } = await pool.query(
      `SELECT * FROM spots
        WHERE user_id = $1
      `, [userId]
    )
    return rows.map(row => new Spot(row));
  }

  static async findById(id) {
    const { rows } = await pool.query(
      `SELECT *
        FROM spots
        WHERE id = $1` ,
      [id]
    );
    return new Spot(rows[0]);
  }

  static async update(spot, id) {
    const { rows } = await pool.query(
      `UPDATE spots
        SET name = $1, 
          radius = $2, 
          tags = $3
        WHERE id = $4
        RETURNING *`,
      [spot.name, spot.radius, spot.tags, id]
    );
    
    return new Spot(rows[0]);
  }

  static async delete(id) {
    const { rows } = await pool.query(
      `DELETE FROM spots
        WHERE id = $1
        RETURNING *` ,
      [id]
    );
    return new Spot(rows[0]);
  }

}