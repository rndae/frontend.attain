let drawnSegments = {};
const riskColor= '#FF0000';
const noRiskColor = '#00FF00';
const riskPredictionNotFoundColor = "#D8D8D8";

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

export function coloRiskSegmentsOnMap() {
  getCrashRiskDataArray().then(arrayCrashRiskData => {
    let segmentMaxRiskDict = getSegmentMaxRiskDict(arrayCrashRiskData);
    if (!segmentMaxRiskDict)
      segmentMaxRiskDict = fakeFillMaxPred();
    colorRiskSegments(segmentMaxRiskDict);
  })
  .catch(error => {
    console.error('Error fetching crash risk data: ', error);
  });;
}

function fakeFillMaxPred(){
  let segmentMaxRiskDict = {};
  Object.keys(drawnSegments).forEach(segmentId => {
    segmentMaxRiskDict[segmentId] = Math.random();
  }); 
  return segmentMaxRiskDict;
}

function drawMapSegments(segmentData, map) {
  Object.values(segmentData).forEach(segment => {
    let strokeColor = noRiskColor;
    let strokeWeight = 2;
    let strokeOpacity = 0.44;

    const segmentPolyline = new google.maps.Polyline({
        path: [
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
        ],
        geodesic: true,
        strokeColor: strokeColor,
        strokeOpacity: strokeOpacity,
        strokeWeight: strokeWeight,
    });

    segmentPolyline.setMap(map);
    const segmentId = segment.All_ID;
    drawnSegments[segmentId] = segmentPolyline;
    
    google.maps.event.addListener(segmentPolyline, 'click', function(event) {
      showSegmentInfoPopup(segmentId, event.latLng.lat(), event.latLng.lng(), map);
      openNav(segmentId);
      zoomToSegment(segment, map);
    });
  });
}

function colorRiskSegments(segmentMaxRiskDict){
  let count = 0;
  Object.keys(segmentMaxRiskDict).forEach(segmentId => {
    if (isNaN(segmentMaxRiskDict[segmentId]) || segmentMaxRiskDict[segmentId] < 0) {
      drawnSegments[segmentId].strokeColor = riskPredictionNotFoundColor;
    } else if (segmentMaxRiskDict[segmentId] > 0.8) {
      drawnSegments[segmentId].strokeColor = riskColor;
      drawnSegments[segmentId].strokeWeight = 4;
    } else {
      drawnSegments[segmentId].strokeColor = noRiskColor;
    }
    count++;
  });
}

async function getCrashRiskDataArray() {
  try {
    const mapApiKeys = JSON.parse(document.getElementById('map-key').textContent);
    const crashRiskPromises = [
      'crashRiskAPIBasic',
      'crashRiskAPIMerge',
      'crashRiskAPIDiverge',
      'crashRiskAPIRamp',
      'crashRiskAPISpecific',
      'crashRiskAPIWeaving'
    ].map(apiKey => {
      const apiUrl = mapApiKeys[apiKey];
      if (apiUrl) {
        return fetch(apiUrl)
          .then(response => response.json())
          .catch(error => {
            console.error(`Error fetching data from "${apiUrl}":`, error);
            return null; 
          });
      } else {
        console.error(`No URL provided for "${apiKey}".`);
        return null;
      }
    });
    return crashRiskPromises;
  }
  catch (error) {
    console.error("There is no access to crash risk routes " + error);
    return null;
  }
}


function getSegmentMaxRiskDict(arrayCrashRiskData) {
  try {
    let segmentMaxRiskDict = {};
    if (arrayCrashRiskData) {
      arrayCrashRiskData.forEach(crashRiskDataSet => {
        if (crashRiskDataSet) {
          crashRiskDataSet.forEach(crashRiskDataPoint => {
            if(!segmentMaxRiskDict[crashRiskDataPoint.id]) {
              segmentMaxRiskDict[crashRiskDataPoint.id] = -1;
            }
            if (crashRiskDataPoint.Total_Prediction > segmentMaxRiskDict[crashRiskDataPoint.id]) {
              segmentMaxRiskDict[crashRiskDataPoint.id] = crashRiskEntry.Total_Prediction;
            }
          }); 
        }
      });
    }
    return segmentMaxRiskDict;
  } catch (error) {
    console.error("Not able to iterate over non-found objects: " + error);
    return null;
  }
}


let currentInfoWindow = null;
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
