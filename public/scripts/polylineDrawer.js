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
    let segmentMaxRiskDict; //= getSegmentMaxRiskDict(arrayCrashRiskData);

    //delete when access to vpn normalizes
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

    google.maps.event.addListener(segmentPolyline, 'click', function(event) {
      showSegmentInfoPopup(segmentId, event.latLng.lat(), event.latLng.lng(), map);
      openNav(segmentId);
    });
    drawnSegments[segmentId] = segmentPolyline;
  });
}

function colorRiskSegments(segmentData){
  Object.keys(segmentData).forEach(segmentId => {
    if(!segmentData[segmentId] || isNaN(segmentData[segmentId]) || segmentData[segmentId] < 0) {
      drawnSegments[segmentId].strokeColor = riskPredictionNotFoundColor;
    } else if (segmentData[segmentId] > 0.8) {
      drawnSegments[segmentId].strokeColor = riskColor;
    } else {
      drawnSegments[segmentId].strokeColor = noRiskColor;
    }
  });
}

async function getCrashRiskDataArray() {
  const mapApiKeys = JSON.parse(document.getElementById('map-key').textContent);

  const results = await Promise.allSettled([
    'crashRiskAPIBasic',
    'crashRiskAPIMerge',
    'crashRiskAPIDiverge',
    'crashRiskAPIRamp',
    'crashRiskAPISpecific',
    'crashRiskAPIWeaving'
  ].map(apiRoute => {
    const apiUrl = mapApiKeys[apiRoute];
    return apiUrl ? fetch(apiUrl).then(response => response.json()) : Promise.resolve(null);
  }));
  return results
    .filter(result_1 => result_1.status === 'fulfilled' && result_1.value !== null)
    .map(result_2 => result_2.value);
}

function getSegmentMaxRiskDict(arrayCrashRiskData) {
  let segmentMaxRiskDict = {};
  arrayCrashRiskData.forEach(crashRiskDataSet => {
    crashRiskDataSet.forEach(crashRiskDataPoint => {
      if(!segmentMaxRiskDict[crashRiskDataPoint.id]) {
        segmentMaxRiskDict[crashRiskDataPoint.id] = -1;
      }
      if (crashRiskDataPoint.Total_Prediction > segmentMaxRiskDict[crashRiskDataPoint.id]) {
        segmentMaxRiskDict[crashRiskDataPoint.id] = crashRiskEntry.Total_Prediction;
      }
    });
  });
  return segmentMaxRiskDict;
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
