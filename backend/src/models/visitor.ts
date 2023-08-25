import { db, sequelize } from "../util/db";

module.exports = (sequelize, Sequelize, DataTypes) => {

    const Visitor = sequelize.define('visitor', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        ipAddress: {
            type: DataTypes.STRING
        },
        userAgent: {
            type: DataTypes.STRING
        },
        route: {
            type: DataTypes.STRING
        },
        timestamp: {
            type: DataTypes.DATE
        },
    });

    return Visitor;
};