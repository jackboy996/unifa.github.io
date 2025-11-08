// Chart initialization and management

// Initialize all charts
function initCharts() {
    // Price Chart
    initPriceChart();
    
    // Fund Allocation Chart
    initFundAllocationChart();
    
    // Voting Power Chart
    initVotingPowerChart();
    
    // Treasury Chart
    initTreasuryChart();
}

// Initialize Price Chart
function initPriceChart() {
    const priceCtx = document.getElementById('price-chart');
    if(priceCtx) {
        new Chart(priceCtx, {
            type: 'line',
            data: {
                labels: ['00:00', '04:00', '08:00', '12:00', '16:00', '20:00', '00:00'],
                datasets: [{
                    label: 'Price ($)',
                    data: [0.03, 0.035, 0.042, 0.038, 0.045, 0.048, 0.05],
                    borderColor: '#0073f5',
                    backgroundColor: 'rgba(0, 115, 245, 0.1)',
                    borderWidth: 2,
                    pointBackgroundColor: '#0073f5',
                    pointRadius: 4,
                    pointHoverRadius: 6,
                    fill: true,
                    tension: 0.4
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    },
                    tooltip: {
                        mode: 'index',
                        intersect: false,
                        backgroundColor: 'rgba(13, 13, 25, 0.9)',
                        titleColor: '#fff',
                        bodyColor: '#fff',
                        borderColor: 'rgba(255, 255, 255, 0.1)',
                        borderWidth: 1,
                        padding: 10,
                        displayColors: false,
                        callbacks: {
                            label: function(context) {
                                return `Price: $${context.raw}`;
                            }
                        }
                    }
                },
                scales: {
                    x: {
                        grid: {
                            display: false,
                            drawBorder: false
                        },
                        ticks: {
                            color: 'rgba(255, 255, 255, 0.5)'
                        }
                    },
                    y: {
                        grid: {
                            color: 'rgba(255, 255, 255, 0.05)',
                            drawBorder: false
                        },
                        ticks: {
                            color: 'rgba(255, 255, 255, 0.5)',
                            callback: function(value) {
                                return `$${value}`;
                            }
                        }
                    }
                }
            }
        });
    }
}

// Initialize Fund Allocation Chart
function initFundAllocationChart() {
    const fundAllocationCtx = document.getElementById('fund-allocation-chart');
    if(fundAllocationCtx) {
        new Chart(fundAllocationCtx, {
            type: 'doughnut',
            data: {
                labels: ['Liquidity Pool', 'Development Fund'],
                datasets: [{
                    data: [40, 60],
                    backgroundColor: [
                        '#0073f5',
                        '#5d15f5'
                    ],
                    borderWidth: 0,
                    hoverOffset: 10
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                cutout: '70%',
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: {
                            color: '#fff',
                            padding: 20,
                            usePointStyle: true,
                            pointStyle: 'circle'
                        }
                    }
                }
            }
        });
    }
}

// Initialize Voting Power Chart
function initVotingPowerChart() {
    const votingPowerCtx = document.getElementById('voting-power-chart');
    if(votingPowerCtx) {
        new Chart(votingPowerCtx, {
            type: 'bar',
            data: {
                labels: ['Locked Tokens', 'Staked Tokens', 'Delegated Voting'],
                datasets: [{
                    label: 'Voting Power',
                    data: [8000, 3000, 1500],
                    backgroundColor: [
                        '#0073f5',
                        '#5d15f5',
                        '#00c3ff'
                    ],
                    borderWidth: 0,
                    borderRadius: 5
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    }
                },
                scales: {
                    x: {
                        grid: {
                            display: false,
                            drawBorder: false
                        },
                        ticks: {
                            color: 'rgba(255, 255, 255, 0.7)'
                        }
                    },
                    y: {
                        grid: {
                            color: 'rgba(255, 255, 255, 0.05)',
                            drawBorder: false
                        },
                        ticks: {
                            color: 'rgba(255, 255, 255, 0.5)'
                        }
                    }
                }
            }
        });
    }
}

// Initialize Treasury Chart
function initTreasuryChart() {
    const treasuryCtx = document.getElementById('treasury-chart');
    if(treasuryCtx) {
        new Chart(treasuryCtx, {
            type: 'pie',
            data: {
                labels: ['Protocol Development', 'Marketing', 'Security', 'Community Grants', 'Reserved'],
                datasets: [{
                    data: [40, 25, 15, 10, 10],
                    backgroundColor: [
                        '#0073f5',
                        '#5d15f5',
                        '#00c3ff',
                        '#00ff9d',
                        '#ffaa00'
                    ],
                    borderWidth: 0,
                    hoverOffset: 10
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: {
                            color: '#fff',
                            padding: 20,
                            usePointStyle: true,
                            pointStyle: 'circle'
                        }
                    }
                }
            }
        });
    }
}

// Update chart data dynamically
function updateChartData(chartId, newData) {
    const chart = Chart.getChart(chartId);
    if(chart) {
        chart.data = newData;
        chart.update();
    }
}
