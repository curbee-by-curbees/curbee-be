import Find from '../models/Find.js';
import TextService from './TextService.js';
import User from '../models/User.js';
import { findDistance, isWithinRadius } from '../utils/geolocation.js';

export default class FindService {

  static async create(find) {

    const newFind = await Find.insert(find);
    
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

  static async getNearbyFindsAndDistances(location) {

    const allFinds = await Find.findAll();

    const findsWithinRadius = allFinds.filter(find => isWithinRadius({ latitude: location.latitude, longitude: location.longitude }, { latitude: find.latitude, longitude: find.longitude }, location.radius));

    return await Promise.all (findsWithinRadius.map(async find => await ({ 
      ...find, 
      distance: findDistance({ latitude: location.latitude, longitude: location.longitude }, { latitude: find.latitude, longitude: find.longitude }) 
    })));
  }
}
