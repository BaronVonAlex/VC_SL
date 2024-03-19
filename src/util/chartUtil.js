const axios = require('axios');

// Function to get month name from month number
function getMonthName(monthNumber) {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return months[monthNumber - 1] || '';
}

async function generateChartUrl(playerID, playerData) {
    const historicalData = playerData.historical.sort((a, b) => parseInt(a.month) - parseInt(b.month));

    // Prepare data for the chart
    const labels = Array.from({ length: 12 }, (_, i) => getMonthName(i + 1));
    const fleetAtkData = Array.from({ length: 12 }, () => null);
    const baseAtkData = Array.from({ length: 12 }, () => null);
    const baseDefData = Array.from({ length: 12 }, () => null);

    for (const entry of historicalData) {
        const monthIndex = parseInt(entry.month) - 1;
        fleetAtkData[monthIndex] = entry.fleet_atk;
        baseAtkData[monthIndex] = entry.base_atk;
        baseDefData[monthIndex] = entry.base_def;
    }

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
                    fill: false
                },
                {
                    label: 'Base Attack',
                    data: baseAtkData,
                    borderColor: 'yellow',
                    fill: false
                },
                {
                    label: 'Base Defense',
                    data: baseDefData,
                    borderColor: 'green',
                    fill: false
                }
            ]
        }
    };

    const chartUrl = `https://quickchart.io/chart?c=${encodeURIComponent(JSON.stringify(chartData))}`;

    return chartUrl;
}

module.exports = {
    getMonthName,
    generateChartUrl,
};
