'use strict';

const { QueryTypes, DataTypes } = require('sequelize');

async function parseDuration(durationString) {
    const regex = /PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/;
    const matches = durationString.match(regex);
    const hours = matches[1] ? parseInt(matches[1]) : 0;
    const minutes = matches[2] ? parseInt(matches[2]) : 0;
    const seconds = matches[3] ? parseInt(matches[3]) : 0;
    return hours * 3600 + minutes * 60 + seconds;
}

module.exports = {
    up: async (queryInterface, Sequelize) => {
        return queryInterface.sequelize.transaction(async (t) => {
            await queryInterface.addColumn('video', 'duration_parsed', {
                type: DataTypes.INTEGER,
                allowNull: true
            }, { transaction: t });

            // Fetch all video records
            const videoRecords = await queryInterface.sequelize.query(
                'SELECT * FROM video',
                {
                    type: QueryTypes.SELECT,
                    transaction: t // Pass the transaction object to the query
                }
            );

            // Update each video record with the parsed duration
            const updatePromises = videoRecords.map(async (record) => {
                const parsedDuration = await parseDuration(record.duration);
                console.log(parsedDuration)
                console.log(record.video_id)
                const query = `UPDATE video SET duration_parsed = ${parsedDuration} WHERE video_id = '${record.video_id}'`;
                 console.log(query);
                return queryInterface.sequelize.query(
                    query,
                    { transaction: t } // Pass the transaction object to the query
                );
            });

            await Promise.all(updatePromises);
        });
    },

    down: async (queryInterface, Sequelize) => {
        // Remove the `duration_parsed` column from the `video` table
        await queryInterface.removeColumn('video', 'duration_parsed');
    }
};
