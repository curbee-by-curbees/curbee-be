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

  static async authorize({ username, password }) {
    const user = await User.findByUsername(username);
    if(!user) {
      throw new Error('Who???');
    }

    const passwordsMatch = await bcrypt.compare(password, user.passwordHash);
    if(!passwordsMatch) {
      throw new Error('Denied entry');
    }

    return user;
  }
}
