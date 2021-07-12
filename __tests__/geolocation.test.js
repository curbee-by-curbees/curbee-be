import { isWithinRadius } from '../lib/utils/geolocation.js';

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
