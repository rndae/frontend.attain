function updateCharts(chartId, newData) {
    newData = newData.slice(10, 15);
    if (chartId === "speedChart") {
        speedChart.data.datasets[0].data = newData.map(item => item.speed > 0 ? item.speed : 0);
        speedChart.data.labels = newData.map(item => item.time);
        speedChart.update();
    } else if (chartId === "riskChart") {
        riskChart.data.datasets[0].data = newData.map(item => item.crash_risk);
        riskChart.data.labels = newData.map(item => item.time);
        riskChart.update();
    } else if (chartId === "volumeChart") {
        console.log(newData);
        volumeChart.data.datasets[0].data = newData.map(item => item.upstream_volume > 0 ? item.upstream_volume : 0);
        volumeChart.data.datasets[1].data = newData.map(item => item.volume > 0 ? item.volume : 0);
        volumeChart.data.datasets[2].data = newData.map(item => item.downstream_volume > 0 ? item.downstream_volume : 0);
        volumeChart.data.labels = newData.map(item => item.time);
        volumeChart.update();
    } else if (chartId === "stdChart") {
        stdChart.data.datasets[0].data = newData.map(item => item.speed_std > 0 ? item.speed_std : 0);
        stdChart.data.labels = newData.map(item => item.time);
        stdChart.update();
    } else if (chartId === "severityChart") {
        severityChart.data.datasets[0].data = newData.map(item => item.severity_score);
        severityChart.data.labels = newData.map(item => item.time);
        severityChart.update();
    }
}
