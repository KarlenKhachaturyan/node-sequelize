const Sequelize = require('sequelize');
const sequelize = new Sequelize(
    process.env.DB_DATABASE,
    process.env.DB_USERNAME,
    process.env.DB_PASSWORD,
    {
        host: process.env.DB_HOST,
        dialect: process.env.DB_DIALECT,
        pool: {
            max: +process.env.DB_POOL_MAX,
            min: +process.env.DB_POOL_MIN,
            acquire: +process.env.DB_POOL_ACQUIRE,
            idle: +process.env.DB_POOL_IDLE,
        }
    }
);

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

// Models
db. users = require('../models/user')(sequelize, Sequelize);

module.exports = db;