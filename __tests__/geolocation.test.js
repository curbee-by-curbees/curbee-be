import { isWithinRadius, geocode } from '../lib/utils/geolocation.js';

describe('radius tests', () => {

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

describe ('geocoding tests', () => {
  
  test('receives address and returns lat/long', async () => {
    const input = '1313 Disneyland Dr Anaheim, CA';

    const actual = await geocode(input);
    const expected = {
      latitude: 33.812371,
      longitude: -117.920431
    };

    expect(Number(actual.latitude)).toBeCloseTo(expected.latitude, 2);
    expect(Number(actual.longitude)).toBeCloseTo(expected.longitude, 1);
  });
});
