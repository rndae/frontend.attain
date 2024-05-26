function generateChart(chartName, httpSourcePath, dataPoints = 3) {
  fetch(httpSourcePath + "/" + dataPoints)
    .then(response => response.json())
    .then(data => {
      const labels = data.map(point => point.id);
      const predictions = data.map(point => point.Total_Prediction);
      const ctx = document.getElementById(chartName).getContext('2d');
      new Chart(ctx, {
        type: 'bar',
        data: {
          labels: labels,
          datasets: [{
            label: 'Total Prediction',
            data: predictions,
            backgroundColor: 'rgba(54, 162, 235, 0.2)',
            borderColor: 'rgba(54, 162, 235, 1)',
            borderWidth: 2,
          }]
        },
        options: {
          indexAxis: 'y',
          elements: {
            bar: {
              borderWidth: 2,
            }
          },
          responsive: true,
        }
      });
    })
    .catch(error => console.error('Error fetching data:', error));
}
