const axios = require('axios');
const { Winrate } = require('../util/db');

function getMonthName(monthNumber) {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return months[monthNumber - 1] || '';
}

async function fetchWinrateHistory(playerID) {
    const winrateRecords = await Winrate.findAll({
        where: { userId: playerID },
        order: [['month', 'ASC']], // Order by month
    });

    return winrateRecords;
}

async function generateChartUrl(playerID) {
    const historicalData = await fetchWinrateHistory(playerID);

    const labels = Array.from({ length: 12 }, (_, i) => getMonthName(i + 1));
    const fleetAtkData = Array.from({ length: 12 }, () => null);
    const baseAtkData = Array.from({ length: 12 }, () => null);
    const baseDefData = Array.from({ length: 12 }, () => null);

    for (const entry of historicalData) {
        const monthIndex = entry.month - 1; // Adjust index since months are 1-based
        fleetAtkData[monthIndex] = entry.fleetWinrate; // Adjust field names as necessary
        baseAtkData[monthIndex] = entry.baseAttackWinrate; // Adjust field names as necessary
        baseDefData[monthIndex] = entry.baseDefenceWinrate; // Adjust field names as necessary
    }

    // Combine all data to calculate the range
    const allData = [...fleetAtkData, ...baseAtkData, ...baseDefData].filter(value => value !== null);
    const minValue = Math.min(...allData);
    const maxValue = Math.max(...allData);

    // Set the y-axis range
    const yMin = Math.max(0, minValue - 5); // Avoid going below 0
    const yMax = Math.min(100, maxValue + 5); // Avoid going above 100

    // Create the chart data object
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