import express from "express";
import apiKeyAuth from '../middlewares/apiKeyAuth'; // Import the API key middleware

import {
  findAllVideosController,
  findMostLikedSSGroupedBySeries,
  fetchVideoFrequency,
  fetchVideoUploadTimeFrequency,
  fetchVideosChannelStats,
  updateVideoController,
  fetchAllSeries,
  fetchAllTags,
  fetchVideoController,
  findAllVideoGuestsController,
  findAllAppearencesController
} from "../controllers/video.controller";

import { fetchChannelController, findAllChannelsController, createChannelController, findAllGuestsController } from "../controllers/channel.controller";
import { findAllCreatorsController, fetchCreatorController, fetchCreatorStatsController, findTopCreatorsController, createCreatorController } from "../controllers/creator.controller";

const router = express.Router();

router.route("/channels/")
  .get(findAllChannelsController)
  .post(createChannelController);
router.route("/channels/:id")
  .get(fetchChannelController);
  

router.route("/creators/")
  .get(findAllCreatorsController)
  .post(apiKeyAuth, createCreatorController);
router.route("/creators/:id")
  .get(fetchCreatorController);
router.route("/topCreators")
  .get(findTopCreatorsController);

router.route("/creator/fetchStats")
  .get(fetchCreatorStatsController);

router
  .route("/videos/")
  .get(findAllVideosController);
router
  .route("/appearences/")
  .get(findAllAppearencesController);

  router
  .route("/guests/")
  .get(findAllVideoGuestsController);
  // findAllGuestsController
  // .get(findAllVideoGuestsController);

router
  .route("/videos/:id")
  .get(fetchVideoController)
  .patch(apiKeyAuth, updateVideoController);
  // .delete(deleteVideoController);

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
