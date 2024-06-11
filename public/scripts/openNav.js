function openNav(segmentId) {
  document.getElementById("rightSidebar").style.width = "250px";
  setTimeout(function() {
      var drawChartEvent = new CustomEvent('drawCharts', { detail: { segmentId: segmentId } });
      document.dispatchEvent(drawChartEvent);
  }, 500);
}

