import { db, sequelize } from "../util/db";

module.exports = (sequelize, Sequelize, DataTypes) => {

    const ApiKey = sequelize.define('api_key', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        key: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
        },
        is_active: {
            type: DataTypes.BOOLEAN,
            defaultValue: true,
        },
    });

    return ApiKey;
};