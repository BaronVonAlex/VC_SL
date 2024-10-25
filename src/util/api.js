const axios = require('axios');

// Function to fetch userId using playerId
async function fetchUserId(playerID) {
    const userGameApiUrl = `${process.env.USER_GAME_API_URL}${playerID}&limit=100`;
    const firstResponse = await axios.get(userGameApiUrl);
    return firstResponse.data[0].userId;
}

// Function to fetch player stats using userId
async function fetchPlayerStats(userId) {
    const statsApiUrl = `${process.env.STATS_API_URL}${userId}/games/${process.env.GAME_ID}`;
    const secondResponse = await axios.get(statsApiUrl);
    return secondResponse.data;
}

// Function to fetch player avatar using userId
async function fetchUserAvatar(userId) {
    const userAvatarApiUrl = `${process.env.KIXEYE_AVATAR_API_URL}${userId}/avatars`;
    const thirdResponse = await axios.get(userAvatarApiUrl);
    const avatarData = thirdResponse.data;
    return avatarData.find(avatar => avatar.id === "large")?.url; // Use optional chaining to avoid errors
}

module.exports = {
    fetchUserId,
    fetchPlayerStats,
    fetchUserAvatar,
};
