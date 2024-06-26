const rankNames = {
    0: 'Private',
    1: 'Private First Class',
    2: 'Lance Corporal',
    3: 'Corporal',
    4: 'Sergeant',
    5: 'Staff Sergeant',
    6: 'Gunnery Sergeant',
    7: 'Master Sergeant',
    8: 'First Sergeant',
    9: 'Master Gunnery Sergeant',
    10: 'Sergeant Major',
    11: 'Sergeant Major of the Corps',
    12: 'Second Lieutenant',
    13: 'First Lieutenant',
    14: 'Captain',
    15: 'Major',
    16: 'Lieutenant Colonel',
    17: 'Colonel',
    18: 'Brigadier General',
    19: 'Major General',
    20: 'Lieutenant General',
    21: 'General'
};

function getRankName(rank) {
    return rankNames[rank] || 'Unknown Rank';
}

module.exports = { getRankName };
