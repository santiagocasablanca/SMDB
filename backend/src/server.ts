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

// 11am
// cron.schedule('00 00 * * *', () => {
//   console.log('schuduled and running');
//   const youtubeService = new YoutubeService();
//   youtubeService.fetchStatisticsForAllChannels();
// })

cron.schedule('40 00 * * *', () => {
  console.log('Fetch latest video and channel statistics Job');
  const youtubeService = new YoutubeService();
  youtubeService.fetchLatestStatisticsForAllChannels();
})

cron.schedule('00 14 * * *', () => {
  console.log("Associate Tags to Videos Job ")
  // const videoMetaService = new VideoMetaService();
  // videoMetaService.associateTagsToVideos();
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

app.get("/api/healthchecker", (req: Request, res: Response) => {
  res.status(200).json({
    status: "success",
    message: "Build CRUD API with Node.js and Sequelize",
  });
});

app.use("/api/", noteRouter);

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
      const youtubeService = new YoutubeService();
      youtubeService.fetchLastestStatisticsForAllChannels();
    
      // youtubeService.updateAllCreatorPicturesFromMainChannel();


      //extractRelevantTagsFromTitles();
      const videoMetaService = new VideoMetaService();
      videoMetaService.associateTagsToVideos();
    })
  })
  .catch(err => console.log(err));



