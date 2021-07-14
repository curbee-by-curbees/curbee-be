import { sendSms } from '../utils/twilio.js';
import Spot from '../models/Spot.js';
import { isWithinRadius } from '../utils/geolocation.js';
import User from '../models/User.js';
import { removeDuplicates } from '../utils/text.js';

// send a text
// receive a text
// munge received text's data
// receive an image through text
// send an image through text

export default class TextService {
  
  static async welcomeText(username, phoneNumber) {
    const text = await sendSms(
      phoneNumber,
      `Welcome to curbee, ${username}! For full customization, including adding new lookout spots, visit https://curbee.app.`
    );
    return text;
  } 

  //gets a list of numbers of users with spots within radius
  static async findSubscriberNumbers(location) {
    const findAllLookoutSpots = await Spot.findAll();
 
    const findSpotsWithinRadius = findAllLookoutSpots.filter(spot => 
      isWithinRadius(
        location, 
        { latitude: spot.latitude, longitude: spot.longitude },
        spot.radius
      )
    );

    const findSubscriberIds = findSpotsWithinRadius.map(spot => spot.userId);   
    const getSubscriberNumbers = await Promise.all(findSubscriberIds.map(async id => await User.findNumberByUserId(id)));
    
    // filter out duplicate numbers 
    const nonDuplicates = removeDuplicates(getSubscriberNumbers.flat());

    return nonDuplicates;
  }
}
