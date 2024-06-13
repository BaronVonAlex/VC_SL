function convertTimeToHours(timePlayed) {
    const timeParts = timePlayed.split(', ');

    let totalHours = 0;

    timeParts.forEach(part => {
        if (part.includes('days')) {
            const days = parseInt(part.split(' ')[0], 10);
            totalHours += days * 24;
        } else if (part.includes(':')) {
            const [hours, minutes, seconds] = part.split(':').map(Number);
            totalHours += hours + (minutes / 60) + (seconds / 3600);
        } else {
            const hours = parseInt(part.split(' ')[0], 10);
            totalHours += hours;
        }
    });

    return `${totalHours.toFixed(2)} Hours`;
}

module.exports = { convertTimeToHours };