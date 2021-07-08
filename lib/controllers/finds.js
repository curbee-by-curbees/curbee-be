import { Router } from 'express';
import Find from '../models/Find.js';
import ensureAuth from '../middleware/ensure-auth.js';

export default Router()
  .post('/', ensureAuth, (req, res, next) => {
    Find.insert({ 
      ...req.body,  
      userId: req.user.id
    })
      .then(find => res.send(find))
      .catch(next);
  })

  .get('/', (req, res, next) => {
    Find.findAll()
      .then(finds => res.send(finds))
      .catch(next);
  })

  .get('/:id', ensureAuth, (req, res, next) => {
    Find.findById(req.params.id)
      .then(find => res.send(find))
      .catch(next);
  })

  .put('/:id', ensureAuth, (req, res, next) => {
    Find.update(req.body, req.params.id)
      .then(find => res.send(find))
      .catch(next);
  });
