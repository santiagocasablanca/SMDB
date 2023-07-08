import { Request, Response } from "express";
const dayjs = require('dayjs')
const { Sequelize, QueryTypes } = require('sequelize');
const Op = Sequelize.Op;

import { db, sequelize } from "../util/db";
const Creator = db.creator;
const Channel = db.channel;
const Video = db.video;

export const fetchCreatorController = async (
  req: Request<{}, {}, {}>,
  res: Response
) => {
  try {
    const id = req.params['id'];
    console.log(id);
    const creator = await Creator.findOne({
      where: { id: id },
      include: [{
        model: Channel,
        as: 'channels', attributes: ['channel_id', 'custom_url',
          'title',
          'subs',
          'videos',
          'views',
          'likes',
          'comments',
          'logo_url',
          'banner_url',
          'channel_created_at']
      }, {
        model: Video,
        as: 'videosDirected', attributes: [
          'video_id',
          'title',
          'duration',
          'channel_id',
          'views',
          'likes',
          'comments',
          'url',
          'player',
          'livestream',
          'serie',
          'published_at',
        ]
      }]
    });

    creator.videos = creator.channels.reduce((accumulator, obj) => accumulator + parseInt(obj.videos), 0);
    creator.likes = creator.channels.reduce((accumulator, obj) => accumulator + parseInt(obj.likes), 0);
    creator.subs = creator.channels.reduce((accumulator, obj) => accumulator + parseInt(obj.subs), 0);
    creator.views = creator.channels.reduce((accumulator, obj) => accumulator + parseInt(obj.views), 0);


    res.status(200).json({
      status: "success",
      result: creator,
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
};

export const findAllCreatorsController = async (
  req: Request<{}, {}, {}>,
  res: Response
) => {
  try {
    console.log('creators controller ', req.query, req.params);
    const page = req.query.page || 1;
    const limit = req.query.limit || 10;
    const skip = (page - 1) * limit;

    //sort 
    let sort = req.query.sort ? req.query.sort.split('%') : ['name', 'DESC'];

    const creators = await Creator.findAndCountAll({
      limit, offset: skip, order: [sort], include: [{
        model: Channel,
        as: 'channels', attributes: ['channel_id', 'custom_url',
          'title',
          'subs',
          'videos',
          'views',
          'likes',
          'comments',
          'logo_url',
          'banner_url',
          'channel_created_at']
      }, {
        model: Video,
        as: 'videosDirected', attributes: [
          'video_id',
          'title',
          'duration',
          'channel_id',
          'views',
          'likes',
          'comments',
          'url',
          'player',
          'livestream',
          'serie',
          'published_at',
        ]
      }]
    });
    creators.rows.map((creator) => {
      creator.videos = creator.channels.reduce((accumulator, obj) => accumulator + parseInt(obj.videos), 0);
      creator.likes = creator.channels.reduce((accumulator, obj) => accumulator + parseInt(obj.likes), 0);
      creator.subs = creator.channels.reduce((accumulator, obj) => accumulator + parseInt(obj.subs), 0);
      creator.views = creator.channels.reduce((accumulator, obj) => accumulator + parseInt(obj.views), 0);
    });



    res.status(200).json({
      status: "success",
      count: creators.count,
      results: creators.rows,
    });
  } catch (error: any) {
    res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
};

export const fetchCreatorStatsController = async (
  req: Request<{}, {}, {}>,
  res: Response
) => {
  try {

    console.log('fetchCreatorStatsController     BLA BAL', req.query, req.params);

    const whereClause = {}
    if (req.query.channels) {
      console.log(req.query.channels);
      var channelsArr = req.query.channels.split(',');

      whereClause.channel_id = {
        [Op.or]: channelsArr
      }
    }

    if (req.query.publishedAtRange) {
      let rangeDate = req.query.publishedAtRange.split(',');
      const publishedAtSearchInitial = dayjs(rangeDate[0]).format("YYYY-MM-DD");
      const publishedAtSearchFinal = dayjs(rangeDate[1]).format("YYYY-MM-DD");

      whereClause['published_at'] = { [Sequelize.Op.between]: [publishedAtSearchInitial, publishedAtSearchFinal] };
    }



    const records = await Video.findAll({
      attributes: [
        // [sequelize.literal("video.\"channel_id\""), 'channel'],
        "channel_id",
        "channel_title",
        [sequelize.fn("COUNT", sequelize.col('*')), "total_videos"],
        [sequelize.fn("SUM", sequelize.col('views')), "views"],
        [sequelize.fn("SUM", sequelize.col('likes')), "likes"],
        [sequelize.fn("SUM", sequelize.col('duration_parsed')), "duration"], // string shit
        [sequelize.fn("SUM", sequelize.col('comments')), "comments"],
      ], where: whereClause, group: ['channel_id', 'channel_title']
    });

    res.status(200).json({
      status: "success",
      results: records,
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
};

