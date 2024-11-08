const { fetchUserId, fetchPlayerStats, fetchUserAvatar } = require('./api');
const { User } = require('./db');

async function fetchPlayerDetails(playerID) {
    const userId = await fetchUserId(playerID);
    const playerData = await fetchPlayerStats(userId);
    const largeAvatarUrl = await fetchUserAvatar(userId);
    return { userId, playerData, largeAvatarUrl };
}

async function findOrCreateUser(playerID, playerAlias) {
    const [user, created] = await User.findOrCreate({
        where: { id: playerID },
        defaults: { username_history: [playerAlias] }
    });

    if (!created) {
        let usernameHistory = Array.isArray(user.username_history) 
            ? user.username_history 
            : JSON.parse(user.username_history || '[]');

        if (!usernameHistory.includes(playerAlias)) {
            usernameHistory.push(playerAlias);
            user.username_history = JSON.stringify(usernameHistory);
            await user.save();
        }
    }

    return user;
}

function formatUsernameHistory(user) {
    let usernameHistory = Array.isArray(user.username_history) 
        ? user.username_history 
        : JSON.parse(user.username_history || '[]');
    return usernameHistory.length > 0 ? usernameHistory.join(', ') : "No history available";
}

module.exports = {
    fetchPlayerDetails,
    findOrCreateUser,
    formatUsernameHistory,
};
