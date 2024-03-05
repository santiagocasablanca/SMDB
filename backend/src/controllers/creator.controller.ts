import { Request, Response } from "express";
const dayjs = require('dayjs')
const { Sequelize, QueryTypes } = require('sequelize');
const Op = Sequelize.Op;

const YoutubeService = require('../services/youtubeService');
const ChannelCreatorService = require('../services/channelCreatorService');
const CreatorService = require('../services/creatorService');

import { db, sequelize } from "../util/db";
import { ChannelsSearchReqQuery, CreatorsSearchReqQuery, SearchReqQuery, AddCreatorQuery } from "./types";
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
      }, {
        model: Video,
        as: 'videosCasted', attributes: [
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
      }
      ]
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
  req: Request<{}, {}, {}, CreatorsSearchReqQuery>,
  res: Response
) => {
  try {
    // console.log('creators controller ', req.query, req.params);
    const page = req.query.page || 1;
    const limit = req.query.limit || 10;
    const skip = (page - 1) * limit;

    //sort 
    let sort = req.query.sort ? req.query.sort.split('%') : ['name', 'ASC'];

    let channelClause = {}

    if (req.query.channels) {
      var channelsArr = req.query.channels.split(',');
      channelClause['channel_id'] = { [Op.in]: channelsArr };
    }

    let creators = await Creator.findAndCountAll({
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
          'channel_created_at'],
        where: channelClause,
        required: false
      }]
    });

    for (const creator of creators.rows) {
      creator.videos = creator.channels.reduce((accumulator, obj) => accumulator + parseInt(obj.videos), 0);
      creator.likes = creator.channels.reduce((accumulator, obj) => accumulator + parseInt(obj.likes), 0);
      creator.subs = creator.channels.reduce((accumulator, obj) => accumulator + parseInt(obj.subs), 0);
      creator.views = creator.channels.reduce((accumulator, obj) => accumulator + parseInt(obj.views), 0);


      if (req.query.publishedAtRange) {

        let rangeDate = req.query.publishedAtRange.split(',');
        const publishedAtSearchInitial = dayjs(rangeDate[0]).format("YYYY-MM-DD");
        const publishedAtSearchFinal = dayjs(rangeDate[1]).format("YYYY-MM-DD");
        const directed = await sequelize.query(
          `
          SELECT COUNT(d.video_id) AS directed_count
          FROM director d
          INNER JOIN video v ON d.video_id = v.video_id
          WHERE d.creator_id = :id
          AND v.published_at BETWEEN :publishedAtSearchInitial AND :publishedAtSearchFinal
          AND v.duration_parsed > :durationParsed
          `,
          {
            replacements: {
              id: creator.id,
              publishedAtSearchInitial: publishedAtSearchInitial,
              publishedAtSearchFinal: publishedAtSearchFinal,
              durationParsed: '69', // Assuming duration_parsed is a string in your database
            },
            type: QueryTypes.SELECT,
          }
        );

        const casted = await sequelize.query(
          `
          SELECT COUNT(vc.video_id) AS casted_count
          FROM video_creator vc
          INNER JOIN video v ON vc.video_id = v.video_id
          WHERE vc.creator_id = :id
          AND v.published_at BETWEEN :publishedAtSearchInitial AND :publishedAtSearchFinal
          AND v.duration_parsed > :durationParsed
          `,
          {
            replacements: {
              id: creator.id,
              publishedAtSearchInitial: publishedAtSearchInitial,
              publishedAtSearchFinal: publishedAtSearchFinal,
              durationParsed: '69', // Assuming duration_parsed is a string in your database
            },
            type: QueryTypes.SELECT,
          }
        );

        const directedCount = (directed[0] as any).directed_count || 0;
        const castedCount = (casted[0] as any)?.casted_count || 0;
        creator.setDataValue('videosDirected', directedCount);
        creator.setDataValue('videosCasted', castedCount);
      }
    };

    res.status(200).json({
      status: "success",
      count: (creators as any).count,
      results: (creators as any).rows,
    });
  } catch (error: any) {
    res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
};

