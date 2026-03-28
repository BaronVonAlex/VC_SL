const { Winrate } = require('./db');

async function findOrCreateWinrateRecord(playerID, baseAttackWinrate, baseDefenceWinrate, fleetWinrate, rawStats = {}) {
    const currentMonth = new Date().getMonth() + 1;
    const currentYear = new Date().getFullYear();

    const {
        baseAttackWin, baseAttackLoss, baseAttackDraw,
        baseDefenceWin, baseDefenceLoss, baseDefenceDraw,
        fleetWin, fleetLoss, fleetDraw
    } = rawStats;

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
            year: currentYear,
            baseAttackWin, baseAttackLoss, baseAttackDraw,
            baseDefenceWin, baseDefenceLoss, baseDefenceDraw,
            fleetWin, fleetLoss, fleetDraw
        }
    });

    if (!winrateCreated) {
        winrateRecord.baseAttackWinrate = baseAttackWinrate;
        winrateRecord.baseDefenceWinrate = baseDefenceWinrate;
        winrateRecord.fleetWinrate = fleetWinrate;
        winrateRecord.baseAttackWin = baseAttackWin;
        winrateRecord.baseAttackLoss = baseAttackLoss;
        winrateRecord.baseAttackDraw = baseAttackDraw;
        winrateRecord.baseDefenceWin = baseDefenceWin;
        winrateRecord.baseDefenceLoss = baseDefenceLoss;
        winrateRecord.baseDefenceDraw = baseDefenceDraw;
        winrateRecord.fleetWin = fleetWin;
        winrateRecord.fleetLoss = fleetLoss;
        winrateRecord.fleetDraw = fleetDraw;
        await winrateRecord.save();
    }

    return winrateRecord;
}

module.exports = {
    findOrCreateWinrateRecord,
};
