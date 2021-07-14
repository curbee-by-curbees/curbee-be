import Find from '../models/Find.js';
import User from '../models/User.js';
import Photo from '../models/Photo.js';
import TextService from './TextService.js';
import { findDistance, reverseGeocode } from '../utils/geolocation.js';

export default class FindService {

  static async create(find) {

    const newFind = await Find.insert(find);

    //get array of numbers with spots within radius
    const numbers = await TextService.findSubscriberNumbers({ longitude: newFind.longitude, latitude: newFind.latitude });

    //send text to all numbers
    await Promise.all(numbers.map(async number => {
      const user = await User.findByNumber(number);
      TextService.newFindText(user.username, number);
      return;
    }));

    return newFind;
  }

  static getById(id) {
    const find = Find.getById(id);
    const photos = Photo.getBy(id, 'find_id');
    const { city } = reverseGeocode(find.latitude, find.longitude);

    return { ...find, city, photos };
  } 

  static getNearbyFinds(lat, lng, radius) {
    // we want all finds within a certain radius of that spot
    // we want to return the distance of that find from the spot
  }
}
