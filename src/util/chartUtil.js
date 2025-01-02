const axios = require('axios');
const { Winrate } = require('../util/db');

function getMonthName(monthNumber) {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return months[monthNumber - 1] || '';
}

async function fetchWinrateHistory(playerID, year) {
    const winrateRecords = await Winrate.findAll({
        where: {
            userId: playerID,
            year,
        },
        order: [['month', 'ASC']],
    });

    return winrateRecords;
}

async function generateChartUrl(playerID, { year }) {
    const historicalData = await fetchWinrateHistory(playerID, year);

    const labels = Array.from({ length: 12 }, (_, i) => getMonthName(i + 1));
    const fleetAtkData = Array.from({ length: 12 }, () => null);
    const baseAtkData = Array.from({ length: 12 }, () => null);
    const baseDefData = Array.from({ length: 12 }, () => null);

    for (const entry of historicalData) {
        const monthIndex = entry.month - 1; // Adjust index since months are 1-based
        fleetAtkData[monthIndex] = entry.fleetWinrate; 
        baseAtkData[monthIndex] = entry.baseAttackWinrate; 
        baseDefData[monthIndex] = entry.baseDefenceWinrate; 
    }

    const allData = [...fleetAtkData, ...baseAtkData, ...baseDefData].filter(value => value !== null);
    const minValue = Math.min(...allData);
    const maxValue = Math.max(...allData);

    const yMin = Math.max(0, minValue - 5);
    const yMax = Math.min(100, maxValue + 5);

    const chartData = {
        type: 'line',
        data: {
            labels: labels,
            datasets: [
                {
                    label: 'Fleet Attack',
                    data: fleetAtkData,
                    borderColor: 'red',
                    fill: false,
                },
                {
                    label: 'Base Attack',
                    data: baseAtkData,
                    borderColor: 'yellow',
                    fill: false,
                },
                {
                    label: 'Base Defense',
                    data: baseDefData,
                    borderColor: 'green',
                    fill: false,
                },
            ],
        },
        options: {
            scales: {
                y: {
                    min: yMin,
                    max: yMax,
                },
            },
        },
    };

    const chartUrl = `https://quickchart.io/chart?c=${encodeURIComponent(JSON.stringify(chartData))}`;
    return chartUrl;
}

module.exports = {
    getMonthName,
    generateChartUrl,
};