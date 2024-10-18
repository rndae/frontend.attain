let speedChart;
let volumeChart;
let riskChart;
let stdChart;
let severityChart;


function drawSpeedChart(type, data) {
    data = data.slice(10,15);

    const ctx = document.getElementById('speedChart').getContext('2d');
    const labels = data.map((item, index) => index.toString());

    const speeds = data.map(item => item.speed > 0 ? item.speed : 0);

    const chartData = {
        labels: labels,
        datasets: [
            {
                label: 'Speed',
                color: 'white',
                data: speeds,
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1
            }
        ]
    };

    const chartOptions = {
        responsive: true,
        scales: {
            x: {
                title: {
                    display: true,
                    align: 'center',
                    text: 'Timesteps',
                    color: 'white',
                    font: {
                      family: 'Arial',
                      size: 14,
                      weight: 'bold',
                    },
                },
                beginAtZero: true,
                type: 'category',
                ticks: {
                    color: 'rgba(255, 255, 255, 0.8)', // Set y-axis label color
                    min: 0,
                    maxTicksLimit: 5,
                    callback: function(value, index, ticks) {
                        if (index === ticks.length - 1) {
                            return ticks.length - 1;
                        } else {
                            return index;
                        }
                    }
                },
                grid: {
                    display: true, // Show gridlines on x-axis
                    color: 'rgba(200, 200, 200, 0.4)', // Set the gridline color
                    lineWidth: 1, // Set the gridline thickness
                  }
            },
            y: {
                ticks: {
                    //padding: -5,
                    color: 'rgba(255, 255, 255, 0.8)', // Set y-axis label color
                },
                title: {
                    display: true,
                    align: 'center',
                    text: 'Speed (mph)',
                    color: 'white',
                    //padding: { top: 0, bottom: 0, },
                    font: {
                      family: 'Arial',
                      size: 14,
                      weight: 'bold',
                    },
                },
                beginAtZero: true,
                min: 0,
                grid: {
                    display: true, // Show gridlines on axis
                    color: 'rgba(200, 200, 200, 0.4)', // Set the gridline color
                    lineWidth: 1, // Set the gridline thickness
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
    data = data.slice(10,15);
    const ctx = document.getElementById('stdChart').getContext('2d');
    const labels = data.map((item, index) => index.toString());
    console.log(labels);
    console.log(data);
    const speeds_std = data.map(item => item.speed_std > 0 ? item.speed_std : 0);

    const chartData = {
        labels: labels,
        datasets: [
            {
                label: 'SD of Speed',
                data: speeds_std,
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
                    text: 'Timesteps',
                    color: 'white',
                    font: {
                      family: 'Arial',
                      size: 14,
                      weight: 'bold',
                    },
                },
                beginAtZero: true,
                type: 'category',
                ticks: {
                    color: 'rgba(255, 255, 255, 0.8)', // Set y-axis label color
                    min: 0,
                    maxTicksLimit: 5,
                    callback: function(value, index, ticks) {
                        if (index === ticks.length - 1) {
                            return ticks.length - 1;
                        } else {
                            return index;
                        }
                    }
                },
                grid: {
                    display: true, // Show gridlines on axis
                    color: 'rgba(200, 200, 200, 0.4)', // Set the gridline color
                    lineWidth: 1, // Set the gridline thickness
                },
            },
            y: {
                ticks: {
                    color: 'rgba(255, 255, 255, 0.8)', // Set y-axis label color
                    callback: function(value) {
                        //return Math.round(value, 1); // Round the y-axis values to integers
                        return Math.round(value * 10) / 10; // Rounds the y-axis values to one decimal place
                    }
                },
                title: {
                    display: true,
                    align: 'center',
                    text: 'SD Speed (mph)',
                    color: 'white',
                    font: {
                      family: 'Arial',
                      size: 14,
                      weight: 'bold',
                    },
                },
                beginAtZero: true,
                min: 0,
                grid: {
                    display: true, // Show gridlines on axis
                    color: 'rgba(200, 200, 200, 0.4)', // Set the gridline color
                    lineWidth: 1, // Set the gridline thickness
                },
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
    data = data.slice(-5);
    const ctx = document.getElementById('volumeChart').getContext('2d');
    const labels = data.map((item, index) => index.toString());
    const upVol = data.map(item => item.upstream_volume > 0 ? item.upstream_volume : 0);
    const downVol = data.map(item => item.downstream_volume > 0 ? item.downstream_volume : 0);
    const targetVol = data.map(item => item.volume > 0 ? item.volume : 0);
    console.log(upVol);
    console.log(targetVol);
    console.log(downVol);

    const chartData = {
        labels: labels,
        datasets: [

            {
                label: 'Downstream',
                data: downVol,
                backgroundColor: 'rgba(255, 99, 132, 0.2)',
                borderColor: 'rgba(255, 99, 132, 1)',
                borderWidth: 1
            },
            {
                label: 'Target',
                data: targetVol,
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1
            },
            {
                label: 'Upstream',
                data: upVol,
                backgroundColor: 'rgba(255, 192, 192, 0.2)',
                borderColor: 'rgba(255, 192, 192, 1)',
                borderWidth: 1
            },

        ]
    };

    const chartOptions = {
        scales: {
            x: {
                title: {
                    display: true,
                    align: 'center',
                    text: 'Timesteps',
                    color: 'white',
                    font: {
                      family: 'Arial',
                      size: 14,
                      weight: 'bold',
                    },

                },
                beginAtZero: true,
                type: 'category',
                ticks: {
                    color: 'rgba(255, 255, 255, 0.8)', // Set y-axis label color
                    min: 0,
                    maxTicksLimit: 5,
                    callback: function(value, index, ticks) {
                        if (index === ticks.length - 1) {
                            return ticks.length - 1;
                        } else {
                            return index;
                        }
                    }
                },
                grid: {
                    display: true, // Show gridlines on axis
                    color: 'rgba(200, 200, 200, 0.4)', // Set the gridline color
                    lineWidth: 1, // Set the gridline thickness
                },
            },
            y: {
                title: {
                display: true,
                align: 'center',
                text: 'Volume (per min)',
                color: 'white',
                font: {
                  family: 'Arial',
                  size: 14,
                  weight: 'bold',
                },

            },
                beginAtZero: true,
                min: 0,
                ticks: {
                    color: 'rgba(255, 255, 255, 0.8)', // Set y-axis label color
                },
                grid: {
                    display: true, // Show gridlines on axis
                    color: 'rgba(200, 200, 200, 0.4)', // Set the gridline color
                    lineWidth: 1, // Set the gridline thickness
                },
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
    data = data.slice(10,15);
    const ctx = document.getElementById('riskChart').getContext('2d');
    const labels = data.map((item, index) => index.toString());
    

    const riskScores = data.map(item => item.crash_risk > 0 ? Math.round(item.crash_risk * 10) / 10 : 0);
    

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
                    text: 'Timesteps',
                    color: 'white',
                    font: {
                      family: 'Arial',
                      size: 14,
                      weight: 'bold',
                    },
                },
                beginAtZero: true,
                type: 'category',
                ticks: {
                    color: 'rgba(255, 255, 255, 0.8)', // Set y-axis label color
                    min: 0,
                    maxTicksLimit: 5,
                    callback: function(value, index, ticks) {
                        if (index === ticks.length - 1) {
                            return ticks.length - 1;
                        } else {
                            return index;
                        }
                    }
                },
                grid: {
                    display: true, // Show gridlines on axis
                    color: 'rgba(200, 200, 200, 0.4)', // Set the gridline color
                    lineWidth: 1, // Set the gridline thickness
                },
            },
            y: {
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
                beginAtZero: true,
                min: 0,
                ticks: {
                    color: 'rgba(255, 255, 255, 0.8)', // Set y-axis label color
                },
                grid: {
                    display: true, // Show gridlines on axis
                    color: 'rgba(200, 200, 200, 0.4)', // Set the gridline color
                    lineWidth: 1, // Set the gridline thickness
                },
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


function drawSeverityChart(type, data) {
    data = data.slice(10,15);
    const ctx = document.getElementById('severityChart').getContext('2d');
    const labels = data.map((item, index) => index.toString());

    const severityScores = data.map(item => item.severity_score > 0 ? Math.round(item.severity_score * 10) / 10 : 0);

    const chartData = {
        labels: labels,
        datasets: [
            {
                label: 'Severity Score',
                data: severityScores,
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
                    text: 'Timesteps',
                    color: 'white',
                    font: {
                      family: 'Arial',
                      size: 14,
                      weight: 'bold',
                    },
                },
                beginAtZero: true,
                type: 'category',
                ticks: {
                    color: 'rgba(255, 255, 255, 0.8)', // Set y-axis label color
                    min: 0,
                    maxTicksLimit: 5,
                    callback: function(value, index, ticks) {
                        if (index === ticks.length - 1) {
                            return ticks.length - 1;
                        } else {
                            return index;
                        }
                    }
                },
                grid: {
                    display: true, // Show gridlines on axis
                    color: 'rgba(200, 200, 200, 0.4)', // Set the gridline color
                    lineWidth: 1, // Set the gridline thickness
                },
            },
            y: {
                title: {
                    display: true,
                    align: 'center',
                    text: 'Severity Score',
                    color: 'white',
                    font: {
                      family: 'Arial',
                      size: 14,
                      weight: 'bold',
                    },
                },
                beginAtZero: true,
                min: 0,
                ticks: {
                    color: 'rgba(255, 255, 255, 0.8)', // Set y-axis label color
                },
                grid: {
                    display: true, // Show gridlines on axis
                    color: 'rgba(200, 200, 200, 0.4)', // Set the gridline color
                    lineWidth: 1, // Set the gridline thickness
                },
            }
        }
    };

    if (severityChart) {
        severityChart.destroy();
    }

    severityChart = new Chart(ctx, {
        type: 'line',
        data: chartData,
        options: chartOptions
    });
}

