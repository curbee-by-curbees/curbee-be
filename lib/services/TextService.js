import { sendSms } from '../utils/twilio.js';

// send a text
// receive a text
// munge received text's data
// receive an image through text
// send an image through text

export default class TextService {
  
  static async welcomeText(username, phoneNumber) {
    const text = await sendSms(
      phoneNumber,
      `Welcome to curbee, ${username}! For full customization, including adding new lookout spots, visit <website>. Response with HELP at any time for a list of commands.`
    );
    return text;
  } 
}
