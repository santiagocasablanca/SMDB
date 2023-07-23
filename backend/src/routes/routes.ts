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

import { findAllChannelsController, createChannelController } from "../controllers/channel.controller";
import { findAllCreatorsController, fetchCreatorController, fetchCreatorStatsController, findTopCreatorsController, createCreatorController } from "../controllers/creator.controller";

const router = express.Router();

router.route("/channels/")
  .get(findAllChannelsController)
  .post(createChannelController);

router.route("/creators/")
  .get(findAllCreatorsController)
  .post(createCreatorController);
router.route("/creators/:id")
  .get(fetchCreatorController);
router.route("/topCreators")
  .get(findTopCreatorsController);

router.route("/creator/fetchStats")
  .get(fetchCreatorStatsController);

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
