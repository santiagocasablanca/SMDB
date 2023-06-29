'use strict';
const { v4: uuidv4 } = require('uuid');

module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.bulkInsert('creator', [
            {
                id: uuidv4(),
                name: 'Chris Dixon',
                custom_url: '@chrismd10',
                profile_picture: 'https://pbs.twimg.com/profile_images/1519273593917652992/-f0YNS2S_400x400.jpg',
                banner_picture: 'https://pbs.twimg.com/profile_banners/384932951/1613394511/1500x500',
                created_at: new Date(),
                updated_at: new Date(),
            },
            {
                id: uuidv4(),
                name: 'Simon Minter',
                custom_url: '@miniminter',
                profile_picture: 'https://pbs.twimg.com/profile_images/1640809891399979008/B3V1ylDx_400x400.jpg',
                banner_picture: 'https://pbs.twimg.com/profile_banners/759823321/1533070643/1500x500',
                created_at: new Date(),
                updated_at: new Date(),
            },
            {
                id: uuidv4(),
                name: 'JJ Olatunji',
                custom_url: '@jjolatunji',
                profile_picture: 'https://yt3.googleusercontent.com/ytc/AGIKgqMbdUKyc4p69enkbMzHPJusDB0zb0_bw08DnkXAgg=s176-c-k-c0x00ffffff-no-rj-mo',
                banner_picture: '',
                created_at: new Date(),
                updated_at: new Date(),
            },
            {
                id: uuidv4(),
                name: 'Joshua Bradley',
                custom_url: '@zerkaa',
                profile_picture: '',
                banner_picture: '',
                created_at: new Date(),
                updated_at: new Date(),
            },
            {
                id: uuidv4(),
                name: 'Vik Barn',
                custom_url: '@vikkstar123',
                profile_picture: '',
                banner_picture: '',
                created_at: new Date(),
                updated_at: new Date(),
            },
            {
                id: uuidv4(),
                name: 'Harry Lewis',
                custom_url: '@w2s',
                profile_picture: '',
                banner_picture: '',
                created_at: new Date(),
                updated_at: new Date(),
            },
            {
                id: uuidv4(),
                name: 'Ethan Payne',
                custom_url: '@behzinga',
                profile_picture: '',
                banner_picture: '',
                created_at: new Date(),
                updated_at: new Date(),
            },
            {
                id: uuidv4(),
                name: 'Tobi Brown',
                custom_url: '@tbjzl',
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
