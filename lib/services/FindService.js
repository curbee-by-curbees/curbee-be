import Find from '../models/Find.js';
import User from '../models/User.js';
import Photo from '../models/Photo.js';
import TextService from './TextService.js';
import { findDistance, isWithinRadius, reverseGeocode } from '../utils/geolocation.js';

export default class FindService {

  static async alert(id) {

    const newFind = await this.findById(id);

    //get array of numbers with spots within radius
    const numbers = await TextService.findSubscriberNumbers({ longitude: newFind.longitude, latitude: newFind.latitude });

    //send text to all numbers
    await Promise.all(numbers.map(async number => {
      const user = await User.findByNumber(number);
      TextService.newFindText(user, number, newFind);
      return;
    }));

    return newFind;
  }

  static async findById(id) {
    const find = await Find.findBy(id, 'id');
    const photos = await Photo.findBy(id, 'find_id');
    const address = await reverseGeocode(find.latitude, find.longitude);

    return { ...find, city: address.city, photos };
  } 

  static async getNearbyFindsAndDistances(location) {

    const allFinds = await Find.findAll();

    const findsWithinRadius = allFinds.filter(find => isWithinRadius(
      { latitude: location.latitude, longitude: location.longitude }, 
      { latitude: find.latitude, longitude: find.longitude }, 
      location.radius)
    );

    return await Promise.all(findsWithinRadius.map(async find => await ({ 
      ...find, 
      photos: await Photo.findBy(find.id, 'find_id'),
      distance: findDistance({ latitude: location.latitude, longitude: location.longitude }, { latitude: find.latitude, longitude: find.longitude }) 
    })));
  }
}
