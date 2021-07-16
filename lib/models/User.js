import pool from '../utils/pool.js';
import jwt from 'jsonwebtoken';

export default class User {
  id;
  username;
  passwordHash;
  phoneNumber;

  constructor(row) {
    this.id = row.id;
    this.username = row.username;
    this.passwordHash = row.password_hash;
    this.phoneNumber = row.phone_number;
  }

  static async create({ username, passwordHash, phoneNumber }) {
    const { rows } = await pool.query(`
      INSERT INTO users (username, password_hash, phone_number)
      VALUES ($1, $2, $3)
      RETURNING *;
    `, [username, passwordHash, phoneNumber]);

    return new User(rows[0]);
  }

  static async findByUsername(username) {
    const { rows } = await pool.query(
      'SELECT * FROM users WHERE username = $1;',
      [username]
    );

    if(!rows[0]) return null;
    return new User(rows[0]);
  }

  static async findNumberByUserId(id) {
    const { rows } = await pool.query(
      'SELECT phone_number as "phoneNumber" FROM users WHERE id = $1;',
      [id]
    );

    if(!rows[0]) return null;
    return rows[0].phoneNumber;
  }

  static async findByNumber(number) {
    console.log(`\x1b[35m%s\x1b[0m`,'number: ' + number);
    
    const { rows } = await pool.query(
      `
      SELECT * FROM users WHERE phone_number = $1
      `, [number]
    );

    //'+15036106163‬' good number
    // +15036106163 bad number

    const goodNumber = '+15036106163‬';
    const badNumber = '+15036106163';

    // console.log(goodNumber===badNumber);

    // console.log(`\x1b[35m%s\x1b[0m`,'good number: ');
    // [...goodNumber].map(char => console.log(char.charCodeAt(0)));
    // console.log(`\x1b[35m%s\x1b[0m`,'bad number: ');
    // [...badNumber].map(char => console.log(char.charCodeAt(0)));

    console.log('rows: ', rows);

    if (!rows[0]) return null;
    else return new User(rows[0]);
  }

  authToken() {
    return jwt.sign(
      { ...this },
      process.env.APP_SECRET,
      { expiresIn: '24h' }
    );
  }
}
