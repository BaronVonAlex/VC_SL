const getColor = (value) => {
    if (value < 10) return 0xff0000; //red
    else if (value < 30) return 0xFF6600; //orange
    else if (value < 50) return 0xFFEF00; //yellow
    else if (value < 60) return 0x33FF00; //green
    else if (value < 70) return 0x00FFBC; //cyan
    else return 0xFF00E6; //pink
};

module.exports = { getColor };