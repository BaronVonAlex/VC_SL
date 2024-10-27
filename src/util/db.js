require('dotenv').config();
const { Sequelize, DataTypes } = require('sequelize');

const sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASS,
    {
        host: process.env.DB_HOST,
        dialect: process.env.DB_DIALECT,
        port: process.env.DB_PORT,
        logging: false,
    }
);

// User table (existing)
const User = sequelize.define('User', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true
    },
    username_history: {
        type: DataTypes.JSON,
        allowNull: false,
        defaultValue: []
    }
});

// Winrate table (new)
const Winrate = sequelize.define('Winrate', {
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: User,
            key: 'id'
        }
    },
    month: {
        type: DataTypes.INTEGER, // Store month as 1-12
        allowNull: false
    },
    year: {
        type: DataTypes.INTEGER,
        allowNull: false, 
    },
    baseAttackWinrate: {
        type: DataTypes.FLOAT,
        allowNull: true
    },
    baseDefenceWinrate: {
        type: DataTypes.FLOAT,
        allowNull: true
    },
    fleetWinrate: {
        type: DataTypes.FLOAT,
        allowNull: true
    }
}, {
    timestamps: false
});

// Sync database
(async () => {
    try {
        await sequelize.authenticate();
        console.log("Database connection successful!");
        await sequelize.sync();
        console.log("Database synced!");
    } catch (error) {
        console.error("Unable to connect to the database:", error);
    }
})();

module.exports = { sequelize, User, Winrate };