export const findTopCreatorsController = async (
  req: Request<{}, {}, {}, ChannelsSearchReqQuery & { ignoreShorts: boolean }>,
  res: Response) => {
  try {
    const page = req.query.page || 1;
    const limit = req.query.limit || 10;
    const skip = (page - 1) * limit;
    //sort 
    let sort = req.query.sort ? req.query.sort.split('%') : ['name', 'ASC'];

    let channelClause = {}
    let whereClause = {}
    if (req.query.channels) {
      var channelsArr = req.query.channels.split(',');

      channelClause = {
        channel_id: {
          // '$channel_creator.channel_id$': {
          [Op.in]: channelsArr
        }
      }
    }

    if (req.query.publishedAtRange) {
      let rangeDate = req.query.publishedAtRange.split(',');
      const publishedAtSearchInitial = dayjs(rangeDate[0]).format("YYYY-MM-DD");
      const publishedAtSearchFinal = dayjs(rangeDate[1]).format("YYYY-MM-DD");

      whereClause['published_at'] = { [Sequelize.Op.between]: [publishedAtSearchInitial, publishedAtSearchFinal] };
    }
    if (req.query.ignoreShorts) {
      whereClause['duration_parsed'] = { [Sequelize.Op.gt]: '60' };
    }

    const creators = await Creator.findAndCountAll({
      where: whereClause,
      limit, offset: skip, order: [sort], include: [{
        model: Channel,
        required: true,
        as: 'channels', attributes: ['channel_id', 'custom_url',
          'title',
          'subs',
          'videos',
          'views',
          'likes',
          'comments',
          'logo_url',
          'banner_url',
          'channel_created_at'],
        where: channelClause
      }]
    });

    // const creators = await Creator.findAndCountAll({
    //   where: whereClause,
    //   limit, offset: skip, order: [sort], include: [{
    //     model: Channel,
    //     as: 'channels', attributes: ['channel_id', 'custom_url',
    //       'title',
    //       'subs',
    //       'videos',
    //       'views',
    //       'likes',
    //       'comments',
    //       'logo_url',
    //       'banner_url',
    //       'channel_created_at']
    //   }, {
    //   model: Video,
    //   as: 'videosDirected', attributes: [
    //     'video_id',
    //     'title',
    //     'duration',
    //     'channel_id',
    //     'views',
    //     'likes',
    //     'comments',
    //     'url',
    //     'player',
    //     'livestream',
    //     'serie',
    //     'published_at',
    //   ]
    // }]
    // });

    res.status(200).json({
      status: "success",
      count: creators.count,
      results: creators.rows,
    });


  } catch (error) {
    res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
}

export const createCreatorController = async (
  req: Request,
  res: Response) => {

  try {
    console.log('STARTING: ', req.body);
    const channel_ids = req.body.channel_ids;
    const name = req.body.name;
    const custom_url = req.body.custom_url;
    const profile_picture = req.body.profile_picture;
    const banner_picture = req.body.banner_picture;

    const youtubeService = new YoutubeService();
    const creatorService = new CreatorService();
    const channelCreatorService = new ChannelCreatorService();

    const creator = await creatorService.create(name, custom_url, profile_picture, banner_picture);
    for (const id of channel_ids) {
      console.log('id: ', id);
      console.log('creator_id: ', creator.id);
      const channel = await youtubeService.fetchChannelAndVideoData(id);
      console.log('channel: ', channel.channel_id);
      await channelCreatorService.associateWithCreatorWithChannel(
        channel.channel_id,
        creator.id
      );
    }

    res.status(200).json({
      status: "onGoing",

    });

    console.log('FINISHED')

  } catch (error) {
    res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
}

export const fetchCreatorStatsController = async (
  req: Request<{}, {}, {}, ChannelsSearchReqQuery & { ignoreShorts: boolean }>,
  res: Response
) => {
  try {
    let whereClause = {}
    if (req.query.channels) {
      console.log(req.query.channels);
      var channelsArr = req.query.channels.split(',');

      whereClause = {
        channel_id: {
          [Op.or]: channelsArr
        }
      }
    }

    if (req.query.publishedAtRange) {
      let rangeDate = req.query.publishedAtRange.split(',');
      const publishedAtSearchInitial = dayjs(rangeDate[0]).format("YYYY-MM-DD");
      const publishedAtSearchFinal = dayjs(rangeDate[1]).format("YYYY-MM-DD");

      whereClause['published_at'] = { [Sequelize.Op.between]: [publishedAtSearchInitial, publishedAtSearchFinal] };
    }
    if (req.query.ignoreShorts) {
      whereClause['duration_parsed'] = { [Sequelize.Op.gt]: '60' };
    }


    const records = await Video.findAll({
      attributes: [
        // [sequelize.literal("video.\"channel_id\""), 'channel'],
        "channel_id",
        "channel_title",
        [sequelize.fn("COUNT", sequelize.col('*')), "total_videos"],
        [sequelize.fn("SUM", sequelize.col('views')), "views"],
        [sequelize.fn("MAX", sequelize.col('views')), "most_viewed"],
        [sequelize.fn("MIN", sequelize.col('views')), "least_viewed"],
        [sequelize.fn("SUM", sequelize.col('likes')), "likes"],
        [sequelize.fn("MAX", sequelize.col('likes')), "most_liked"],
        [sequelize.fn("MIN", sequelize.col('likes')), "least_liked"],
        [sequelize.fn("SUM", sequelize.col('duration_parsed')), "duration"],
        [sequelize.fn("MAX", sequelize.col('duration_parsed')), "longest"],
        [sequelize.fn("MIN", sequelize.col('duration_parsed')), "shortest"],
        [sequelize.fn("SUM", sequelize.col('comments')), "comments"],
        [sequelize.fn("MAX", sequelize.col('comments')), "most_commented"],
        [sequelize.fn("MIN", sequelize.col('comments')), "least_commented"],
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

