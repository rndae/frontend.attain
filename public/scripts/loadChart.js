let speedChart;
let volumeChart;
let riskChart;
function drawSpeedChart(type, data) {
    const ctx = document.getElementById('speedChart').getContext('2d');
    const labels = data.map((item, index) => index.toString());
    const speeds = data.map(item => item.speed);

    const chartData = {
        labels: labels,
        datasets: [
            {
                label: 'Speed',
                data: speeds,
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1
            }
        ]
    };

    const chartOptions = {
        scales: {
            x: {
                type: 'category',
                ticks: {
                    maxTicksLimit: 5,
                    callback: function(value, index, ticks) {
                        if (index === ticks.length - 1) {
                            return ticks.length - 1;
                        } else {
                            return index;
                        }
                    }
                }
            },
            y: {
                beginAtZero: true
            }
        }
    };

    if (speedChart) {
        speedChart.destroy();
    }

    speedChart = new Chart(ctx, {
        type: 'line',
        data: chartData,
        options: chartOptions
    });
}

function drawVolumeChart(type, data) {
    const ctx = document.getElementById('volumeChart').getContext('2d');
    const labels = data.map((item, index) => index.toString());
    const upVol = data.map(item => item.volume > 0 ? item.volume : 0);
    const downVol = data.map(item => item.volume < 0 ? -item.volume : 0);

    const chartData = {
        labels: labels,
        datasets: [
            {
                label: 'Up Volumes',
                data: upVol,
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1
            },
            {
                label: 'Down Volumes',
                data: downVol,
                backgroundColor: 'rgba(255, 99, 132, 0.2)',
                borderColor: 'rgba(255, 99, 132, 1)',
                borderWidth: 1
            }
        ]
    };

    const chartOptions = {
        scales: {
            x: {
                type: 'category',
                ticks: {
                    maxTicksLimit: 5,
                    callback: function(value, index, ticks) {
                        if (index === ticks.length - 1) {
                            return ticks.length - 1;
                        } else {
                            return index;
                        }
                    }
                }
            },
            y: {
                beginAtZero: true
            }
        }
    };

    if (volumeChart) {
        volumeChart.destroy();
    }

    volumeChart = new Chart(ctx, {
        type: 'bar',
        data: chartData,
        options: chartOptions
    });
}

function drawRiskChart(type, data) {
    const ctx = document.getElementById('riskChart').getContext('2d');
    const labels = data.map((item, index) => index.toString());
    const speeds = data.map(item => item.Total_Prediction);

    const chartData = {
        labels: labels,
        datasets: [
            {
                label: 'Risk Score',
                data: speeds,
                backgroundColor: 'rgba(255, 0, 1, 0.2)',
                borderColor: 'rgba(255, 0, 1, 1)',
                borderWidth: 1
            }
        ]
    };

    const chartOptions = {
        scales: {
            x: {
                type: 'category',
                ticks: {
                    maxTicksLimit: 5,
                    callback: function(value, index, ticks) {
                        if (index === ticks.length - 1) {
                            return ticks.length - 1;
                        } else {
                            return index;
                        }
                    }
                }
            },
            y: {
                beginAtZero: true
            }
        }
    };

    if (riskChart) {
        riskChart.destroy();
    }

    speedChart = new Chart(ctx, {
        type: 'line',
        data: chartData,
        options: chartOptions
    });
}