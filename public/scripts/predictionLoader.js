// Array to store references to drawn polylines
let drawnPolylines = [];

export function fetchDataAndDrawPolyline(map) {
    const mapApiKeys = JSON.parse(document.getElementById('map-key').textContent);

    // Fetch data from each crashRiskAPI URL
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
                    return null; // Return null if there's an error
                });
        } else {
            console.error(`No URL provided for "${apiKey}".`);
            return null;
        }
    });

    // Fetch data from the base_map_final+pointinfo.json
    const jsonDataPromise = fetch('data/base_map_final+pointinfo.json')
        .then(response => response.json())
        .catch(error => {
            console.error('Error fetching data from "data/base_map_final+pointinfo.json":', error);
            return null; // Return null if there's an error
        });

    // Execute all fetch requests concurrently
    Promise.all([...crashRiskPromises, jsonDataPromise])
        .then(results => {
            // Remove any null values from the results
            const validResults = results.filter(result => result !== null);

            // Extract jsonData from the last result
            const jsonData = validResults.pop();


            // Clear previously drawn polylines
            drawnPolylines.forEach(polyline => {
              polyline.setMap(null);
            });
            drawnPolylines = []; // Reset the array

            // Wait for the next animation frame
            requestAnimationFrame(() => {});

            // Process data from crashRiskAPIs
            validResults.forEach(crashRiskData => {
                crashRiskData.forEach(apiItem => {
                    const coordinates = jsonData[apiItem.id];
                    if (coordinates) {
                        const polyline = drawPolyline(coordinates, apiItem.Total_Prediction, map);
                        drawnPolylines.push(polyline); // Store reference to drawn polyline
                    } else {
                        console.log(`No data found for ID: ${apiItem.id}`);
                    }
                });
            });
        })
        .catch(error => {
            console.error('Error fetching data or drawing polylines:', error);
        });
}

function drawPolyline(coordinates, totalPrediction, map) {
    let strokeColor;
    let strokeWeight = 2; // Default stroke weight

    if (totalPrediction <= 0.8) {
        strokeColor = '#00FF00'; // Green 
    } else {
        strokeColor = '#FF0000'; // Red 
        strokeWeight = 4; // Thicker stroke weight for red polylines
    }

    const flightPath = new google.maps.Polyline({
        path: [
            { lat: coordinates.y_0, lng: coordinates.x_0 },
            { lat: coordinates.y_1, lng: coordinates.x_1 },
            { lat: coordinates.y_2, lng: coordinates.x_2 },
            { lat: coordinates.y_3, lng: coordinates.x_3 },
            { lat: coordinates.y_4, lng: coordinates.x_4 },
            { lat: coordinates.y_5, lng: coordinates.x_5 },
            { lat: coordinates.y_6, lng: coordinates.x_6 },
            { lat: coordinates.y_7, lng: coordinates.x_7 },
            { lat: coordinates.y_8, lng: coordinates.x_8 },
            { lat: coordinates.y_9, lng: coordinates.x_9 },
            { lat: coordinates.y_10, lng: coordinates.x_10 },
            { lat: coordinates.y_11, lng: coordinates.x_11 },
            { lat: coordinates.y_12, lng: coordinates.x_12 },
            { lat: coordinates.y_13, lng: coordinates.x_13 },
            { lat: coordinates.y_14, lng: coordinates.x_14 },
            { lat: coordinates.y_15, lng: coordinates.x_15 },
            { lat: coordinates.y_16, lng: coordinates.x_16 },
            { lat: coordinates.y_17, lng: coordinates.x_17 },
            { lat: coordinates.y_18, lng: coordinates.x_18 },
            { lat: coordinates.y_19, lng: coordinates.x_19 },
            { lat: coordinates.y_20, lng: coordinates.x_20 }
        ],
        geodesic: true,
        strokeColor: strokeColor,
        strokeOpacity: 1.0,
        strokeWeight: strokeWeight, // Set stroke weight based on color
    });

    flightPath.setMap(map);

    // Add click event listener to the polyline
    google.maps.event.addListener(flightPath, 'click', function(event) {
        // When the polyline is clicked, fetch data for the clicked segment
        fetchDataForSegment(event.latLng.lat(), event.latLng.lng(), map);
    });

    return flightPath; // Return reference to drawn polyline
}




// Function to fetch data from the API based on the clicked segment
// Rewrite fetchDataForSegment to handle click events on polylines
function fetchDataForSegment(latitude, longitude, map) {
    // Show loading indicator
    document.getElementById('loading-indicator').style.display = 'block';

    // Example: Construct the API URL based on the latitude and longitude
    const apiUrl = `https://api.example.com/data?lat=${latitude}&lng=${longitude}`;

    // Fetch data from the API
    fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            // Process the fetched data
            console.log('Data fetched:', data);
            // Show the fetched data in a popup
            showSegmentInfoPopup(data, latitude, longitude, map);
        })
        .catch(error => {
            console.error('Error fetching data:', error);
            showSegmentInfoPopup('no data', latitude, longitude, map);
        })
        .finally(() => {
            // Hide loading indicator
            document.getElementById('loading-indicator').style.display = 'none';
        });
}


// Function to show segment information in a popup
function showSegmentInfoPopup(segmentInfo, latitude, longitude, map) {
    // Create a new InfoWindow instance
    const infoWindow = new google.maps.InfoWindow({
        content: `<div>Latitude: ${latitude}</div><div>Longitude: ${longitude}</div><div>Segment Info: ${JSON.stringify(segmentInfo)}</div>`
    });

    // Open the InfoWindow at the clicked position
    infoWindow.setPosition({ lat: latitude, lng: longitude });
    infoWindow.open(map);
}

