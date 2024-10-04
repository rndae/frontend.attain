const { initialize, Map, mockInstances } = require('@googlemaps/jest-mocks');
const dotenv = require('dotenv');
const { drawnSegments, setSegmentsOnMap, coloRiskSegmentsOnMap, colorRiskSegmentsRedrawn } = require('../public/scripts/polylineDrawer');

dotenv.config();

jest.mock('../public/scripts/polylineDrawer', () => ({
  setSegmentsOnMap: jest.fn(() => Promise.resolve()),
  colorRiskSegmentsRedrawn: jest.fn(),
  coloRiskSegmentsOnMap: jest.fn((map) => {
    return new Promise((resolve) => {
      resolve();
    });
  })
}));

describe('google maps Init and polyline draw', () => {
  beforeEach(() => {
    initialize();
  });

  it('load Google Map and call setSegmentsOnMap and coloRiskSegmentsOnMap', async () => {
    document.body.innerHTML = `
      <div id="map"></div>
    `;

    const map = new google.maps.Map(document.getElementById('map'), {
      zoom: 8,
      center: { lat: 28.5383, lng: -81.3792 }
    });

    await setSegmentsOnMap(map);
    await coloRiskSegmentsOnMap(map);

    const mapMocks = mockInstances.get(Map);

    expect(mapMocks).toHaveLength(1);
    expect(setSegmentsOnMap).toHaveBeenCalledWith(map);
    expect(coloRiskSegmentsOnMap).toHaveBeenCalledWith(map);
  });

  it('calls colorRiskSegmentsRedrawn with the correct arguments', async () => {
    document.body.innerHTML = `
      <div id="map"></div>
    `;

    const map = new google.maps.Map(document.getElementById('map'), {
      zoom: 8,
      center: { lat: 28.5383, lng: -81.3792 }
    });

    const segmentMaxRiskDict = {
      '1041002': { risk: 1, cameras: [], score: 0.5 },
      '1041006': { risk: 2, cameras: [], score: 0.7 }
    };

    await colorRiskSegmentsRedrawn(segmentMaxRiskDict, map);

    expect(colorRiskSegmentsRedrawn).toHaveBeenCalledWith(segmentMaxRiskDict, map);
  });

  it('should update segment colors from red to green when their status changes', async () => {
    document.body.innerHTML = `
      <div id="map"></div>
    `;

    const map = new google.maps.Map(document.getElementById('map'), {
      zoom: 8,
      center: { lat: 28.5383, lng: -81.3792 }
    });

    drawnSegments['1041002'] = new google.maps.Polyline({
      path: [
        { lat: 28.46671295, lng: -81.46363068 },
        { lat: 28.46959305, lng: -81.46026611 }
      ],
      strokeColor: '#FF0000',
      strokeWeight: 4,
      map: map
    });

    const initialSegmentMaxRiskDict = {
      '1041002': { risk: 0.9, cameras: [], score: 0.5 }
    };

    const updatedSegmentMaxRiskDict = {
      '1041002': { risk: 0.2, cameras: [], score: 0.5 }
    };

    await colorRiskSegmentsRedrawn(initialSegmentMaxRiskDict, map);

    expect(colorRiskSegmentsRedrawn).toHaveBeenCalledWith(initialSegmentMaxRiskDict, map);
    expect(drawnSegments['1041002'].strokeColor).toBe('#FF0000');

    await colorRiskSegmentsRedrawn(updatedSegmentMaxRiskDict, map);

    expect(colorRiskSegmentsRedrawn).toHaveBeenCalledWith(updatedSegmentMaxRiskDict, map);
    expect(drawnSegments['1041002'].strokeColor).toBe('#00FF00');
  });
});
