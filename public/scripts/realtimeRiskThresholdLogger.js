const basicRiskThreshold1=0.276
const basicRiskThreshold2=0.11
const basicSevereRiskThreshold1=0.00341905865030657
const basicSevereRiskThreshold2=0.0000959943908851817
const weavingRiskThreshold1=0.067
const weavingRiskThreshold2=0.005
const weavingSevereRiskThreshold1=0.00223284519047619
const weavingSevereRiskThreshold2=0.000166630238095238
const rampRiskThreshold1=0.005
const rampRiskThreshold2=0.002
const rampSevereRiskThreshold1=0.0001403616167698182
const rampSevereRiskThreshold2=0.0000701808083849091

async function valuesAboveThreshold(predictionPoints, threshold) {
  return predictionPoints.filter(point => point.Total_Prediction > threshold).length;
}

async function updatePrimaryRiskInformation() {
  const realtimeDiagnosticsSource = JSON.parse(document.getElementById('map-key').textContent)['realtimeDiagnosticsAPI'];
  const basicRiskData = await (await fetch(realtimeDiagnosticsSource + '/basic/getData/999')).json();
  const rampRiskData = await (await fetch(realtimeDiagnosticsSource + '/ramp/getData/999')).json();
  const weavingRiskData = await (await fetch(realtimeDiagnosticsSource + '/weaving/getData/999')).json();

  const basicAboveThreshold = await valuesAboveThreshold(basicRiskData, basicRiskThreshold1);
  const weavingAboveThreshold = await valuesAboveThreshold(weavingRiskData, weavingRiskThreshold1);
  const rampAboveThreshold = await valuesAboveThreshold(rampRiskData, rampRiskThreshold1);

  const totalSevereAboveThreshold = await valuesAboveThreshold(basicRiskData, basicSevereRiskThreshold1)
    + await valuesAboveThreshold(weavingRiskData, weavingSevereRiskThreshold1)
    + await valuesAboveThreshold(rampRiskData, rampSevereRiskThreshold1);

  document.getElementById('basic-realtime-info').textContent = basicAboveThreshold;
  document.getElementById('weaving-realtime-info').textContent = weavingAboveThreshold;
  document.getElementById('ramp-realtime-info').textContent = rampAboveThreshold;
  document.getElementById('severe-realtime-info').textContent = totalSevereAboveThreshold;
}

updatePrimaryRiskInformation();
