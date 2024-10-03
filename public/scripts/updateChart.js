function updateCharts(chartId, newData) {

    newData = newData.slice(0, 5);

    if (chartId === "speedChart") {
        speedChart.data.datasets[0].data = newData.map(item => item.speed);
        speedChart.data.labels = newData.map(item => item.time);
        speedChart.update();
    } else if (chartId === "riskChart") {
        riskChart.data.datasets[0].data = newData.map(item => item.crash_risk);
        riskChart.data.labels = newData.map(item => item.time);
        riskChart.update();
    } else if (chartId === "volumeChart") {
        console.log(newData);
        volumeChart.data.datasets[0].data = newData.map(item => item.upstream_volume);
        volumeChart.data.datasets[1].data = newData.map(item => item.volume);
        volumeChart.data.datasets[2].data = newData.map(item => item.downstream_volume);

        volumeChart.data.labels = newData.map(item => item.time);
        volumeChart.update();
    } else if (chartId === "stdChart") {
        stdChart.data.datasets[0].data = newData.map(item => item.speed_std);
        stdChart.data.labels = newData.map(item => item.time);
        stdChart.update();
    }
}
