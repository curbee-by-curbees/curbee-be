import { Router } from 'express';
import { geocode, reverseGeocode } from '../utils/geolocation.js';

export default Router()
  .post('/geocode/:address', (req, res, next) => {
    const geolocation = geocode(req.params.address);
    console.log(geolocation);
  })

  .post('/reverseGeocode', (req, res, next) => {
    const lon = req.body.longitude;  
    const lat = req.body.latitude;

    const geolocation = reverseGeocode(req.body);
  });
