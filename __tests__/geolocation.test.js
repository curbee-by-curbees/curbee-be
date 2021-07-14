import { isWithinRadius, geocode } from '../lib/utils/geolocation.js';
import request from 'supertest';
import app from '../lib/app.js';

describe.skip('radius tests', () => {

  test('test if two point are within each other', () => {
    const input = [
      { latitude: 33.670683, longitude: -117.829597 },
      { latitude: 33.695798, longitude: -117.813578 },
      5
    ];
    const expected = true;
    const actual = isWithinRadius(...input);

    expect(actual).toEqual(expected);
  });
});

describe('geocoding routes tests', () => {
  
  test('POST to /geo/geocode/:address receives address and returns lat/long', async () => {
    const input = '1313 Disneyland Dr Anaheim, CA';

    const actual = (await request(app)
      .post(`/api/v1/geo/geocode/${input}`)).body;

    const expected = {
      latitude: 33.812371,
      longitude: -117.920431
    };

    expect(Number(actual.latitude)).toBeCloseTo(expected.latitude, 2);
    expect(Number(actual.longitude)).toBeCloseTo(expected.longitude, 1);
  });

  test('POST to /geo/reverse-geocode', async () => {
    const input = {
      latitude: 33.812371,
      longitude: -117.920431
    };

    const actual = (await request(app)
      .post('/api/v1/geo/reverse-geocode')
      .send(input)
    ).body;

    const expected = {
      street: 'Big Thunder Mountain Fastpass Distubtion',
      postalCode: '217',
      city: 'Anaheim',
      state: 'CA',
      country: 'US'
    };
    // 'Big Thunder Mountain Fastpass Distubtion\nAnaheim, CA 217\nUS';

    expect(actual).toEqual(expected);
  });

});
