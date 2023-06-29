'use strict';
const { v4: uuidv4 } = require('uuid');

async function fetchChannelInfo(_channel_id) {
    try {
        const url = `https://www.googleapis.com/youtube/v3/channels?part=snippet,statistics,brandingSettings&id=${_channel_id}&key=${apiKey}`;
        let response = await fetch(url);

        let data = await response.json();
        return data.items[0];

    } catch (error: any) {
        console.log(error);
    }
}

const channel_ids = [
    "UCDogdKl7t7NHzQ95aEwkdMw", // Sidemen
    "UCh5mLn90vUaB1PbRRx_AiaA", // MoreSidemen
    "UCjRkTl_HP4zOh3UFaThgRZw", // SidemenReacts
    "UCWZmCMB7mmKWcXJSIPRhzZw", // https://www.youtube.com/@Miniminter,  https://pbs.twimg.com/profile_images/1640809891399979008/B3V1ylDx_400x400.jpg
    "UCjB_adDAIxOL8GA4Y4OCt8g", // https://www.youtube.com/@MM7Games, 
    "UCFPElAbES8GHfBZrDrGbSLQ", // https://www.youtube.com/@Whatsgoodpodcast, 
    "UCPwrSW0HPiba4lu1DW_zdjA", // https://www.youtube.com/@RandolphUK, 
    // "UC0P_148sT5v0SQHgfaUXh4w", // https://www.youtube.com/@Randolph2 https://www.youtube.com/channel/
    // "UChntGq8THlUokhc1tT-M2wA", // Zerkaa 
    // "UCst9GLZ-X47MxWBmx9cCrKA", // zerkaaPlays
    // "UCmVhkn3V5He-ONb4wUNRcwg", // zerkaaclips
    // "UCk5azh7kjYWMkWQsLrqn_9w", // zerkaaShorts
    // "UCVtFOytbRpEvzLjvqGG5gxQ", // KSI
    // "UCGmnsW623G1r-Chmo5RB4Yw", // @jjolatunji
    // "UCHhfSXoDG6gSgpOvLH4wrRw", // Behzinga 
    // "UCbzZFTHge5zk2yebSiWRZRg", // bez2inga
    // "UCoxQK18ZYanKJGjHP5wdrJw", // BehzingaShorts 
    // "UCvwgF_0NOZe2vN4Q3g1bY-A", // Vikkstar123 
    // "UCmbnlwXAdGYACzvStDjquaA", // Vikkstar123HD 
    // "UCBXG9Hl9f94Zfoceh1a8otQ", // VikkstarPlays
    // "UC0OevbYhRrD3UP1jJlYB7qw", // vikstarrshorts
    // "UCfNWN9s_s8kRTCadk04WWJA", // TBJZL
    // "UCVa7nsA_blpxzmfZWTPEsLQ", // TBJZLPlays 
    // "UCHzt25lbU7zmU4PwMMRf16A", // TBJZLClips 
    // "UCjtLOfx1yt1NlnFIDyAX3Ug", // W2S
    // "UC5_IT4-XpinnvNQwM1e15eQ", // W2S+ 
    // "UC9-3c4LzdzT_HvW3Xuti9wg", // Calfreezy 
    // "UCQ-YJstgVdAiCT52TiBWDbg"  // Chrismd   https://pbs.twimg.com/profile_images/1519273593917652992/-f0YNS2S_400x400.jpg https://pbs.twimg.com/profile_banners/384932951/1613394511/1500x500
  ];

module.exports = {
    up: async (queryInterface, Sequelize) => {
        channel_ids.forEach(channel => {
            console.log('heres')
            const channelId = channel.id;
            const channel_title = channel.snippet.title;
            const channelDescription = channel.snippet.description;
            const viewCount = channel.statistics.viewCount;
            const subscriberCount = channel.statistics.subscriberCount;
            const videoCount = channel.statistics.videoCount;
            const logo = channel.snippet.thumbnails.medium.url;
            const createdAt = channel.snippet.publishedAt;
            const banner = channel.brandingSettings.image ? channel.brandingSettings.image.bannerExternalUrl : null;
        
            await Channel.findOrCreate({
              defaults: {
                'channel_id': _channel_id,
                'title': channel_title,
                'description': channelDescription,
                'views': viewCount,
                'subs': subscriberCount,
                'videos': videoCount,
                'logo_url': logo,
                'custom_url': channel.snippet.customUrl,
                'banner_url': banner,
                'channel_created_at': createdAt
              },
              where: { channel_id: _channel_id }
            });
        
            await ChannelStats.create({
              'channel_id': _channel_id,
              'views': viewCount,
              'subs': subscriberCount,
              'videos': videoCount,
              'fetched_at': new Date()
            });
        })
    },

    down: async (queryInterface, Sequelize) => {
        await queryInterface.bulkDelete('channel', null, {});
    }
};




