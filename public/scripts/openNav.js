function openNav(segmentId) {
  document.getElementById("rightSidebar").style.width = "250px";
  document.getElementById("rightSidebar").style.display = 'block';
  setTimeout(function() {
      var drawChartEvent = new CustomEvent('drawCharts', { detail: { segmentId: segmentId } });
      document.dispatchEvent(drawChartEvent);
  }, 500);
}

