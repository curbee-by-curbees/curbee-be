import Photo from '../models/Photo.js';
import Find from '../models/Find.js';
import { }

export default class FindService {
  getById(id) {
    const photos = Photo.getBy(id, 'find_id');
    const find = Find.getById(id);

  } 
}
