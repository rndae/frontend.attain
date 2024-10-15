export function addCameraMarkers(segmentMaxRiskDict, map) {
  let cameraMarkers = {};

  Object.keys(segmentMaxRiskDict).forEach(segmentId => {
    const cameras = segmentMaxRiskDict[segmentId].cameras;

    if (cameras) {
      cameraMarkers[segmentId] = [];
      cameras.forEach(camera => {
        const cameraPosition = new google.maps.LatLng(camera.latitude, camera.longitude);
        const marker = new google.maps.Marker({
          latitude: camera.latitude, 
          longitude: camera.longitude,
          position: cameraPosition,
          map: null,
          icon: '/images/old-camera.jpg',
          title: camera.camera_name
        });
        cameraMarkers[segmentId].push(marker);
      });
    }
  });

  return cameraMarkers;
}

export function clearCameraMarkers(cameraMarkers) {
  Object.keys(cameraMarkers).forEach(segmentId => {
    cameraMarkers[segmentId].forEach(marker => {
      marker.setMap(null);
    });
  });
}
