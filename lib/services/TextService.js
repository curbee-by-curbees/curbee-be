import { sendSms } from '../utils/twilio.js';
import Spot from '../models/Spot.js';
import { isWithinRadius } from '../utils/geolocation.js';
import User from '../models/User.js';
import { removeDuplicates } from '../utils/text.js';
import { reverseGeocode } from '../utils/geolocation.js';

// send a text
// receive a text
// munge received text's data
// receive an image through text
// send an image through text

export default class TextService {
  
  static async welcomeText(username, phoneNumber) {
    const text = await sendSms(
      phoneNumber,
      `\n\nWelcome to curbee, ${username}!\n\nFor full customization, visit https://www.curbee.app or text '!HELP' for more options.`
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
    
    //compare spot userId to users table 
    const getSubscriberNumbers = await Promise.all(findSubscriberIds.map(async id => await User.findNumberByUserId(id)));
    
    // filter out duplicate numbers 
    const nonDuplicates = removeDuplicates(getSubscriberNumbers.flat());

    return nonDuplicates;
  }

  static async newFindText(user, phoneNumber, find) {
    const address = await reverseGeocode(find.latitude, find.longitude);    
    
    if (address.street) {
      if (find.photos[0]) {
        const text = await sendSms(
          phoneNumber,
          `\n\nHey, ${user.username}! There's a new Curbee find near one of your lookout spots!\n\n[${find.title}] near ${address.street} in ${address.city}, ${address.state}.\n\nFor full customization, visit https://www.curbee.app or text '!HELP' for more options.`,
          `${find.photos[0].photo}`
        );
        return text;
      } else {
        const text = await sendSms(
          phoneNumber,
          `\n\nHey, ${user.username}! There's a new Curbee find near one of your lookout spots!\n\n[${find.title}] near ${address.street} in ${address.city}, ${address.state}.\n\nFor full customization, visit https://www.curbee.app or text '!HELP' for more options.`
        );
        return text;
      }
    } else {
      if (find.photos[0]) {
        const text = await sendSms(
          phoneNumber,
          `\n\nHey, ${user.username}! There's a new Curbee find near one of your lookout spots!\n\n[${find.title}] near in ${address.city}, ${address.state}.\n\nFor full customization, visit https://www.curbee.app or text '!HELP' for more options.`,
          `${find.photos[0].photo}`
        );
        return text;
      } else {
        const text = await sendSms(
          phoneNumber,
          `\n\nHey, ${user.username}! There's a new Curbee find near one of your lookout spots!\n\n[${find.title}] near in ${address.city}, ${address.state}.\n\nFor full customization, visit https://www.curbee.app or text '!HELP' for more options.`
        );
        return text;
      }
    }
  }
}

