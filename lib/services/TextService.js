import { sendSms } from '../utils/twilio.js';
import { Spot } from '../models/Spot.js';
import { isWithinRadius } from '../utils/geolocation.js';
import { User } from '../models/User.js';

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

  // call getNearbyFind when find is posted

  static async findSubscriberNumbers(location) {
    const findAllLookoutSpots = Spot.findAll();
    // call util to find if something is nearby on every item of array
    const findSpotsWithinRadius = findAllLookoutSpots.filter(spot => 
      isWithinRadius(
        location, 
        {
          latitude: spot.latitude,
          longitude: spot.longitude
        },
        spot.radius
      ) 
    );
    const findSubscriberIds = findSpotsWithinRadius.map(spot => spot.userId);
    const getSubscriberNumbers = findSubscriberIds.map(id => User.findNumberByUserId(id));
    // filter out duplicate numbers 
    return getSubscriberNumbers;
  }
}
