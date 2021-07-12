import request from 'supertest';
import app from '../app.js';

const deg2rad = deg => deg * Math.PI / 180; // converts degrees to radians

export function findDistance(point1, point2) {  
  // radius is assumed to be in miles 
  const R = 3958.8; // radius of earth in miles
  
  const { latitude: lat1, longitude: lon1 } = point1;
  const { latitude: lat2, longitude: lon2 } = point2;

  const dLat = deg2rad(lat1 - lat2);
  const dLon = deg2rad(lon1 - lon2);

  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) + 
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2); 

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)); 
  
  return R * c; 
}

export function isWithinRadius(point1, point2, radius) {
  return findDistance(point1, point2) <= radius;
}

//address to lat/lon
function mungeGeocode(response) {
  const { lat: latitude, lon: longitude } = response.results.locations[0].latLng;
  return { latitude, longitude };
}

export async function geocode(address) {
  const response = await request(app)
    .get('https://open.mapquestapi.com/geocoding/v1/address')
    .query({ key: process.env.MAPQUEST_KEY, location: address });

  return mungeGeocode(response.body);
}


//lat/lon to address
export async function reverseGeocode(lat, lon) {

}
