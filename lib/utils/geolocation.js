import request from 'superagent';

// finding distance between points
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

// geocode address to coords
function mungeGeocode(response) {
  if (response.results[0].locations[0]) {
    const { lat: latitude, lng: longitude } = response.results[0].locations[0].latLng;

    return { latitude, longitude };
  } else return null;
}

export async function geocode(address) {
  const response = await request
    .get('https://open.mapquestapi.com/geocoding/v1/address')
    .query({ key: process.env.MAPQUEST_KEY, location: address });

  return mungeGeocode(response.body);
}

// reverse geocode coords to address
function mungeReverseGeocode(response) {
  const result = response.results[0].locations[0];

  if (result) return {
    street: result.street,
    postalCode: result.postalCode,
    city: result.adminArea5,
    state: result.adminArea3,
    country: result.adminArea1
  };
  else return null;
}

export async function reverseGeocode(lat, lng) {
  const response = await request
    .get('http://open.mapquestapi.com/geocoding/v1/reverse')
    .query({ 
      key: process.env.MAPQUEST_KEY, 
      location: [lat, lng].join(',')
    });
  
  return mungeReverseGeocode(response.body);
}
