function convertUnixTimeToUTC(unixTime) {
    const date = new Date(unixTime * 1000);
    const hours = ('0' + date.getUTCHours()).slice(-2);
    const minutes = ('0' + date.getUTCMinutes()).slice(-2);
    const seconds = ('0' + date.getUTCSeconds()).slice(-2);
    return `${hours}:${minutes}:${seconds} UTC+00:00`;
}

module.exports = { convertUnixTimeToUTC };