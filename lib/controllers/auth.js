import { Router } from 'express';
import UserService from '../services/UserService.js';

export default Router()
  .post('/auth/signup', (req, res, next) => {
    UserService.create(req.body)
      .then(user => {
        res.cookie('session', user.authToken(), { httpsOnly: true, maxAge: 3600000 * 24 });
        res.send({ ...user, token: user.authToken() });
      })
      .catch(next);
  })

  .post('/auth/login', (req, res, next) => {
    UserService.authorize(req.body)
      .then(user => {
        res.cookie('session', user.authToken(), { httpsOnly: true, maxAge: 3600000 * 24 });
        res.send({ ...user, token: user.authToken() });
      })
      .catch(next);
  })
;
