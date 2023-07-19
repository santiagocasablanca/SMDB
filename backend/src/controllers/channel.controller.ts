import { Request, Response } from "express";
const dayjs = require('dayjs')
const { Sequelize, QueryTypes } = require('sequelize');
const Op = Sequelize.Op;
const YoutubeService = require('../services/youtubeService');
const ChannelCreatorService = require('../services/channelCreatorService');


import { db, sequelize } from "../util/db";
import { ChannelsSearchReqQuery } from "./types";
const Channel = db.channel;

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
    if (req.query.channels) {
      console.log(req.query.channels);
      var channelsArr = req.query.channels.split(',');

      whereClause = {
        title: {
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
  } catch (error: any) {
    res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
};

export const createChannelController = async (
  req: Request<{}, {}, {}>,
  res: Response
) => {
  try {
    console.log('STARTING');
    console.log(req.body);
    const channel_ids = req.body.channel_ids;
    const creator_id = req.body.creator_id;

    res.status(200).json({
      status: "onGoing",

    });

    console.log(channel_ids, creator_id);
    const youtubeService = new YoutubeService();
    const channelCreatorService = new ChannelCreatorService();

    for (const id of channel_ids) {
      console.log(id);
      const channel = await youtubeService.fetchChannelAndVideoData(id);
      console.log('controller channel: ', channel);
      await channelCreatorService.associateWithCreatorWithChannel(
        id,
        creator_id
      );
    }

    console.log('FINISHED')

  } catch (error) {
    res.status(500).json({
      status: "error",
      message: error.message,
    });
  }

};