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
cron.schedule('37 13 * * *', () => { 
  console.log('schuduled and running');
  const youtubeService = new YoutubeService();
  // youtubeService.fetchStatisticsForAllChannels();

  // const videoMetaService = new VideoMetaService();
  //     videoMetaService.associateTagsToVideos();
})

app.use(
  cors({
    origin: ["http://localhost:3000"],
    credentials: true,
  })
);

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
  //     const youtubeService = new YoutubeService();
  // youtubeService.updateAllCreatorPicturesFromMainChannel();

      //extractRelevantTagsFromTitles();
      // const videoMetaService = new VideoMetaService();
      // videoMetaService.associateTagsToVideos();
    })
  })
  .catch(err => console.log(err));



