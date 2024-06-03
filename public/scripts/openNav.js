function openNav() {
  document.getElementById("rightSidebar").style.width = "250px";
  setTimeout(function() {
      document.dispatchEvent(new Event('drawCharts'));
  }, 500);
}