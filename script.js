
// ========== DATA INPUT - EDIT THESE VALUES ========== //
const data = {
    lastUpdated: new Date().toLocaleString(),
    activeTrades: [
        // {
        //     pair: "BTC/USDT",
        //     direction: "long",
        //     entryPrice: 42000,   // Your entry price
        //     quantity: 1.2,      // Quantity of coins
        //     currentPrice: 43250 // Current market price
        // },
        // {
        //     pair: "ETH/USDT",
        //     direction: "short",
        //     entryPrice: 2500,
        //     quantity: 10,
        //     currentPrice: 2455
        // }
    ],
    spotInvestments: [
        { asset: "ARB", quantity: 4.07, entryPrice: 0.488, currentPrice: 0.4507 },
        { asset: "TIA", quantity: 0.61, entryPrice: 3.2, currentPrice: 3.048 },
        { asset: "AVAX", quantity: 0.05, entryPrice: 26.977, currentPrice: 24.914},
        { asset: "BKN", quantity: 5.4, entryPrice: 0.27643, currentPrice: 0.23192 },
        { asset: "USDT", quantity: 22.6, entryPrice: 1, currentPrice: 1 }
    ]
};
// ========== END OF DATA INPUT ========== //

// Utility functions
const formatMoney = (amount) => {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        maximumFractionDigits: 4
    }).format(amount);
};

const calculatePnl = (entry, current, quantity, isShort = false) => {
    const priceDiff = isShort ? entry - current : current - entry;
    const pnlAmount = priceDiff * quantity;
    const pnlPercent = ((priceDiff / entry) * 100).toFixed(2);

    return {
        amount: pnlAmount,
        percent: Math.abs(pnlPercent),
        isProfit: pnlAmount >= 0
    };
};

const calculateTotalValue = () => {
    // Calculate total spot value
    const totalSpot = data.spotInvestments.reduce((acc, item) =>
        acc + (item.quantity * item.currentPrice), 0);

    // Calculate total trade value (including P&L)
    const totalTrades = data.activeTrades.reduce((acc, trade) => {
        const pnl = calculatePnl(trade.entryPrice, trade.currentPrice,
            trade.quantity, trade.direction === 'short');
        return acc + (trade.quantity * trade.currentPrice);
    }, 0);

    return totalSpot + totalTrades;
};

const updateTotals = () => {
    const totalValue = calculateTotalValue();
    document.getElementById('totalValue').textContent = formatMoney(totalValue);

    // Calculate 24h P&L
    const totalPnl = data.activeTrades.reduce((acc, trade) => {
        const pnl = calculatePnl(trade.entryPrice, trade.currentPrice,
            trade.quantity, trade.direction === 'short');
        return acc + pnl.amount;
    }, 0);

    document.getElementById('dailyPnl').textContent =
        `${totalPnl >= 0 ? '+' : ''}${formatMoney(totalPnl)}`;
    document.getElementById('dailyPnl').className =
        totalPnl >= 0 ? 'positive' : 'negative';
};

const renderTrades = () => {
    const tradesHTML = data.activeTrades.map(trade => {
        const pnl = calculatePnl(trade.entryPrice, trade.currentPrice,
            trade.quantity, trade.direction === 'short');
        const currentValue = trade.quantity * trade.currentPrice;

        return `
                    <div class="trade-item">
                        <div>
                            <span class="trade-direction ${trade.direction}">
                                ${trade.direction.toUpperCase()}
                            </span>
                            ${trade.pair}
                        </div>
                        <div>
                            <div>${formatMoney(currentValue)}</div>
                            <div class="${pnl.isProfit ? 'positive' : 'negative'}">
                                ${pnl.isProfit ? '+' : '-'}${formatMoney(Math.abs(pnl.amount))} (${pnl.percent}%)
                            </div>
                        </div>
                    </div>
                `;
    }).join('');
    document.getElementById('activeTrades').innerHTML = tradesHTML;
};

const renderSpotInvestments = () => {
    const spotHTML = data.spotInvestments.map(asset => {
        const pnl = calculatePnl(asset.entryPrice, asset.currentPrice, asset.quantity);
        const currentValue = asset.quantity * asset.currentPrice;

        return `
                    <div class="trade-item">
                        <div>${asset.asset}</div>
                        <div>
                            <div>${asset.quantity} @ ${formatMoney(asset.currentPrice)}</div>
                            <div class="${pnl.isProfit ? 'positive' : 'negative'}">
                                ${formatMoney(currentValue)} (${pnl.isProfit ? '+' : '-'}${pnl.percent}%)
                            </div>
                        </div>
                    </div>
                `;
    }).join('');
    document.getElementById('spotInvestments').innerHTML = spotHTML;
};

// Initial render
document.getElementById('updateTime').textContent = data.lastUpdated;
updateTotals();
renderTrades();
renderSpotInvestments();

// ========== DATA INPUT - EDIT THESE VALUES ========== //
const capitalData = [
    { date: "2025-02-05", capital: 29.3 },
    { date: "2025-02-06", capital: 28.8 },
    { date: "2025-02-07", capital: 28.9 },
    { date: "2025-02-08", capital: 28.7 },
    { date: "2025-02-09", capital: 28.7 },
    // { date: "2023-10-05", capital: 155000 },
    // { date: "2023-10-06", capital: 154500 },
    // { date: "2023-10-07", capital: 156000 },
];
// ========== END OF DATA INPUT ========== //

// Format data for ApexCharts
const processData = (data) => {
    return {
        dates: data.map(item => item.date),
        capital: data.map(item => item.capital)
    };
};


// Render the chart
const renderChart = () => {
    const processedData = processData(capitalData);

    const options = {
        chart: {
            type: 'line',
            height: '100%',
            toolbar: {
                show: true,
                tools: {
                    download: true,
                    selection: true,
                    zoom: true,
                    zoomin: true,
                    zoomout: true,
                    pan: true,
                    reset: true
                }
            }
        },
        series: [{
            name: 'Capital',
            data: processedData.capital
        }],
        xaxis: {
            categories: processedData.dates,
            type: 'datetime',
            labels: {
                formatter: function (value) {
                    return new Date(value).toLocaleDateString();
                }
            }
        },
        yaxis: {
            labels: {
                formatter: function (value) {
                    return `$${value.toLocaleString()}`;
                }
            },
            title: {
                text: 'Capital Value (USD)'
            }
        },
        stroke: {
            curve: 'smooth',
            width: 3
        },
        colors: ['#16c784'],
        tooltip: {
            enabled: true,
            x: {
                formatter: function (value) {
                    return new Date(value).toLocaleDateString();
                }
            },
            y: {
                formatter: function (value) {
                    return `$${value.toLocaleString()}`;
                }
            }
        },
        markers: {
            size: 5,
            colors: ['#16c784'],
            strokeColors: '#fff',
            strokeWidth: 2,
            hover: {
                size: 7
            }
        },
        grid: {
            borderColor: '#f1f1f1',
            strokeDashArray: 5
        }
    };

    const chart = new ApexCharts(document.querySelector("#chart"), options);
    chart.render();
};

// Initial render
renderChart();
