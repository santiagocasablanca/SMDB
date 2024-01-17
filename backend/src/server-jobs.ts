// server-jobs.js
import { db, sequelize } from "./util/db";
import { Redis } from 'ioredis';
const cron = require('node-cron');

const redis = new Redis();
const YoutubeService = require('./services/youtubeService');
const VideoMetaService = require('./services/videoMetaService');

const youtubeService = new YoutubeService();
const videoMetaService = new VideoMetaService();


// Subscribe to the Redis channels
redis.subscribe('runAllJob', 'runLatestJob', 'runTagJob', 'runGameTagsJob');

// Listen for messages from the channels
redis.on('message', async (channel, message) => {
  switch (channel) {
    case 'runAllJob':
      console.log('Running fetchStatisticsForAllChannels Job');
      await youtubeService.fetchStatisticsForAllChannels();
      break;

    case 'runLatestJob':
      console.log('Running fetchLatestStatisticsForAllChannels Job');
      await youtubeService.fetchLatestStatisticsForAllChannels();
      break;

    case 'runTagJob':
      console.log('Running associateTagsToVideos Job');
      await videoMetaService.associateTagsToVideos();
      break;

    case 'runGameTagsJob':
      console.log('Running associateGameTagsToVideos Job');
      await videoMetaService.associateGameTagsToVideos();
      break;

    default:
      console.warn(`Unknown channel: ${channel}`);
  }
});



cron.schedule('00 01 * * *', () => {
  console.log('Running fetchStatisticsForAllChannels');
  youtubeService.fetchStatisticsForAllChannels();
})

cron.schedule('04 16 * * *', () => {
  console.log('Fetch latest video and channel statistics Job');
  youtubeService.fetchLatestStatisticsForAllChannels();
})

cron.schedule('00 12 * * *', () => {
  console.log("Associate Tags to Videos Job ");
  videoMetaService.associateTagsToVideos();
})

db.sequelize
.sync() //{force: true}  {alter: true}
.then(() => {
  console.log("Database connected for CRON JOBS service");
  
})
.catch(err => console.log(err));

// Handle process exit to disconnect from Redis
process.on('exit', () => {
  redis.disconnect();
});
