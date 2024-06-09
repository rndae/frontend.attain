function updateCharts(chart, newData, chartId) {
    if (chart) {
        if (chartId == "speedChart") {
            chart.data.datasets[0].data = newData.map(item => item.speed);
        } else if (chartId == "riskChart") {
            chart.data.datasets[0].data = newData.map(item => item.Total_Prediction);
        } else if (chartId == "volumeChart") {
            chart.data.datasets[0].data = newData.map(item => item.volume > 0 ? item.volume : 0);
            chart.data.datasets[1].data = newData.map(item => item.volume < 0 ? -item.volume : 0);
        }

        chart.data.labels = newData.map(item => item.time);
        chart.update();
    }
}