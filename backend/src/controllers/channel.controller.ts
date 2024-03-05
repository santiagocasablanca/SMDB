import { Request, Response } from "express";
const dayjs = require('dayjs')
const { Sequelize, QueryTypes } = require('sequelize');
const Op = Sequelize.Op;
const YoutubeService = require('../services/youtubeService');
const ChannelCreatorService = require('../services/channelCreatorService');


import { db, sequelize } from "../util/db";
import { ChannelsSearchReqQuery } from "./types";
const Channel = db.channel;
const Creator = db.creator;

export const fetchChannelController = async (
  req: Request<{}, {}, {}>,
  res: Response
) => {
  try {
    const id = req.params['id'];
    // console.log(id);
    const channel = await Channel.findOne({
      where: { channel_id: id },
      include: [{
        model: Creator,
        as: 'creators', attributes: ['id', 'custom_url',
          'name',
          'profile_picture']
      }]
    })

    if(channel) {
      res.status(200).json({
        status: "success",
        result: channel,
      });
    } else {
      res.status(404).json({
        status: "error",
        result: 'Channel not found',
      });
    }

  } catch (error) {
    res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
};

export const findAllChannelsController = async (
  req: Request<any, any, any, ChannelsSearchReqQuery>,
  res: Response
) => {
  try {

    const page = req.query.page || 1;
    const limit = req.query.limit || 10;
    const skip = (page - 1) * limit;

    //sort 
    let sort = req.query.sort ? req.query.sort.split('%') : ['title', 'DESC'];

    let whereClause = {}
    if (req.query.title) {
      whereClause = {
        title: {
          [Op.iLike]: `%${req.query.title}%`
        }
      }
    }

    if (req.query.channels) {
      // console.log(req.query.channels);
      var channelsArr = req.query.channels.split(',');

      whereClause = {
        channel_id: {
          [Op.or]: channelsArr
        }
      }
    }
    // if(req.query.title) {
    //   const searchTitle = req.query.title.toLowerCase();
    //   const lowerTitleCol = Sequelize.fn('lower', Sequelize.col('title'));
    //   whereClause['title'] = Sequelize.where(Sequelize.fn('LOWER', Sequelize.col('title')), 'LIKE', '%' + searchTitle + '%');
    // }

    // console.log(whereClause);

    const channels = await Channel.findAndCountAll({ where: whereClause, limit, offset: skip, order: [sort] });
    // console.log(videos);

    res.status(200).json({
      status: "success",
      count: channels.count,
      results: channels.rows,
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
};


export const findAllGuestsController = async (
  req: Request<any, any, any, ChannelsSearchReqQuery>,
  res: Response
) => {
  try {
    let channel_Ids;
    if (req.query.channels) {
      // console.log(req.query.channels);
      var channelsArr = req.query.channels.split(',');

      channel_Ids = channelsArr
    }
    const records = await sequelize.query("SELECT c.id, c.name, c.profile_picture, COUNT(DISTINCT _cast.video_id) AS guest_count " +
      " FROM creator c " +
      " JOIN video_Creator _cast ON c.id = _cast.creator_id " +
      " WHERE _cast.video_id IN (" +
      "        SELECT video_id" +
      "        FROM video _video" +
      "        WHERE channel_id in (:channel_Ids) " +
      "    )" +
      "    AND c.id NOT IN (" +
      "        SELECT creator_id" +
      "        FROM channel_creator" +
      "        WHERE channel_id in (:channel_Ids)" +
      "    )" +
      "    GROUP BY" +
      "    c.id, c.name ",
      {
        replacements: { channel_Ids: channel_Ids },
        // bind: { initial: '2010-05-23 23:00:00.000 +00:00', final: '2023-06-23 23:00:00.000 +00:00', orderBy: 'likes desc' },
        type: QueryTypes.SELECT,
        logging: console.log,
        raw: true,

      }
    );

    res.status(200).json({
      status: "success",
      results: records,
      count: records.length,
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
};

export const createChannelController = async (
  req: Request<any, any, any, ChannelsSearchReqQuery>,
  res: Response
) => {
  try {
    // console.log('STARTING');
    const channel_ids = req.body.channel_ids;
    const creator_id = req.body.creator_id;

    res.status(200).json({
      status: "onGoing",

    });

    // console.log(channel_ids, creator_id);
    const youtubeService = new YoutubeService();
    const channelCreatorService = new ChannelCreatorService();

    for (const id of channel_ids) {
      // console.log(id);
      const channel = await youtubeService.fetchChannelAndVideoData(id);
      await channelCreatorService.associateWithCreatorWithChannel(
        id,
        creator_id
      );
    }

    // console.log('FINISHED')

  } catch (error) {
    res.status(500).json({
      status: "error",
      message: error.message,
    });
  }

};