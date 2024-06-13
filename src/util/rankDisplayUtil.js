const rankEmojis = {
    0: '<:rank_0:1250755026272653403>',
    1: '<:rank_1:1250755028126273586>',
    2: '<:rank_2:1250755029728624742>',
    3: '<:rank_3:1250755031687233547>',
    4: '<:rank_4:1250755033851498546>',
    5: '<:rank_5:1250755035537608789>',
    6: '<:rank_6:1250755945387130920>',
    7: '<:rank_7:1250755037337096194>',
    8: '<:rank_8:1250755038729601034>',
    9: '<:rank_9:1250755040105205791>',
    10: '<:rank_10:1250755041644777533>',
    11: '<:rank_11:1250755113484812338>',
    12: '<:rank_12:1250755045729767485>',
    13: '<:rank_13:1250755048032571464>',
    14: '<:rank_14:1250755155071336448>',
    15: '<:rank_15:1250755052394643557>',
    16: '<:rank_16:1250755056194555924>',
    17: '<:rank_17:1250755190739566675>',
    18: '<:rank_18:1250755059944525854>',
    19: '<:rank_19:1250755067296878602>',
    20: '<:rank_20:1250755068869873664>',
    21: '<:rank_21:1250755070014787636>'
};

function getRankEmoji(rank) {
    return rankEmojis[rank] || ':trophy:';
}

module.exports = { getRankEmoji };
