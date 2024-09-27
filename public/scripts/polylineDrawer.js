import { addCameraMarkers, clearCameraMarkers } from './cameraModule.js';

export let drawnSegments = {};
let segmentPaths = {};
let cameraMarkers = {};
const riskColor = '#FF0000';
const noRiskColor = '#00FF00';
const riskPredictionNotFoundColor = "#D8D8D8";
let currentInfoWindow = null;
let circles = [];

export async function setSegmentsOnMap(map) {
  await fetch('data/base_map_final+pointinfo.json')
    .then(response => response.json())
    .then(segmentDataSet => {
      if (Object.keys(drawnSegments).length === 0)
        drawMapSegments(segmentDataSet, map);
    })
    .catch(error => {
      console.error('Error fetching segment data:', error);
    });
}

export function coloRiskSegmentsOnMap(map) {
  getSegmentMaxRiskDictSimpleFormat().then(segmentMaxRiskDict => {
    if (!segmentMaxRiskDict)
      segmentMaxRiskDict = fakeFillMaxPred();
    colorRiskSegmentsRedrawn(segmentMaxRiskDict, map);
  })
  .catch(error => {
    console.error('Error fetching crash risk data: ', error);
  });
}

async function getSegmentMaxRiskDictSimpleFormat() {
  try {
    const realtimeDiagnosticsSource = JSON.parse(document.getElementById('map-key').textContent)['realtimeDiagnosticsAPI'];
    const riskDataArray = await (await fetch(realtimeDiagnosticsSource + '/crashprone')).json();
    let segmentMaxRiskDict = {};
    riskDataArray.forEach(segment => {
      segmentMaxRiskDict[segment.segment_id] = {
        risk: 1, 
        cameras: segment.cameras,
        score: segment.score
      };
      // keeping track of scores by segment path
      segmentPaths[segment.segment_id]['score'] = segment.score;
    });
    return segmentMaxRiskDict;
  }
  catch (error) {
    console.error("There is no access to /crashprone route " + error);
    return null;
  }
}

function fakeFillMaxPred() {
  let segmentMaxRiskDict = {};
  Object.keys(drawnSegments).forEach(segmentId => {
    segmentMaxRiskDict[segmentId] = {
      risk: Math.random(),
      cameras: [],
      score: Math.random()
    };
  });
  return segmentMaxRiskDict;
}


function drawMapSegments(segmentData, map) {
  Object.values(segmentData).forEach(segment => {
    const strokeColor = noRiskColor;
    const strokeWeight = 2;
    const strokeOpacity = 0.44;
    const segmentPath = [
      { lat: segment.y_0, lng: segment.x_0 },
      { lat: segment.y_1, lng: segment.x_1 },
      { lat: segment.y_2, lng: segment.x_2 },
      { lat: segment.y_3, lng: segment.x_3 },
      { lat: segment.y_4, lng: segment.x_4 },
      { lat: segment.y_5, lng: segment.x_5 },
      { lat: segment.y_6, lng: segment.x_6 },
      { lat: segment.y_7, lng: segment.x_7 },
      { lat: segment.y_8, lng: segment.x_8 },
      { lat: segment.y_9, lng: segment.x_9 },
      { lat: segment.y_10, lng: segment.x_10 },
      { lat: segment.y_11, lng: segment.x_11 },
      { lat: segment.y_12, lng: segment.x_12 },
      { lat: segment.y_13, lng: segment.x_13 },
      { lat: segment.y_14, lng: segment.x_14 },
      { lat: segment.y_15, lng: segment.x_15 },
      { lat: segment.y_16, lng: segment.x_16 },
      { lat: segment.y_17, lng: segment.x_17 },
      { lat: segment.y_18, lng: segment.x_18 },
      { lat: segment.y_19, lng: segment.x_19 },
      { lat: segment.y_20, lng: segment.x_20 }
    ];

    const segmentPolyline = new google.maps.Polyline({
      path: segmentPath,
      geodesic: true,
      strokeColor: strokeColor,
      strokeOpacity: strokeOpacity,
      strokeWeight: strokeWeight,
    });

    segmentPolyline.setMap(map);
    const segmentId = segment.All_ID;

    segmentPaths[segmentId] = segmentPath;

    drawnSegments[segmentId] = segmentPolyline;

    google.maps.event.addListener(segmentPolyline, 'click', function (event) {
      const latLng = event ? event.latLng : this.getPath().getAt(0);
      showSegmentInfoPopup(segmentId, latLng.lat(), latLng.lng(), map);
      openNav(segmentId);
      zoomToSegment(segment, map);
    });
  });
}

