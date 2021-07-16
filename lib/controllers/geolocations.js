import { Router } from 'express';
import { geocode, reverseGeocode } from '../utils/geolocation.js';

export default Router()
  .post('/geocode/:address', (req, res, next) => {
    geocode(req.params.address)
      .then(geolocation => res.send(geolocation))
      .catch(next);
  })

  .post('/reverse-geocode', (req, res, next) => {
    const { latitude: lat, longitude: lng } = req.body;

    reverseGeocode(lat, lng)
      .then(address => res.send(address))
      .catch(next);
  });
