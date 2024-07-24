import { DefaultMapSettings } from "./defaultMapSettings.js";
import { setSegmentsOnMap } from "./polylineDrawer.js";
import { coloRiskSegmentsOnMap } from "./polylineDrawer.js";


document.addEventListener('DOMContentLoaded', function () {
  const mapApiKey = JSON.parse(document.getElementById('map-key').textContent);
  var script = document.createElement('script');
  script.src = 'https://maps.googleapis.com/maps/api/js?key=' + mapApiKey['apiKey'] + '&callback=initMap';
  script.async = true;
  window.initMap = function () {
    const map = new google.maps.Map(document.getElementById('map'), DefaultMapSettings);
    setSegmentsOnMap(map)
      .then(()=> {
        coloRiskSegmentsOnMap(map);
      });
    setInterval(function(){coloRiskSegmentsOnMap(map);}, 60000);

  };
  document.head.appendChild(script);
});