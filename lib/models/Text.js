import pool from '../utils/pool.js';

export default class Text {

  constructor(row) {
    this.id = Number(row.id);
    this.username = row.username;
    this.passwordHash = row.password_hash;
    this.phoneNumber = row.phone_number;
  }

  static async create({ username, passwordHash, phoneNumber }) {
    
    const { rows } = await pool.query(
      'INSERT INTO users (username, password_hash, phone_number) VALUES ($1, $2, $3) RETURNING *', 
      [username, passwordHash, phoneNumber]
    );        
    
    return new Text(rows[0]);
  }
}
