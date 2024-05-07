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
