
/**
 * Convert a timestamp in milliseconds to a human-readable date.
 * @param {number} timestamp - The timestamp in milliseconds.
 * @returns {string} - The formatted date as a string.
 */

function convertUnixTimeToUTC(unixTime) {
    const date = new Date(unixTime * 1000);
    const hours = ('0' + date.getUTCHours()).slice(-2);
    const minutes = ('0' + date.getUTCMinutes()).slice(-2);
    const seconds = ('0' + date.getUTCSeconds()).slice(-2);
    return `${hours}:${minutes}:${seconds} UTC+00:00`;
}

function convertTimestampToDate(timestamp) {
    const date = new Date(timestamp); // Create a Date object with the timestamp
    return date.toLocaleDateString('en-GB', { // Format it in DD/MM/YYYY format
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false,
    });
}

function convertToDate(timestamp) {
    const date = new Date(timestamp);
    return date.toLocaleDateString('en-GB', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
    });
}

/**
 * Convert a timestamp to a human-readable relative time (e.g., "2 hours ago").
 * @param {number} timestamp - The timestamp in milliseconds.
 * @returns {string} - The relative time as a string.
 */
function convertToRelativeTime(timestamp) {
    const now = Date.now();
    const differenceInMillis = now - timestamp;

    const seconds = Math.floor(differenceInMillis / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    const months = Math.floor(days / 30);
    const years = Math.floor(days / 365);

    if (years > 0) {
        return years === 1 ? '1 year ago' : `${years} years ago`;
    }
    if (months > 0) {
        return months === 1 ? '1 month ago' : `${months} months ago`;
    }
    if (days > 0) {
        return days === 1 ? '1 day ago' : `${days} days ago`;
    }
    if (hours > 0) {
        return hours === 1 ? '1 hour ago' : `${hours} hours ago`;
    }
    if (minutes > 0) {
        return minutes === 1 ? '1 minute ago' : `${minutes} minutes ago`;
    }
    return 'just now';
}

module.exports = { convertUnixTimeToUTC, convertTimestampToDate, convertToDate, convertToRelativeTime, };