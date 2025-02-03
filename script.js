// <!-- Data Section - Update these values manually -->
// Update this data manually
const data = {
    lastUpdated: new Date().toLocaleString(),
    totalCapital: 0.0,
    dailyPnl: {
        value: "+00%",
        amount: "+$0"
    },
    activeTrades: [
        // {
        //     pair: "BTC/USDT",
        //     direction: "long",
        //     entry: 42000,
        //     current: 43250,
        //     margin: 5000
        // },
        // {
        //     pair: "ETH/USDT",
        //     direction: "short",
        //     entry: 2500,
        //     current: 2455,
        //     margin: 3000
        // }
    ],
    spotInvestments: [
        // { asset: "BTC", quantity: 1.2, price: 43250 },
        // { asset: "ETH", quantity: 10, price: 2455 },
        // { asset: "USDT", quantity: 50000, price: 1 }
    ]
};

// Display functions
function formatMoney(amount) {
    return amount.toLocaleString('en-US', {
        style: 'currency',
        currency: 'USD',
        maximumFractionDigits: 0
    });
}

function calculatePnl(entry, current, margin) {
    const pnl = ((current - entry) / entry) * 100;
    return {
        percentage: pnl.toFixed(2) + "%",
        amount: (margin * (pnl / 100)).toLocaleString('en-US', {
            style: 'currency',
            currency: 'USD',
            maximumFractionDigits: 0
        })
    };
}

function render() {
    // Update metadata
    document.getElementById('updateTime').textContent = data.lastUpdated;
    document.getElementById('totalCapital').textContent =
        data.totalCapital.toLocaleString();

    // Daily P&L
    const dailyPnlElement = document.getElementById('dailyPnl');
    dailyPnlElement.textContent = `${data.dailyPnl.value} (${data.dailyPnl.amount})`;

    // Active trades
    const tradesHtml = data.activeTrades.map(trade => {
        const pnl = calculatePnl(trade.entry, trade.current, trade.margin);
        return `
                    <div class="trade-item">
                        <div>
                            <span class="trade-direction ${trade.direction}">
                                ${trade.direction.toUpperCase()}
                            </span>
                            ${trade.pair}
                        </div>
                        <div>
                            <div>${formatMoney(trade.current)}</div>
                            <div class="${pnl.percentage.startsWith('-') ? 'negative' : 'positive'}">
                                ${pnl.percentage} (${pnl.amount})
                            </div>
                        </div>
                    </div>
                `;
    }).join('');
    document.getElementById('activeTrades').innerHTML = tradesHtml;

    // Spot investments
    const spotHtml = data.spotInvestments.map(asset => {
        const value = asset.quantity * asset.price;
        return `
                    <div class="trade-item">
                        <div>${asset.asset}</div>
                        <div>
                            <div>${asset.quantity} @ ${formatMoney(asset.price)}</div>
                            <div class="positive">${formatMoney(value)}</div>
                        </div>
                    </div>
                `;
    }).join('');
    document.getElementById('spotInvestments').innerHTML = spotHtml;
}

// Initial render
render();
