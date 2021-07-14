import Find from '../models/Find.js';
import TextService from './TextService.js';
import User from '../models/User.js';

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
}
