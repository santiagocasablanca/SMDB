import { Request, Response } from "express";
const dayjs = require('dayjs')
const { Sequelize, QueryTypes } = require('sequelize');
const Op = Sequelize.Op;

import { db, sequelize } from "../util/db";
const Creator = db.creator;
const Channel = db.channel;


export const findAllCreatorsController = async (
  req: Request<{}, {}, {}>,
  res: Response
) => {
  try {

    const page = req.query.page || 1;
    const limit = req.query.limit || 10;
    const skip = (page - 1) * limit;

    //sort 
    let sort = req.query.sort ? req.query.sort.split('%') : ['name', 'DESC'];

    // const whereClause = {}
    // if (req.query.channels) {
    //   console.log(req.query.channels);
    //   var channelsArr = req.query.channels.split(',');

    //   whereClause.title = {
    //     [Op.or]: channelsArr
    //   }
    // }
    // if(req.query.title) {
    //   const searchTitle = req.query.title.toLowerCase();
    //   const lowerTitleCol = Sequelize.fn('lower', Sequelize.col('title'));
    //   whereClause['title'] = Sequelize.where(Sequelize.fn('LOWER', Sequelize.col('title')), 'LIKE', '%' + searchTitle + '%');
    // }

    // console.log(whereClause);

    const creators = await Creator.findAndCountAll({ limit, offset: skip, order: [sort], include: ['channels', 'videosDirected']});
    creators.rows.map(creator => console.log(JSON.stringify(creator)));

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

