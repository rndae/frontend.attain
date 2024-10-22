export function clearWarningMarkers(segmentMarkers) {
  Object.keys(segmentMarkers).forEach(segmentId => {
        segmentMarkers[segmentId].forEach(marker => {
            marker.setMap(null); // Remove marker from the map
        });
        segmentMarkers[segmentId] = []; // Clear the array after removing markers
    });
}
