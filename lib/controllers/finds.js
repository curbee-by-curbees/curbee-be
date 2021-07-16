import { Router } from 'express';
import Find from '../models/Find.js';
import ensureAuth from '../middleware/ensure-auth.js';
import FindService from '../services/FindService.js';

export default Router()
  .post('/', ensureAuth, (req, res, next) => {
    Find.insert({ 
      ...req.body,
      userId: req.user.id
    })
      .then(find => res.send(find))
      .catch(next);
  })

  .post('/nearby', (req, res, next) => {
    FindService.getNearbyFindsAndDistances(req.body)
      .then(find => res.send(find))
      .catch(next);
  })

  .get('/:id/alert', ensureAuth, (req, res, next) => {
    FindService.alert(req.params.id)
      .then(find => res.send(find))
      .catch(next);
  })
  
  .get('/:id', ensureAuth, (req, res, next) => {
    FindService.findById(req.params.id)
      .then(find => res.send(find))
      .catch(next);
  })

  .get('/', (req, res, next) => {
    Find.findAll()
      .then(finds => res.send(finds))
      .catch(next);
  })

  .patch('/:id', (req, res, next) => {
    FindService.claimFind(req.params.id)
      .then(find => res.send(find))
      .catch(next);
  })

  .put('/:id', ensureAuth, (req, res, next) => {
    Find.update(req.body, req.params.id)
      .then(find => res.send(find))
      .catch(next);
  })
  
  .delete('/:id', ensureAuth, (req, res, next) => {
    Find.delete(req.params.id)
      .then(find => res.send(find))
      .catch(next);
  }); 

