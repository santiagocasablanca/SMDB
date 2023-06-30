'use strict';
const { v4: uuidv4 } = require('uuid');

module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.bulkInsert('creator', [
            {
                id: uuidv4(),
                name: 'Max Fosh',
                custom_url: '',
                profile_picture: '',
                banner_picture: '',
                created_at: new Date(),
                updated_at: new Date(),
            },
            {
                id: uuidv4(),
                name: 'Cal Freezy',
                custom_url: '',
                profile_picture: '',
                banner_picture: '',
                created_at: new Date(),
                updated_at: new Date(),
            },
            {
                id: uuidv4(),
                name: 'Callux',
                custom_url: '',
                profile_picture: '',
                banner_picture: '',
                created_at: new Date(),
                updated_at: new Date(),
            },
            {
                id: uuidv4(),
                name: 'Chippo',
                custom_url: '',
                profile_picture: '',
                banner_picture: '',
                created_at: new Date(),
                updated_at: new Date(),
            },
            {
                id: uuidv4(),
                name: 'Randolph',
                custom_url: '',
                profile_picture: '',
                banner_picture: '',
                created_at: new Date(),
                updated_at: new Date(),
            },
            {
                id: uuidv4(),
                name: 'JME',
                custom_url: '',
                profile_picture: '',
                banner_picture: '',
                created_at: new Date(),
                updated_at: new Date(),
            },
            {
                id: uuidv4(),
                name: 'Stephen Tries',
                custom_url: '',
                profile_picture: '',
                banner_picture: '',
                created_at: new Date(),
                updated_at: new Date(),
            },
            {
                id: uuidv4(),
                name: '',
                custom_url: '',
                profile_picture: '',
                banner_picture: '',
                created_at: new Date(),
                updated_at: new Date(),
            },
            // Additional creator data
        ]);
    },

    down: async (queryInterface, Sequelize) => {
        await queryInterface.bulkDelete('creator', null, {});
    }
};
