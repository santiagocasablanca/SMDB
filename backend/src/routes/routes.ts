import express from "express";

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
  fetchAllSeries,
  fetchAllTags
} from "../controllers/video.controller";

import { findAllChannelsController } from "../controllers/channel.controller"

const router = express.Router();

router.route("/channels/")
  .get(findAllChannelsController);

router
  .route("/videos/")
  .get(findAllVideosController)
  .post(createVideoController);
router
  .route("/videos/:videoId")
  .get(findVideoController)
  .patch(updateVideoController)
  .delete(deleteVideoController);

router
  .route("/fetchAllSeries/")
  .get(fetchAllSeries);
router
  .route("/fetchAllTags/")
  .get(fetchAllTags);

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


export default router;