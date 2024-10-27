const { Winrate } = require('./db');

async function findOrCreateWinrateRecord(playerID, baseAttackWinrate, baseDefenceWinrate, fleetWinrate) {
    const currentMonth = new Date().getMonth() + 1;
    const currentYear = new Date().getFullYear();

    const [winrateRecord, winrateCreated] = await Winrate.findOrCreate({
        where: {
            userId: playerID,
            month: currentMonth,
            year: currentYear
        },
        defaults: {
            baseAttackWinrate,
            baseDefenceWinrate,
            fleetWinrate,
            year: currentYear
        }
    });

    if (!winrateCreated) {
        winrateRecord.baseAttackWinrate = baseAttackWinrate;
        winrateRecord.baseDefenceWinrate = baseDefenceWinrate;
        winrateRecord.fleetWinrate = fleetWinrate;
        await winrateRecord.save();
    }

    return winrateRecord;
}

module.exports = {
    findOrCreateWinrateRecord,
};
