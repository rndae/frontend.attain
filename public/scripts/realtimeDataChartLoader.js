const realtimeDiagnosticsSource = JSON.parse(document.getElementById('map-key').textContent)['realtimeDiagnosticsAPI'];

generateChart('basicChart', realtimeDiagnosticsSource + '/basic/getData', 3);
generateChart('rampChart', realtimeDiagnosticsSource + '/ramp/getData', 3);
generateChart('weavingChart', realtimeDiagnosticsSource + '/weaving/getData', 3);