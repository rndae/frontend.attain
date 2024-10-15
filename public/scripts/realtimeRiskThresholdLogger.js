const basicType = "basic";
const mergeType = "merge";
const divergeType = "diverge";
const expressType = "express";
const weavingType = "weaving";
const rampType = "ramp";
const secondaryType = "secondary";

const timeIntervalInMS = 60000;

const capitalizeFirstLetter = str => str.charAt(0).toUpperCase() + str.slice(1);

async function valuesAboveThresholdFromArray(riskType, predictionArray) {
  const filteredArray = predictionArray.filter(item => item.rank != undefined && item.rank.includes(riskType) && item.type.includes("primary"));
  return filteredArray.length;
}

async function secondaryValues(secondaryType, predictionArray) {
  const filteredArray = predictionArray.filter(item => item.type != undefined && item.type.includes(secondaryType));
  return filteredArray.length;
}


async function updatePrimaryRiskInformation() {
  const realtimeDiagnosticsSource = JSON.parse(document.getElementById('map-key').textContent)['realtimeDiagnosticsAPI'];
  const riskDataArray = await (await fetch(realtimeDiagnosticsSource + '/crashprone')).json();
  const basicAboveThreshold = await valuesAboveThresholdFromArray(basicType, riskDataArray);
  const mergeAboveThreshold = await valuesAboveThresholdFromArray(mergeType, riskDataArray);;
  const divergeAboveThreshold = await valuesAboveThresholdFromArray(divergeType, riskDataArray);
  const expressAboveThreshold = await valuesAboveThresholdFromArray(expressType, riskDataArray);
  const weavingAboveThreshold = await valuesAboveThresholdFromArray(weavingType, riskDataArray);
  const rampAboveThreshold = await valuesAboveThresholdFromArray(rampType, riskDataArray);
  const secondarySegments = await secondaryValues(secondaryType, riskDataArray);
  document.getElementById('basic-realtime-info').textContent = basicAboveThreshold;
  document.getElementById('merge-realtime-info').textContent = mergeAboveThreshold;
  document.getElementById('diverge-realtime-info').textContent = divergeAboveThreshold;
  document.getElementById('express-realtime-info').textContent = expressAboveThreshold;
  document.getElementById('weaving-realtime-info').textContent = weavingAboveThreshold;
  document.getElementById('ramp-realtime-info').textContent = rampAboveThreshold;
  document.getElementById('secondary-realtime-info').textContent = secondarySegments;
  populateSegmentDropdowns(riskDataArray);

  extractTopSegmentsByType(riskDataArray);


}

function extractTopSegmentsByType(dataArray) {
  const result = {};
  dataArray.forEach(item => {
    if (item.rank){
      const rankType = item.rank.split('_')[1]; // Extract the type from the rank (e.g., "basic", "ramp")
      if (item.rank.startsWith("1_") && !result[rankType]) {
        result[rankType] = item;
      }
    }
  });


  for (let i = 0; i < Object.keys(result).length; i++) {
    const canvasId = `Chart${i + 1}`; // Chart1, Chart2, ..., Chart6
    const ctx = document.getElementById(canvasId).getContext('2d');
    const segmentType = Object.keys(result)[i]; // e.g., "basic", "merge", etc.
    const segment = result[segmentType]; // Get the corresponding segment data
    const segmentName = segment.segment_name
    displayTwoScoresBarChart(ctx, canvasId, segmentType,segmentName, segment);
  }



  return result;
}

let segmentChart = null; // Declare and initialize the chart variable