function colorRiskSegments(segmentMaxRiskDict) {
  let count = 0;
  Object.keys(segmentMaxRiskDict).forEach(segmentId => {
    if (isNaN(segmentMaxRiskDict[segmentId]) || segmentMaxRiskDict[segmentId] < 0) {
      drawnSegments[segmentId].strokeColor = riskPredictionNotFoundColor;
    } else if (segmentMaxRiskDict[segmentId] > 0.8) {
      drawnSegments[segmentId].strokeWeight = 4;
      drawnSegments[segmentId].strokeColor = riskColor;
    } else {
      drawnSegments[segmentId].strokeColor = noRiskColor;
    }
    count++;
  });
}

function colorRiskSegmentsRedrawn(segmentMaxRiskDict, map) {
  clearCameraMarkers(cameraMarkers);
  circles.forEach(circle => circle.setMap(null));
  circles = [];

  Object.keys(segmentMaxRiskDict).forEach(segmentId => {
    drawnSegments[segmentId].setMap(null);
  });

  Object.keys(segmentMaxRiskDict).forEach(segmentId => {
    let strokeColor;
    let strokeWeight = 2;
    if (isNaN(segmentMaxRiskDict[segmentId].risk) || segmentMaxRiskDict[segmentId].risk < 0) {
      strokeColor = riskPredictionNotFoundColor;
    } else if (segmentMaxRiskDict[segmentId].risk > 0.8) {
      strokeColor = riskColor;
      strokeWeight = 4;
    } else {
      strokeColor = noRiskColor;
    }

    drawnSegments[segmentId] = new google.maps.Polyline({
      path: segmentPaths[segmentId],
      strokeColor: strokeColor,
      strokeWeight: strokeWeight,
      map: map
    });

    google.maps.event.addListener(drawnSegments[segmentId], 'click', function (event) {
      const latLng = event ? event.latLng : this.getPath().getAt(0);
      showSegmentInfoPopup(segmentId, latLng.lat(), latLng.lng(), map);
      openNav(segmentId);
      zoomToSegmentById(segmentId, map);
    });

    cameraMarkers = addCameraMarkers(segmentMaxRiskDict, map);
  });
}

function showSegmentInfoPopup(segmentId, latitude, longitude, map) {
  if (currentInfoWindow) {
    currentInfoWindow.close();
  }
  const infoWindow = new google.maps.InfoWindow({
    content: `<div id="current-segment-id">${segmentId}</div><div>Latitude: ${latitude}</div><div>Longitude: ${longitude}</div>`
  });
  infoWindow.setPosition({ lat: latitude, lng: longitude });
  infoWindow.open(map);
  currentInfoWindow = infoWindow;
}

function zoomToSegment(segment, map) {
  const bounds = new google.maps.LatLngBounds();
  for (let i = 0; i <= 20; i++) {
    const pointKeyLat = `y_${i}`;
    const pointKeyLng = `x_${i}`;
    if (segment[pointKeyLat] !== undefined && segment[pointKeyLng] !== undefined) {
      bounds.extend(new google.maps.LatLng(segment[pointKeyLat], segment[pointKeyLng]));
    }
  }
  
  map.fitBounds(bounds);
}
function zoomToSegmentById(segmentId, map) {
  const bounds = new google.maps.LatLngBounds();
  const segmentPath = segmentPaths[segmentId];
  clearCameraMarkers(cameraMarkers);

  if (segmentPath) {
    segmentPath.forEach(point => {
      bounds.extend(new google.maps.LatLng(point.lat, point.lng));
    });

    const cameras = cameraMarkers[segmentId];
    if (cameras) {
      cameras.forEach(camera => {
        bounds.extend(new google.maps.LatLng(camera.latitude, camera.longitude));
        camera.setMap(map);
      });
    }

    const center = bounds.getCenter();

    let maxDistance = 0;

    segmentPath.forEach(point => {
      const distance = google.maps.geometry.spherical.computeDistanceBetween(center, new google.maps.LatLng(point.lat, point.lng));
      if (distance > maxDistance) {
        maxDistance = distance;
      }
    });

    if (cameras) {
      cameras.forEach(camera => {
        const distance = google.maps.geometry.spherical.computeDistanceBetween(center, new google.maps.LatLng(camera.latitude, camera.longitude));
        if (distance > maxDistance) {
          maxDistance = distance;
        }
      });
    }

    const extendedBounds = new google.maps.LatLngBounds(
      google.maps.geometry.spherical.computeOffset(center, maxDistance + 200, 0),
      google.maps.geometry.spherical.computeOffset(center, maxDistance + 200, 180)
    );

    circles.forEach(circle => circle.setMap(null));
    circles = [];

    const circle = new google.maps.Circle({
      center: center,
      radius: maxDistance + 200,
      map: map,
      fillColor: '#FF0000',
      fillOpacity: 0.1,
      strokeColor: '#FF0000',
      strokeOpacity: 0.2,
      strokeWeight: 2
    });
    circles.push(circle);
    

    map.fitBounds(extendedBounds);
  } else {
    console.error(`Segment path not found for segment ID: ${segmentId}`);
  }
}

window.drawnSegments = drawnSegments;
