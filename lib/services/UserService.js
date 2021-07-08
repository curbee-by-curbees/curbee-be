import bcrypt from 'bcrypt';
import User from '../models/User.js';

export default class UserService {
  static async create({ username, password, phoneNumber }) {
    return await User.create({
      username,
      phoneNumber,
      passwordHash: await bcrypt.hash(password, Number(process.env.SALT_ROUNDS))
    });
  }
}
