import { Router } from 'express';
import Find from '../models/Find.js';

export default Router()
  .post('/', (req, res, next) => {
    Find.insert({ 
      ...req.body,  
      // userId: req.user.id
    })
      .then(find => res.send(find))
      .catch(next);
  })
  .get('/', (req, res, next) => {
    Find.findAll()
      .then(finds => res.send(finds))
      .catch(next);
  });
