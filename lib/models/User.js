import pool from '../utils/pool.js';

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
}
