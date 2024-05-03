import { parseCSV } from "./parseCsv.js";

export function setSegmentsOnMap(map) {
  fetch('../data/base_map_final+pointinfo.csv')
    .then(response => response.text())
    .then(csvText => {
      const segmentData = parseCSV(csvText);
      console.log(segmentData);
      drawMapSegments(segmentData, map);
    });
}

function drawMapSegments(segmentData, map) {
  segmentData.forEach(segment => {
    const startLat = segment.y_start;
    const startLng = segment.x_start;
    const endLat = segment.y_end;
    const endLng = segment.x_end;
    const midLat = segment.y_mid;
    const midLng = segment.x_mid;


    if (isNaN(startLat) || isNaN(startLng) || isNaN(endLat) || isNaN(endLng) || isNaN(midLat) || isNaN(midLng)) {
      return;
    }

    const startToMidCoordinates = [
      { lat: startLat, lng: startLng },
      { lat: midLat, lng: midLng }
    ];

    const startToMidPolyline = new google.maps.Polyline({
      path: startToMidCoordinates,
      geodesic: true,
      strokeColor: '#32CD32',
      strokeOpacity: 1.0,
      strokeWeight: 2
    });

    startToMidPolyline.setMap(map);

    const midToEndCoordinates = [
      { lat: midLat, lng: midLng },
      { lat: endLat, lng: endLng }
    ];

    const midToEndPolyline = new google.maps.Polyline({
      path: midToEndCoordinates,
      geodesic: true,
      strokeColor: '#3DFC14',
      strokeOpacity: 1.0,
      strokeWeight: 2
    });

    midToEndPolyline.setMap(map);
  });
}