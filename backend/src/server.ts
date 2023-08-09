require("dotenv").config();
import express, { Request, Response } from "express";
import morgan from "morgan";
import cors from "cors";
const cron = require('node-cron');
import noteRouter from "./routes/routes";
const YoutubeService = require('./services/youtubeService');
const VideoMetaService = require('./services/videoMetaService');

import { db, sequelize } from "./util/db";

const app = express();

app.use(express.json({ limit: "10kb" }));
if (process.env.NODE_ENV === "development") app.use(morgan("dev"));

const youtubeService = new YoutubeService();
const videoMetaService = new VideoMetaService();

cron.schedule('00 10 * * *', () => {
  console.log('Running fetchStatisticsForAllChannels');
  youtubeService.fetchStatisticsForAllChannels();
})

cron.schedule('40 00 * * *', () => {
  console.log('Fetch latest video and channel statistics Job');
  youtubeService.fetchLatestStatisticsForAllChannels();
})

cron.schedule('00 09 * * *', () => {
  console.log("Associate Tags to Videos Job ");
  videoMetaService.associateTagsToVideos();
})

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

app.get("/v1/healthchecker", (req: Request, res: Response) => {
  res.status(200).json({
    status: "success",
    message: "Build CRUD API with Node.js and Sequelize",
  });
});

app.get("/v1/jobs/latest/run", (req: Request, res: Response) => {
  youtubeService.fetchLatestStatisticsForAllChannels();
  res.status(200).json({
    status: "success",
    message: "Running in backbgound!",
  });
});

app.get("/v1/jobs/tags/run", (req: Request, res: Response) => {
  videoMetaService.associateTagsToVideos();

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

      console.log("Updated!!!")
      // const youtubeService = new YoutubeService();
      // youtubeService.fetchLatestStatisticsForAllChannels()
    
      // youtubeService.updateAllCreatorPicturesFromMainChannel();


      //extractRelevantTagsFromTitles();
      // const videoMetaService = new VideoMetaService();
      // videoMetaService.associateTagsToVideos();
    })
  })
  .catch(err => console.log(err));



