import { Request, Response } from "express";
const dayjs = require('dayjs')
const { Sequelize, QueryTypes } = require('sequelize');
const Op = Sequelize.Op;

import { db, sequelize } from "../util/db";
import { ChannelsReqQuery, ChannelsSearchReqQuery, VideosSearchReqQuery, SearchReqQuery } from "./types";
const Video = db.video;
const Channel = db.channel;
const Creator = db.creator;

export const createVideoController = async (
  req: Request<{}, {}>,
  res: Response
) => {
  try {
    const { title, content, category, published } = req.body;

    const video = await Video.create({
      title,
      content,
      category,
      published,
    });

    res.status(201).json({
      status: "success",
      data: {
        video,
      },
    });
  } catch (error: any) {
    if (error.name === "SequelizeUniqueConstraintError") {
      return res.status(409).json({
        status: "failed",
        message: "Video with that title already exists",
      });
    }

    res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
};

export const updateVideoController = async (
  req: Request,
  res: Response
) => {
  try {
    const result = await Video.update(
      { ...req.body, updatedAt: Date.now() },
      {
        where: {
          id: req.params.video_id,
        },
      }
    );

    if (result[0] === 0) {
      return res.status(404).json({
        status: "fail",
        message: "Video with that ID not found",
      });
    }

    const video = await Video.findByPk(req.params.video_id);

    res.status(200).json({
      status: "success",
      data: {
        video,
      },
    });
  } catch (error: any) {
    res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
};

export const findVideoController = async (
  req: Request,
  res: Response
) => {
  try {
    const video = await Video.findByPk(req.params.video_id);

    if (!video) {
      return res.status(404).json({
        status: "fail",
        message: "Video with that ID not found",
      });
    }

    res.status(200).json({
      status: "success",
      data: {
        video,
      },
    });
  } catch (error: any) {
    res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
};
// :orderBy
export const findMostLikedSSGroupedBySeries = async (
  req: Request,
  res: Response
) => {
  try {

    const records = await sequelize.query("select serie, count(*) as videos, sum(views) as views, sum(likes) as likes, sum(comments) as comments" +
      " from video v where channel_title = 'Sidemen' and serie is not null and published_at BETWEEN (:initial) AND (:final) GROUP By v.serie order by likes desc ",
      {
        replacements: { initial: '2010-05-23 23:00:00.000 +00:00', final: '2023-06-23 23:00:00.000 +00:00', orderBy: 'likes desc' },
        // bind: { initial: '2010-05-23 23:00:00.000 +00:00', final: '2023-06-23 23:00:00.000 +00:00', orderBy: 'likes desc' },
        type: QueryTypes.SELECT,
        logging: console.log,
        raw: true,

      }
    );
    // console.log(JSON.stringify(records));
    res.status(200).json({
      status: "success",
      results: records,
    });
  } catch (error: any) {
    res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
}

export const fetchAllSeries = async (
  req: Request,
  res: Response
) => {
  try {

    const records = await sequelize.query("select distinct(serie) from video v",
      {
        type: QueryTypes.SELECT,
        logging: console.log,
        raw: true,
      }
    );
    // console.log(JSON.stringify(records));
    res.status(200).json({
      status: "success",
      results: records,
    });
  } catch (error: any) {
    res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
}

export const fetchAllTags = async (
  req: Request,
  res: Response
) => {
  try {

    const records = await sequelize.query("select distinct tags from video v",
      {
        type: QueryTypes.SELECT,
        logging: console.log,
        raw: true,
      }
    );
    // console.log(JSON.stringify(records));
    res.status(200).json({
      status: "success",
      results: records,
    });
  } catch (error: any) {
    res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
}

export const fetchVideoFrequency = async (
  req: Request<any, any, any, VideosSearchReqQuery>,
  res: Response
) => {
  try {


    let excludeShorts = req.query.excludeShorts ? req.query.excludeShorts : true;


    //     SELECT
    //   DATE(v."publishedAt") AS day, COUNT(*) AS frequency, SUM(views) AS total_views, SUM(likes) AS total_likes, SUM(comments) AS total_comments
    // FROM
    //   videos v
    // GROUP BY
    //   DATE(v."publishedAt")
    // ORDER BY 
    //  day
    let sort = req.query.sort ? req.query.sort.split('%') : ['day', 'ASC'];
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

    if (excludeShorts) {
      whereClause['duration_parsed'] = { [Sequelize.Op.gt]: ['1064'] };
    } else {

    }

    // console.log(JSON.stringify(whereClause));
    const records = await Video.findAll({
      attributes: [
        [sequelize.fn("DATE", sequelize.col('published_at')), "day"],
        [sequelize.fn("COUNT", sequelize.col('*')), "frequency"],
        [sequelize.fn("SUM", sequelize.col('views')), "views"],
        [sequelize.fn("SUM", sequelize.col('likes')), "likes"],
        [sequelize.fn("SUM", sequelize.col('comments')), "comments"],
      ], where: whereClause, group: 'day', order: [sort]
    });

    res.status(200).json({
      status: "success",
      results: records,
    });
  } catch (error: any) {
    res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
}

export const fetchVideosChannelStats = async (
  req: Request<{}, {}, {}, VideosSearchReqQuery>,
  res: Response
) => {
  try {


    let excludeShorts = req.query.excludeShorts ? req.query.excludeShorts : true;


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

    if (excludeShorts) {
      whereClause['duration_parsed'] = { [Sequelize.Op.gt]: ['1064'] };
    } else {

    }

    console.log(JSON.stringify(whereClause));
    const records = await Video.findAll({
      attributes: [
        // [sequelize.literal("video.\"channel_id\""), 'channel'],
        "channel_id",
        "channel_title",
        [sequelize.fn("COUNT", sequelize.col('*')), "total_videos"],
        [sequelize.fn("SUM", sequelize.col('views')), "views"],
        [sequelize.fn("SUM", sequelize.col('likes')), "likes"],
        [sequelize.fn("SUM", sequelize.col('comments')), "comments"],
      ], where: whereClause, group: ['channel_id', 'channel_title']
    });

    res.status(200).json({
      status: "success",
      results: records,
    });
  } catch (error: any) {
    res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
}


export const fetchVideoUploadTimeFrequency = async (
  req: Request<{}, {}, {}, VideosSearchReqQuery>,
  res: Response
) => {
  try {


    let excludeShorts = req.query.excludeShorts ? req.query.excludeShorts : true;


    // SELECT
    // EXTRACT(DOW FROM "video"."publishedAt") AS week_day,
    // EXTRACT(HOUR FROM "video"."publishedAt") AS upload_hour,
    // COUNT(*) AS frequency
    // FROM
    // videos as "video"
    // GROUP BY
    // week_day, upload_hour
    // ORDER BY
    // week_day, upload_hour;
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

    if (excludeShorts) {
      whereClause['duration_parsed'] = { [Sequelize.Op.gt]: ['1064'] };
    } else {

    }

    console.log(JSON.stringify(whereClause));
    const records = await Video.findAll({
      attributes: [
        [sequelize.literal("EXTRACT(DOW FROM video.published_at)"), 'week_day'],
        [sequelize.literal("EXTRACT(HOUR FROM video.published_at)"), 'upload_hour'],
        [sequelize.fn("COUNT", sequelize.col('*')), "frequency"],
        [sequelize.fn("SUM", sequelize.col('views')), "views"],
        [sequelize.fn("SUM", sequelize.col('likes')), "likes"],
        [sequelize.fn("SUM", sequelize.col('comments')), "comments"],
      ],
      where: whereClause,
      group: ['week_day', 'upload_hour'],
      order: ['week_day', 'upload_hour']
    });

    res.status(200).json({
      status: "success",
      results: records,
    });
  } catch (error: any) {
    res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
}

export const findAllVideosController = async (
  req: Request<{}, {}, {}, VideosSearchReqQuery & { series?: string, title?: string }>,
  res: Response
) => {
  try {
    const page = req.query.page || 1;
    const limit = req.query.limit || 10;
    const skip = (page - 1) * limit;

    //sort 
    let sort = req.query.sort ? req.query.sort.split('%') : ['published_at', 'DESC'];

    let excludeShorts = req.query.excludeShorts !== undefined ? req.query.excludeShorts : true;

    let whereClause = {}
    if (req.query.channels) {
      var channelsArr = req.query.channels.split(',');

      whereClause = {
        channel_id: {
          [Op.or]: channelsArr
        }
      }
    }

    if (req.query.series) {
      var seriessArr = req.query.series.split(',');

      whereClause = {
        serie: {
          [Op.or]: seriessArr
        }
      }
    }

    if (req.query.title) {
      const searchTitle = req.query.title.toLowerCase();
      const lowerTitleCol = Sequelize.fn('lower', Sequelize.col('title'));
      whereClause['title'] = Sequelize.where(Sequelize.fn('LOWER', Sequelize.col('title')), 'LIKE', '%' + searchTitle + '%');
    }

    if (req.query.publishedAtRange) {
      let rangeDate = req.query.publishedAtRange.split(',');
      const publishedAtSearchInitial = dayjs(rangeDate[0]).format("YYYY-MM-DD");
      const publishedAtSearchFinal = dayjs(rangeDate[1]).format("YYYY-MM-DD");
      whereClause['published_at'] = { [Sequelize.Op.between]: [publishedAtSearchInitial, publishedAtSearchFinal] };

    }

    if (req.query.onlyShorts) {
      whereClause['duration_parsed'] = { [Sequelize.Op.lt]: ['69'] };
    }

    if (excludeShorts == true) {
      whereClause['duration_parsed'] = { [Sequelize.Op.gt]: ['69'] };
    }

    // console.log(whereClause);

    const videos = await Video.findAndCountAll({ where: whereClause, limit, offset: skip, order: [sort] });

    res.status(200).json({
      status: "success",
      results: videos.count,
      videos: videos.rows,
    });
  } catch (error: any) {
    res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
};

// , include: [
//  {
//   model: Creator,
//   as: 'directedBy', attributes: ['id', 'custom_url',
//   'name',
//   'profile_picture']
// }, {
//   model: Creator,
//   as: 'cast', attributes: ['id', 'custom_url',
//   'name',
//   'profile_picture']
// }
// ]

export const deleteVideoController = async (
  req: Request,
  res: Response
) => {
  try {
    const result = await Video.destroy({
      where: { id: req.params.video_id },
      force: true,
    });

    if (result === 0) {
      return res.status(404).json({
        status: "fail",
        message: "Video with that ID not found",
      });
    }

    res.status(204).json();
  } catch (error: any) {
    res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
};


export const fetchVideoController = async (
  req: Request<{}, {}, {}>,
  res: Response
) => {
  try {
    const id = req.params['id'];
    console.log(id);
    const video = await Video.findOne({
      where: { video_id: id },
      include: [{
        model: Channel,
        as: 'channel', attributes: ['channel_id', 'custom_url',
          'title',
          'subs',
          'videos',
          'views',
          'likes',
          'comments',
          'logo_url',
          'banner_url',
          'channel_created_at']
      },
      {
        model: Creator,
        as: 'directedBy', attributes: ['id', 'custom_url',
          'name',
          'profile_picture']
      }, {
        model: Creator,
        as: 'cast', attributes: ['id', 'custom_url',
          'name',
          'profile_picture']
      }
      ]
    })

    res.status(200).json({
      status: "success",
      result: video,
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
}; 