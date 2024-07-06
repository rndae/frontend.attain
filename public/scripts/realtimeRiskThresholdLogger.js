const basicType = "Basic";
const mergeType = "Merge";
const divergeType = "Diverge";
const expressType = "Express";
const weavingType = "Weaving";
const rampType = "Ramp";

const timeIntervalInMS = 60000;

async function valuesAboveThresholdFromArray(riskType, predictionArray) {
  const filteredArray = predictionArray.filter(item => item.rank.includes(riskType));
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

  document.getElementById('basic-realtime-info').textContent = basicAboveThreshold;
  document.getElementById('merge-realtime-info').textContent = mergeAboveThreshold;
  document.getElementById('diverge-realtime-info').textContent = divergeAboveThreshold;
  document.getElementById('express-realtime-info').textContent = expressAboveThreshold;
  document.getElementById('weaving-realtime-info').textContent = weavingAboveThreshold;
  document.getElementById('ramp-realtime-info').textContent = rampAboveThreshold;
  populateSegmentDropdowns(riskDataArray);
}

function populateSegmentDropdowns(riskDataArray) {
  const segmentTypes = [basicType, mergeType, divergeType, expressType, weavingType, rampType];
  segmentTypes.forEach(type => {
    const dropdownMenu = document.getElementById(`${type.toLowerCase()}-segments-list`);
    dropdownMenu.innerHTML = ''; 
    const filteredArray = riskDataArray.filter(item => item.rank.includes(type));
    filteredArray.forEach(segment => {
      const segmentId = segment.segment_id;
      const dropdownItem = document.createElement('a');
      dropdownItem.className = 'dropdown-item';
      dropdownItem.href = '#';
      dropdownItem.textContent = segmentId;
      dropdownItem.addEventListener('click', () => {
        if (drawnSegments[segmentId]) {
          triggerSegmentClick(segmentId);
        }
      });
      dropdownMenu.appendChild(dropdownItem);
    });
  });
}

function triggerSegmentClick(segmentId) {
  const segmentPolyline = drawnSegments[segmentId];
  if (segmentPolyline) {
    const latLng = segmentPolyline.getPath().getAt(0);
    const event = {
      latLng: latLng
    };
    google.maps.event.trigger(segmentPolyline, 'click', event);
  }
}



updatePrimaryRiskInformation();
setInterval(updatePrimaryRiskInformation, timeIntervalInMS);
