'use strict';

const { QueryTypes, DataTypes } = require('sequelize');

module.exports = {
    up: async (queryInterface, Sequelize) => {
        return queryInterface.sequelize.transaction(async (t) => {
            return await queryInterface.addColumn('channel', 'playlist_id', {
                type: DataTypes.STRING(50),
                allowNull: true
            }, { transaction: t });
        });
    },

    down: async (queryInterface, Sequelize) => {
        // Remove the `duration_parsed` column from the `video` table
        await queryInterface.removeColumn('channel', 'playlist_id');
    }
};
