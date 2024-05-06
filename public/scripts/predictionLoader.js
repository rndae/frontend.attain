// Array to store references to drawn polylines
let drawnPolylines = [];

export function fetchDataAndDrawPolyline(map) {
    const mapApiKey = JSON.parse(document.getElementById('map-key').textContent);

    fetch(mapApiKey['crashRiskAPI'])
      .then(response => response.json())
      .then(data => {
        // Load and parse JSON file
        fetch('data/base_map_final+pointinfo.json')
          .then(response => response.json())
          .then(jsonData => {
            // Remove older polylines if the array is not empty
            if (drawnPolylines.length > 0) {
              drawnPolylines.forEach(polyline => {
                polyline.setMap(null); // Remove polyline from map
              });
              // Clear the array
              drawnPolylines = [];
            }
  
            data.forEach(apiItem => {
              const coordinates = jsonData[apiItem.id];
              if (coordinates) {
                const polyline = drawPolyline(coordinates, apiItem.Total_Prediction, map);
                drawnPolylines.push(polyline); // Store reference to drawn polyline
              } else {
                console.log(`No data found for ID: ${apiItem.id}`);
              }
            });
          })
          .catch(error => {
            console.error('Error parsing JSON file:', error);
          });
      })
      .catch(error => {
        console.error('Error fetching data from API:', error);
      });
  }


function drawPolyline(coordinates, totalPrediction, map) {
  let strokeColor;
  let strokeWeight = 2; // Default stroke weight

  if (totalPrediction <= 0.7) {
    strokeColor = '#00FF00'; // Green 
  } else {
    strokeColor = '#FF0000'; // Red 
    strokeWeight = 4; // Thicker stroke weight for red polylines
  }

  const flightPath = new google.maps.Polyline({
    path: [
      { lat: coordinates.y_start, lng: coordinates.x_start },
      { lat: coordinates.y_mid, lng: coordinates.x_mid },
      { lat: coordinates.y_end, lng: coordinates.x_end }
    ],
    geodesic: true,
    strokeColor: strokeColor,
    strokeOpacity: 1.0,
    strokeWeight: strokeWeight, // Set stroke weight based on color
  });

  flightPath.setMap(map);

  return flightPath; // Return reference to drawn polyline
}