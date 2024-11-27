const { fetchUserId, fetchPlayerStats, fetchUserAvatar } = require('./api');
const { User } = require('./db');

async function fetchPlayerDetails(playerID) {
    const userId = await fetchUserId(playerID);
    const playerData = await fetchPlayerStats(userId);
    const largeAvatarUrl = await fetchUserAvatar(userId);
    return { userId, playerData, largeAvatarUrl };
}

/**
 * Helper function to safely parse username history
 * @param {string|Array} history - The username history to parse
 * @returns {Array} Parsed username history array
 */
function parseUsernameHistory(history) {
    if (Array.isArray(history)) {
        return history;
    }
    try {
        return history ? JSON.parse(history) : [];
    } catch (e) {
        console.error('Error parsing username history:', e);
        return [];
    }
}

async function findOrCreateUser(playerID, playerAlias) {
    const [user, created] = await User.findOrCreate({
        where: { id: playerID },
        defaults: {
            username_history: [playerAlias]
        }
    });

    if (!created) {
        const usernameHistory = parseUsernameHistory(user.username_history);

        if (!usernameHistory.includes(playerAlias)) {
            usernameHistory.push(playerAlias);
            user.username_history = usernameHistory;
            await user.save();
        }
    }

    return user;
}

function formatUsernameHistory(user) {
    const usernameHistory = parseUsernameHistory(user.username_history);
    return usernameHistory.length > 0 ? usernameHistory.join(', ') : "No history available";
}

module.exports = {
    fetchPlayerDetails,
    findOrCreateUser,
    formatUsernameHistory,
};