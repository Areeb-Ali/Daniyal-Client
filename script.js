
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
                { asset: "ARB", quantity: 4.07, entryPrice: 0.488, currentPrice: 0.4697 },
                { asset: "TIA", quantity: 0.61, entryPrice: 3.2, currentPrice: 2.984 },
                { asset: "AVAX", quantity: 0.05, entryPrice: 26.977, currentPrice: 26.238 },
                { asset: "BKN", quantity: 5.4, entryPrice: 0.27643, currentPrice: 0.270181 },
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
    