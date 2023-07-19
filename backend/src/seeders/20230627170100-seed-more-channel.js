'use strict';
// const YoutubeService = require('../services/youtubeService');
const { QueryTypes, DataTypes } = require('sequelize');


const channels_urls = [
  {
    custom_url: '@MaxFosh',
    channel_ids: ['UCb31gOY6OD8ES0zP8M0GhAw'],
  },
  {
    custom_url: '@Calfreezy',
    channel_ids: ['UC9-3c4LzdzT_HvW3Xuti9wg', 'UCUdbjgmjNXrgM0TdGDJJnlQ', 'UCUucWR3OvzlZ4d9qLikokgw', 'UCmJz1oHXTINwG_Vv0NGFVoA']
  },
  {
    custom_url: '@Callux',
    channel_ids: ['UCmpWLoKQBVd5YPz0cYan_Xg']
  },
  {
    custom_url: '@TheBurntChipHD',
    channel_ids: ['UCTSCvnsxOcoknftrqdXQzyg', 'UCuMVy-cfz29-qSMxz0ZbzcQ', 'UCUucWR3OvzlZ4d9qLikokgw', 'UCmJz1oHXTINwG_Vv0NGFVoA']
  },
  {
    custom_url: '@RandolphUK',
    channel_ids: ['UCPwrSW0HPiba4lu1DW_zdjA', 'UC0P_148sT5v0SQHgfaUXh4w', 'UCFPElAbES8GHfBZrDrGbSLQ']
  },
  {
    custom_url: '@ManBetterKnow',
    channel_ids: ['UCAsptD_XMmQdzRxlkWkEd_A']
  },
  {
    custom_url: '@StephenTries',
    channel_ids: ['UCRmmd8tl3sT96cqDynL4Qgg', 'UCKI_nC8ZYng9JmLcRbu1V_w', 'UCTGRVqd_Qe5SReK89Fw7eLg']
  }
];

const apiKey = 'AIzaSyA9IHgl5-gGaQYpN01q2TiYcF5mKw6TQ8A';

async function fetchChannelDataFromAPI(channelId) {
  const url = `https://www.googleapis.com/youtube/v3/channels?part=snippet,contentDetails,statistics,brandingSettings&id=${channelId}&key=${apiKey}`;
  console.log('calling YOUTUBE API: ', url);
  let response = await fetch(url);
  console.log(response)
  return response.json();
};

async function fetchChannelData(channelId, queryInterface, t) {
  // Fetch channel data using the YouTube API
  const data = await fetchChannelDataFromAPI(channelId);

  // const channelId = data.items[0].id;
  const channelTitle = data.items[0].snippet.title;
  const channelDescription = data.items[0].snippet.description;
  const viewCount = data.items[0].statistics.viewCount;
  const subscriberCount = data.items[0].statistics.subscriberCount;
  const videoCount = data.items[0].statistics.videoCount;
  const logo = data.items[0].snippet.thumbnails.high.url;
  const banner = data.items[0].brandingSettings.image ? data.items[0].brandingSettings.image.bannerExternalUrl : null;
  const playlistId = data.items[0].contentDetails.relatedPlaylists.uploads;


  // Store channel data in the database
  await queryInterface.bulkInsert('channel', [{
    'channel_id': channelId,
    'title': channelTitle,
    'description': channelDescription,
    'views': viewCount,
    'subs': subscriberCount,
    'videos': videoCount,
    'logo_url': logo,
    'banner_url': banner,
    'playlist_id': playlistId,
    'custom_url': data.items[0].snippet.customUrl,
    'created_at': new Date(),
    'updated_at': new Date()
  }, {
    transaction: t
  }]);
  await queryInterface.bulkInsert('channelStats', [{
    'channel_id': channelId,
    'views': viewCount,
    'subs': subscriberCount,
    'videos': videoCount,
    'fetched_at': new Date(),
    created_at: new Date(),
    updated_at: new Date()
  }, {
    transaction: t
  }]);
};

async function associateChannelCreator(channel_id, creator_url, queryInterface, t) {
  console.log('ndhs')
  return await queryInterface.bulkInsert('channel_creators', [{
    channel_id: channel_id,
    creator_id: await queryInterface.sequelize.literal(
      'SELECT id FROM creator where custom_url in (:url)',
      {
        type: QueryTypes.SELECT,
        replacements: { url: creator_url },
      }
    )
  }, {
    transaction: t
  }]);
};

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return new Promise(async (resolve, reject) => {
      await queryInterface.sequelize.transaction(async (t) => {
        // console.log(channels_urls);

        await channels_urls.map(async (creator) => {
          const url = creator.custom_url;


          // console.log('lldjdj')
          // Fetch all video records

          creator.channel_ids.map(async channel_id => {
            console.log(channel_id);
            const wtv = await fetchChannelData(channel_id, queryInterface, t);
            console.log(wtv)
            await associateChannelCreator(channel_id, url, queryInterface, t);
          })

          // console.log('lldls')
          // const updatePromises = videoRecords.map(async (record) => {
          //   const parsedDuration = await parseDuration(record.duration);
          //   console.log(parsedDuration)
          //   console.log(record.video_id)
          //   const query = `UPDATE video SET duration_parsed = ${parsedDuration} WHERE video_id = '${record.video_id}'`;
          //   console.log(query);
          //   return queryInterface.sequelize.query(
          //     query,
          //     { transaction: t } // Pass the transaction object to the query
          //   );
          // });
        });
      });
      resolve('Done');
    })
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('', null, {});
  }
};




