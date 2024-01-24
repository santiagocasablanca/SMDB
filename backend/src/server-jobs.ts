// server-jobs.js
import { db, sequelize } from "./util/db";
import { Redis } from 'ioredis';
const cron = require('node-cron');

const YoutubeService = require('./services/youtubeService');
const VideoMetaService = require('./services/videoMetaService');

const youtubeService = new YoutubeService();
const videoMetaService = new VideoMetaService();


// Subscribe to the Redis channels
const redisHost = process.env.REDIS_HOST || '127.0.0.1';
const redis = new Redis({
  port: 6379,
  host: redisHost
});

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
  console.log('Running fetchStatisticsForAllChannels', new Date());
  // youtubeService.fetchStatisticsForAllChannels();
})

cron.schedule('04 16 * * *', () => {
  console.log('Fetch latest video and channel statistics Job 16h', new Date());
  youtubeService.fetchLatestStatisticsForAllChannels();
})

cron.schedule('04 19 * * *', () => {
  console.log('Fetch latest video and channel statistics Job 19h', new Date());
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

let cleanupPerformed = false;

// Handle Ctrl+C or SIGINT (Signal Interrupt)
process.on('SIGINT', async () => {
  if (!cleanupPerformed) {
    console.log('Received SIGINT. Cleaning up and exiting...');
    
    // Perform any cleanup operations here
    await redis.disconnect(); // Disconnect from Redis

    // Set the flag to true to indicate cleanup is performed
    cleanupPerformed = true;

    // Exit the process
    process.exit();
  }
});

// Handle unhandled exceptions
process.on('unhandledRejection', async (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);

  if (!cleanupPerformed) {
    // Perform any cleanup operations here
    await redis.disconnect(); // Disconnect from Redis

    // Set the flag to true to indicate cleanup is performed
    cleanupPerformed = true;

    // Exit the process with an error code
    process.exit(1);
  }
});

// Handle process exit to disconnect from Redis
process.on('exit', async () => {
  if (!cleanupPerformed) {
    console.log('Exiting. Cleaning up...');

    // Perform any cleanup operations here
    await redis.disconnect(); // Disconnect from Redis

    // Set the flag to true to indicate cleanup is performed
    cleanupPerformed = true;
  }
});

