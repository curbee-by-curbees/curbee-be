import { Router } from 'express';
import ensureAuth from '../middleware/ensure-auth';
import Photo from '../models/Photo.js';

export default Router() 
  .post('/', ensureAuth, (req, res, next) => {
    Photo.insert(req.body)
      .then(photo => res.send(photo))
      .catch(next);
  })

  .put('/:id', ensureAuth, (req, res, next) => {
    Photo.edit({ id: req.params.id, ...req.body })
      .then(photo => res.send(photo))
      .catch(next);
  })

  .delete('/:id', (req, res, next) => {

  })
;
