let speedChart;
let volumeChart;
let riskChart;
let stdChart;
function drawSpeedChart(type, data) {
    data = data.slice(0, 5);
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
                title: {
                    display: true,
                    align: 'center',
                    text: 'Speed (MPH)',
                    color: 'white',
                    font: {
                      family: 'Arial',
                      size: 14,
                      weight: 'bold',
                    },
                },
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
                beginAtZero: true,
                title: {
                    display: true,
                    align: 'center',
                    text: 'Time (m)',
                    color: 'white',
                    font: {
                      family: 'Arial',
                      size: 14,
                      weight: 'bold',
                    },
                },
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
function drawStdChart(type, data) {
    data = data.slice(0, 5);
    const ctx = document.getElementById('stdChart').getContext('2d');
    const labels = data.map((item, index) => index.toString());
    const speeds = data.map(item => item.speed);

    const chartData = {
        labels: labels,
        datasets: [
            {
                label: 'Speed_Std',
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
                title: {
                    display: true,
                    align: 'center',
                    text: 'Speed_Std (MPH)',
                    color: 'white',
                    font: {
                      family: 'Arial',
                      size: 14,
                      weight: 'bold',
                    },
                },
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
                title: {
                display: true,
                align: 'center',
                text: 'Time (m)',
                color: 'white',
                font: {
                  family: 'Arial',
                  size: 14,
                  weight: 'bold',
                },
            },
                beginAtZero: true
            }
        }
    };

    if (stdChart) {
        stdChart.destroy();
    }

    stdChart = new Chart(ctx, {
        type: 'line',
        data: chartData,
        options: chartOptions
    });
}

function drawVolumeChart(type, data) {
    data = data.slice(0, 5);
    const ctx = document.getElementById('volumeChart').getContext('2d');
    const labels = data.map((item, index) => index.toString());
    const upVol = data.map(item => item.upstream_volume );
    const downVol = data.map(item => item.downstream_volume);

    const chartData = {
        labels: labels,
        datasets: [
            {
                label: 'Upstream Volume',
                data: upVol,
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1
            },
            {
                label: 'Downstream Volume',
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
                title: {
                    display: true,
                    align: 'center',
                    text: 'Volume (in cars)',
                    color: 'white',
                    font: {
                      family: 'Arial',
                      size: 14,
                      weight: 'bold',
                    },
                },
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
                title: {
                display: true,
                align: 'center',
                text: 'Time (m)',
                color: 'white',
                font: {
                  family: 'Arial',
                  size: 14,
                  weight: 'bold',
                },
            },
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
    data = data.slice(0, 5);
    const ctx = document.getElementById('riskChart').getContext('2d');
    const labels = data.map((item, index) => index.toString());
    const riskScores = data.map(item => item.crash_risk);

    const chartData = {
        labels: labels,
        datasets: [
            {
                label: 'Risk Score',
                data: riskScores,
                backgroundColor: 'rgba(255, 0, 1, 0.2)',
                borderColor: 'rgba(255, 0, 1, 1)',
                borderWidth: 1
            }
        ]
    };

    const chartOptions = {
        scales: {
            x: {
                title: {
                    display: true,
                    align: 'center',
                    text: 'Risk Score',
                    color: 'white',
                    font: {
                      family: 'Arial',
                      size: 14,
                      weight: 'bold',
                    },
                },
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
                title: {
                    display: true,
                    align: 'center',
                    text: 'Time (m)',
                    color: 'white',
                    font: {
                      family: 'Arial',
                      size: 14,
                      weight: 'bold',
                    },
                },
                beginAtZero: true
            }
        }
    };

    if (riskChart) {
        riskChart.destroy();
    }

    riskChart = new Chart(ctx, {
        type: 'line',
        data: chartData,
        options: chartOptions
    });
}