import { sendSms } from '../utils/twilio.js';
import Text from '../models/Text.js';
import request from 'superagent'; 

// send a text
// recieve a text
// munge received text's data
// receive an image through text
// send an image through text

export default class TextService {
  static async create({ username, passwordHash, phoneNumber }) {
    const text = await Text.create({ username, passwordHash, phoneNumber });
    await sendSms(
      process.env.RECIPIENT_NUMBER,
      `hi ${username}`
    );
    return text;
  }
}
