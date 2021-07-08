import { Router } from 'express';
import Spot from '../models/Spot.js';
import ensureAuth from '../middleware/ensure-auth.js';

export default Router()
  .post('/', ensureAuth, (req, res, next) => {
    Spot.create(req.body)
      .then(spot => res.send(spot))
      .catch(next);
  })

  .get('/', ensureAuth, (req, res, next) => {
    Spot.findAll()
      .then(spots => res.send(spots))
      .catch(next);
  })
  
  .get('/:id', ensureAuth, (req, res, next) => {
    Spot.findById(req.params.id)
      .then(spot => res.send(spot))
      .catch(next);
  })

  .put('/:id', ensureAuth, (req, res, next) => {
    Spot.update(req.body, req.params.id)
      .then(spot => res.send(spot))
      .catch(next);
  })

  .delete('/:id', ensureAuth, (req, res, next) => {
    Spot.delete(req.params.id)
      .then(spot => res.send(spot))
      .catch(next);
  })


  
  
  
  
;
