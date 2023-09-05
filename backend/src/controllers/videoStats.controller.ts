import { Request, Response } from "express";

const { Sequelize, QueryTypes } = require('sequelize');
const Op = Sequelize.Op;
import { db, sequelize } from "../util/db";
import { SearchReqQuery } from "./types";
const VideoStats = db.videoStats;

type VideoReqQuery = SearchReqQuery;

export const findAllVideoStatsController = async (
  req: Request<{}, {}, {}, VideoReqQuery>,
  res: Response
) => {
  try {
    let whereClause = {}

    if (req.query.video_ids) {
      var videosArr = req.query.video_ids.split(',');

      whereClause['video_id'] = { [Op.or]: videosArr };
    }

    if (req.query.channels) {
      var channelsArr = req.query.channels.split(',');

      whereClause['channel_id'] = { [Op.or]: channelsArr };
    }


    const videos = await VideoStats.findAll({
      attributes: [
        'video_id',
        [sequelize.fn("DATE", sequelize.col('fetched_at')), "fetched_date"],
        [sequelize.fn("MAX", sequelize.col('views')), "views"],
        [sequelize.fn("MAX", sequelize.col('likes')), "likes"],
        [sequelize.fn("MAX", sequelize.col('comments')), "comments"],
      ], where: whereClause, group: ['video_id', "fetched_date"], order: [['fetched_date', 'asc']],
      raw: true,
    });

    // console.log(videos);

    res.status(200).json({
      status: "success",
      results: videos,
    });
  } catch (error: any) {
    res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
};
