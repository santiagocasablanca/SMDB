import express from "express";
import { validate } from "./middleware/validate";
import {
  createVideoStatsController,
  deleteVideoStatsController,
  findAllVideoStatsController,
  findVideoStatsController,
  updateVideoStatsController,
} from "./videoStats.controller";
import {
  createVideoController,
  deleteVideoController,
  findAllVideosController,
  findMostLikedSSGroupedBySeries,
  fetchVideoFrequency,
  fetchVideoUploadTimeFrequency,
  fetchVideosChannelStats,
  findVideoController,
  updateVideoController,
} from "./video.controller";
import { createVideoSchema, updateVideoSchema } from "./video.schema";
import { createNoteSchema, updateNoteSchema } from "./note.schema";

import { createVideoStatsSchema, updateVideoStatsSchema } from "./videoStats.schema";

import { createChannelSchema, updateChannelSchema } from "./channel.schema";
import { createChannelStatsSchema, updateChannelStatsSchema } from "./channelStats.schema";


const router = express.Router();

router
  .route("/videos/")
  .get(findAllVideosController)
  .post(validate(createVideoSchema), createVideoController);
router
  .route("/videos/:videoId")
  .get(findVideoController)
  .patch(validate(updateVideoSchema), updateVideoController)
  .delete(deleteVideoController);

router
  .route("/findMostLikedSSGroupedBySeries/")
  .get(findMostLikedSSGroupedBySeries);

router
  .route("/fetchVideoFrequency/")
  .get(fetchVideoFrequency);
router
  .route("/fetchVideoUploadTimeFrequency/")
  .get(fetchVideoUploadTimeFrequency);

router
  .route("/fetchVideosChannelStats/")
  .get(fetchVideosChannelStats);
  

router
  .route("/videosStats/")
  .get(findAllVideoStatsController)
  .post(validate(createVideoStatsSchema), createVideoStatsController);
router
  .route("/videoStats/:videoStatsId")
  .get(findVideoStatsController)
  .patch(validate(updateVideoStatsSchema), updateVideoStatsController)
  .delete(deleteVideoStatsController);

export default router;
