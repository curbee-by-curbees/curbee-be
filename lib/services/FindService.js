import Photo from '../models/Photo.js';
import Find from '../models/Find.js';
import { reverseGeocode } from '../utils/geolocation.js';

export default class FindService {
  getById(id) {
    const photos = Photo.getBy(id, 'find_id');
    const find = Find.getById(id);

    const { city } = reverseGeocode(find.latitude, find.longitude);
    return { ...find, city, photos };
  } 
}
