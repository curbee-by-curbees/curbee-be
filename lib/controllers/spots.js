import { Router } from 'express';
import Spot from '../models/Spot.js';

export default Router()
  .post('/', (req, res, next) => {
    Spot.create(req.body)
      .then(spot => res.send(spot))
      .then(next);
  })

  .get('/', (req, res, next) => {
    Spot.findAll()
      .then(spots => res.send(spots))
      .catch(next);
  })
  
  .get('/:id', (req, res, next) => {
    Spot.findById(req.params.id)
      .then(spot => res.send(spot))
      .catch(next);
  })

  .put('/:id', (req, res, next) => {
    Spot.update(req.body, req.params.id)
      .then(spot => res.send(spot))
      .catch(next);
  });
  
  
  
  
  
;
