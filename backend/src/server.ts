require("dotenv").config();
import express, { Request, Response } from "express";
import { Redis } from 'ioredis';
import morgan from "morgan";
import cors from "cors";
import noteRouter from "./routes/routes";
import visitorTrackerMiddleware from './middlewares/visitorTracker'; // Adjust the import

// const YoutubeService = require('./services/youtubeService');
// const VideoMetaService = require('./services/videoMetaService');
const InfoService = require('./services/infoService');


import { db, sequelize } from "./util/db";

const app = express();

// Retrieve host and port from environment variables or configuration
const redisHost = process.env.REDIS_HOST || '127.0.0.1';
const redis = new Redis({
  port: 6379,
  host: redisHost
});

app.set('trust proxy', 1);
app.use(express.json({ limit: "10kb" }));
if (process.env.NODE_ENV === "development") app.use(morgan("dev"));

// const youtubeService = new YoutubeService();
// const videoMetaService = new VideoMetaService();
const infoService = new InfoService();


const CLIENT_ORIGIN = process.env.CLIENT_ORIGIN ? process.env.CLIENT_ORIGIN : 'http://localhost:3000';
app.use(
  cors({
    origin: [CLIENT_ORIGIN],
    credentials: false,
  })
);

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", process.env.CLIENT_ORIGIN || "*");
  next();
});

app.use(visitorTrackerMiddleware);

app.get("/v1/healthchecker", (req: Request, res: Response) => {
  res.status(200).json({
    status: "success",
    message: "Build CRUD API with Node.js and Sequelize",
  });
});


app.get("/v1/info", async (req: Request, res: Response) => {

  try {
    const results = await infoService.fetchDBInfo();
    // console.log(results);
    res.status(200).json({
      status: "success",
      results: results[0]
    });
  } catch (error: any) {
    res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
});



app.get("/v1/jobs/all/run", (req: Request, res: Response) => {
  // youtubeService.fetchStatisticsForAllChannels();
  redis.publish('runAllJob', 'Run jobs now!');

  res.status(200).json({
    status: "success",
    message: "Running in backbgound!",
  });
});

app.get("/v1/jobs/latest/run", (req: Request, res: Response) => {
  // youtubeService.fetchLatestStatisticsForAllChannels();
  redis.publish('runLatestJob', 'Run jobs now!');

  res.status(200).json({
    status: "success",
    message: "Running in backbgound!",
  });
});

app.get("/v1/jobs/tags/run", (req: Request, res: Response) => {
  // videoMetaService.associateTagsToVideos();
  redis.publish('runTagJob', 'Run jobs now!');


  res.status(200).json({
    status: "success",
    message: "Running in backbgound!",
  });
});

app.get("/v1/jobs/tags/games/run", (req: Request, res: Response) => {
  // videoMetaService.associateGameTagsToVideos();
  redis.publish('runGameTagsJob', 'Run jobs now!');

  res.status(200).json({
    status: "success",
    message: "Running in backbgound!",
  });
});

app.use("/v1/", noteRouter);


app.all("*", (req: Request, res: Response) => {
  res.status(404).json({
    status: "fail",
    message: `Route: ${req.originalUrl} does not exist on this server`,
  });
});

const PORT = process.env.PORT;

db.sequelize
  .sync() //{force: true}  {alter: true}
  .then(() => {
    console.log("Database connected");
    app.listen(PORT, async () => {
      console.log("listening at port 8005");
    })
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
  