function displayTwoScoresBarChart(ctx, canvasID, segmentType, segmentName, segment) {
  
  // Prepare data for the chart
  const labels = ["Risk Score", "Severity Score"]; // Labels for the bars
  const scores = [segment.score, segment.severity_score]; // Two scores for the bars

  let chartStatus = Chart.getChart(canvasID); // <canvas> id
  if (chartStatus != undefined) {
    chartStatus.destroy();
  }
  // Create the horizontal bar chart
  const segmentChart = new Chart(ctx, {
      type: 'bar',
      data: {
          labels: labels, // y-axis labels (Risk Score and Severity Score)
          datasets: [{
              label: 'Scores', // Label for the dataset
              data: scores, // Scores for the bars
              backgroundColor: ['rgba(75, 192, 192, 0.2)', 'rgba(255, 99, 132, 0.2)'],
              borderColor: ['rgba(75, 192, 192, 1)', 'rgba(255, 99, 132, 1)'],
              borderWidth: 1,
              barThickness: 10, // Controls bar thickness
              categoryPercentage: 0.1, // Controls the gap between bars within a category
              barPercentage: 0.6, // Adjusts individual bar width within a category
          }]
      },
      options: {
          indexAxis: 'y', // Horizontal bars
          responsive: true,
          scales: {
              x: {
                  beginAtZero: true, // Ensure the x-axis starts at zero
                  min: 0, // Set the minimum value to 0
                  max: 1, // Set the maximum value to 1
                  ticks: {
                    color: 'rgba(255, 255, 255, 0.8)', // Set y-axis label color
                  },
                  grid: {
                    display: true, // Show gridlines on y-axis
                    color: 'rgba(200, 200, 200, 0.4)', // Set the gridline color
                    lineWidth: 1, // Set the gridline thickness
                  }
              },
              y:{
                ticks: {
                  color: 'rgba(255, 255, 255, 0.8)', // Set y-axis label color
                },
                grid: {
                  display: true, // Show gridlines on y-axis
                  color: 'rgba(200, 200, 200, 0.4)', // Set the gridline color
                  lineWidth: 1, // Set the gridline thickness
                }
              }
          },
          plugins: {
              title: {
                  display: true,
                  text: 'Top '+capitalizeFirstLetter(segmentType)+' Segment: '+segmentName,
                  color: "white",
                  font: {
                    color: 'rgba(44, 44, 44, 1)' // Change title color here
                }
              },
              legend: {
                  display: false // Hides the legend
              }
          }
      }
  });
}


let segmentInterval = null; // Global variable to store the interval

function populateSegmentDropdowns(riskDataArray) {
  const segmentTypes = [basicType, mergeType, divergeType, expressType, weavingType, rampType, secondaryType];
  let allSegments = [];

  // Create dropdowns and store all segments in an array
  segmentTypes.forEach(type => {
    const dropdownMenu = document.getElementById(`${type.toLowerCase()}-segments-list`);
    dropdownMenu.innerHTML = '';
    const filteredArray = riskDataArray.filter(item => item.rank !== undefined && item.rank.includes(type) || (item.type !== undefined && item.type.includes(type)));
    
    filteredArray.forEach(segment => {
      const segmentId = segment.segment_id;
      const dropdownItem = document.createElement('a');
      dropdownItem.className = 'dropdown-item';
      dropdownItem.href = '#';
      dropdownItem.textContent = segment.segment_name;
      dropdownItem.addEventListener('click', () => {
        if (drawnSegments[segmentId]) {
          triggerSegmentClick(segmentId);
        }
      });
      dropdownMenu.appendChild(dropdownItem);
      allSegments.push(segmentId); // Store segmentId for automatic rotation
    });
  });

    // Clear any previous interval before setting a new one
    if (segmentInterval) {
      clearInterval(segmentInterval);
    }
  
  //Automatically cycle through segments every 5 seconds
  let currentIndex = 0;
  segmentInterval = setInterval(() => {
    if (allSegments.length > 0) {
      const currentSegmentId = allSegments[currentIndex];
      triggerSegmentClick(currentSegmentId); // Trigger click programmatically
      currentIndex = (currentIndex + 1) % allSegments.length; // Move to the next segment, loop back if needed
    }
  }, 5000); // 5000 ms = 5 seconds
}

function triggerSegmentClick(segmentId) {
  console.log('triggerSegmentClick');
  const segmentPolyline = drawnSegments[segmentId];
  if (segmentPolyline) {
    const latLng = segmentPolyline.getPath().getAt(0);
    const event = {
      latLng: latLng
    };
    google.maps.event.trigger(segmentPolyline, 'click', event);
  }
}

// Function to render the bar chart
function renderBarChart(labels, data) {
  const ctx = document.getElementById('riskBarChart').getContext('2d');
  
  // If the chart already exists, destroy it before creating a new one
  if (window.myBarChart) {
    window.myBarChart.destroy();
  }

  window.myBarChart = new Chart(ctx, {
    type: 'bar',
    data: {
      
      labels: labels.map(label => label.slice(0, -3)),
      datasets: [{
        label: 'Risk Scores',
        data: data,
        backgroundColor: 'rgba(255, 99, 132, 0.2)',
        borderColor: 'rgba(255, 99, 132, 1)',
        borderWidth: 1,
        barThickness: 0.5
      }]
    },
    options: {
      indexAxis: 'y',  // Horizontal bar chart
      scales: {
        x: {
          beginAtZero: true
        },
        y: {
          beginAtZero: true,
          ticks: {
            clip: false
          }
        }
      },
    }
  });
}


updatePrimaryRiskInformation();
setInterval(updatePrimaryRiskInformation, timeIntervalInMS);
