import { Request, Response, urlencoded } from "express";
const dayjs = require('dayjs')
const { Sequelize, QueryTypes } = require('sequelize');
const Op = Sequelize.Op;

import { db, sequelize } from "../util/db";
import { ChannelsReqQuery, ChannelsSearchReqQuery, VideosSearchReqQuery, SearchReqQuery } from "./types";
const VideoService = require('../services/videoService');
const Video = db.video;
const Channel = db.channel;
const Creator = db.creator;

export const updateVideoController = async (
  req: Request,
  res: Response
) => {
  try {
    const id = req.params['id'];
    const videoService = new VideoService();
    const video = await videoService.update(id, req.body.tags, req.body.series, req.body.directedBy, req.body.cast, req.body.game);

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
  req: Request<any, any, any, VideosSearchReqQuery>,
  res: Response
) => {
  try {
    let publishedAtSearchInitial;

    // console.log(req.query);
    let publishedAtSearchFinal;
    let channel_Ids;
    let sort = req.query.sort ? req.query.sort.split('%') : ['views', 'DESC'];
    if (req.query.publishedAtRange) {
      let rangeDate = req.query.publishedAtRange.split(',');
      publishedAtSearchInitial = dayjs(rangeDate[0]).format("YYYY-MM-DD");
      publishedAtSearchFinal = dayjs(rangeDate[1]).format("YYYY-MM-DD");
    } else {
      publishedAtSearchInitial = '2010-05-23 23:00:00.000 +00:00';
      publishedAtSearchFinal = new Date();
    }

    if (req.query.channels) {
      // console.log(req.query.channels);
      var channelsArr = req.query.channels.split(',');

      channel_Ids = channelsArr
    }

    const records = await sequelize.query("select serie, count(*) as videos, sum(views) as views, sum(likes) as likes, sum(comments) as comments" +
      " from video v where channel_id IN (:channelIds) and serie is not null and published_at BETWEEN (:initial) AND (:final) GROUP By v.serie order by (:orderBy) ",
      {
        replacements: { channelIds: channel_Ids, initial: publishedAtSearchInitial, final: publishedAtSearchFinal, orderBy: sort },
        // bind: { initial: '2010-05-23 23:00:00.000 +00:00', final: '2023-06-23 23:00:00.000 +00:00', orderBy: 'likes desc' },
        type: QueryTypes.SELECT,
        logging: console.log,
        raw: true,

      }
    );
    // // console.log(JSON.stringify(records));
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

export const findGroupedByGame = async (
  req: Request<any, any, any, VideosSearchReqQuery>,
  res: Response
) => {
  try {
    let publishedAtSearchInitial;
    let publishedAtSearchFinal;
    let channel_Ids;
    let sort = req.query.sort ? req.query.sort.split('%') : ['views', 'DESC'];
    if (req.query.publishedAtRange) {
      let rangeDate = req.query.publishedAtRange.split(',');
      publishedAtSearchInitial = dayjs(rangeDate[0]).format("YYYY-MM-DD");
      publishedAtSearchFinal = dayjs(rangeDate[1]).format("YYYY-MM-DD");
    } else {
      publishedAtSearchInitial = '2010-05-23 23:00:00.000 +00:00';
      publishedAtSearchFinal = new Date();
    }

    if (req.query.channels) {
      // console.log(req.query.channels);
      var channelsArr = req.query.channels.split(',');

      channel_Ids = channelsArr
    }

    const records = await sequelize.query("select game, count(*) as videos, sum(views) as views, sum(likes) as likes, sum(comments) as comments" +
      " from video v where channel_id IN (:channelIds) and game is not null and published_at BETWEEN (:initial) AND (:final) GROUP By v.game order by (:orderBy) ",
      {
        replacements: { channelIds: channel_Ids, initial: publishedAtSearchInitial, final: publishedAtSearchFinal, orderBy: sort },
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

export const findGroupedByTags = async (
  req: Request<any, any, any, VideosSearchReqQuery>,
  res: Response
) => {
  try {
    // console.log(req.query);
    let publishedAtSearchInitial;

    let publishedAtSearchFinal;
    let channel_Ids;
    let sort = req.query.sort ? req.query.sort.split('%') : ['views', 'DESC'];
    if (req.query.publishedAtRange) {
      let rangeDate = req.query.publishedAtRange.split(',');
      publishedAtSearchInitial = dayjs(rangeDate[0]).format("YYYY-MM-DD");
      publishedAtSearchFinal = dayjs(rangeDate[1]).format("YYYY-MM-DD");
    } else {
      publishedAtSearchInitial = '2010-05-23 23:00:00.000 +00:00';
      publishedAtSearchFinal = new Date();
    }

    if (req.query.channels) {
      // console.log(req.query.channels);
      var channelsArr = req.query.channels.split(',');

      channel_Ids = channelsArr
    }

    const query = "SELECT tag, COUNT(*) as videos, SUM(views) as views, SUM(likes) as likes, SUM(comments) as comments "
      + "FROM ("
      + "    SELECT channel_id, jsonb_array_elements_text(tags) AS tag, views, likes, comments "
      + "    FROM video"
      + "    WHERE channel_id IN (:channelIds)"
      + "        AND tags IS NOT NULL"
      + "        AND published_at BETWEEN (:initial) AND (:final) "
      + ") AS unnested "
      + "GROUP BY tag "
      + "ORDER BY (:orderBy) ";

    const oldQuery = "select tag, count(*) as videos, sum(views) as views, sum(likes) as likes, sum(comments) as comments" +
      " from video v JOIN unnest(tags) AS tag ON true where channel_id IN (:channelIds) and tags is not null and published_at BETWEEN (:initial) AND (:final) GROUP By tag order by (:orderBy) ";

    const records = await sequelize.query(query,
      {
        replacements: { channelIds: channel_Ids, initial: publishedAtSearchInitial, final: publishedAtSearchFinal, orderBy: sort },
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


export const fetchGroupedByCast = async (
  req: Request<any, any, any, VideosSearchReqQuery>,
  res: Response
) => {
  try {
    // console.log(req.query);
    let publishedAtSearchInitial;
    let publishedAtSearchFinal;
    let channel_Ids;
    if (req.query.publishedAtRange) {
      let rangeDate = req.query.publishedAtRange.split(',');
      publishedAtSearchInitial = dayjs(rangeDate[0]).format("YYYY-MM-DD");
      publishedAtSearchFinal = dayjs(rangeDate[1]).format("YYYY-MM-DD");
    } else {
      publishedAtSearchInitial = '2010-05-23 23:00:00.000 +00:00';
      publishedAtSearchFinal = new Date();
    }

    if (req.query.channels) {
      var channelsArr = req.query.channels.split(',');

      channel_Ids = channelsArr
    }

    const query = "SELECT vc.creator_id, c.name AS creator_name, COUNT(*) AS videos, SUM(v.views) AS views, SUM(v.likes) AS likes, SUM(v.comments) AS comments " +
      "FROM public.video_creator vc JOIN public.video v ON vc.video_id = v.video_id JOIN public.creator c ON vc.creator_id = c.id " +
      " WHERE v.channel_id IN (:channelIds) and v.published_at BETWEEN (:initial) AND (:final) " +
      " GROUP BY vc.creator_id, c.name ORDER BY videos DESC";

    const records = await sequelize.query(query,
      {
        replacements: { channelIds: channel_Ids, initial: publishedAtSearchInitial, final: publishedAtSearchFinal },
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
    // // console.log(JSON.stringify(records));
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

    // where: whereClause
    const tags = await Video.findAll({ attributes: ['tags'] });
    // Flatten the array and convert to a Set to remove duplicates
    const uniqueTagsSet = new Set(tags.flatMap((item) => item.tags || []));

    // Convert the Set back to an array
    const allTags = Array.from(uniqueTagsSet);

    // // console.log(JSON.stringify(records));
    res.status(200).json({
      status: "success",
      results: allTags,
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

    let sort = req.query.sort ? req.query.sort.split('%') : ['day', 'ASC'];
    let whereClause = {}
    if (req.query.channels) {
      // console.log(req.query.channels);
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
      whereClause['duration_parsed'] = { [Sequelize.Op.gt]: ['69'] };
    } else {

    }

    // // console.log(JSON.stringify(whereClause));
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

export const fetchStatsGroupedByYear = async (
  req: Request<any, any, any, VideosSearchReqQuery>,
  res: Response
) => {
  try {


    let excludeShorts = req.query.excludeShorts ? req.query.excludeShorts : true;

    let sort = req.query.sort ? req.query.sort.split('%') : ['year', 'ASC'];
    let whereClause = {}
    if (req.query.channels) {
      var channelsArr = req.query.channels.split(',');

      whereClause = {
        channel_id: {
          [Op.or]: channelsArr
        }
      }
    }

    if (excludeShorts) {
      whereClause['duration_parsed'] = { [Sequelize.Op.gt]: ['69'] };
    } else {

    }

    // I know, lazy implementation, but if it works...
    if (req.query.groupByChannel) {
      const records = await Video.findAll({
        attributes: [
          [sequelize.literal("EXTRACT(YEAR FROM video.published_at)"), 'year'],
          'channel_title',
          [sequelize.fn("COUNT", sequelize.col('*')), "frequency"],
          [sequelize.fn("SUM", sequelize.col('views')), "views"],
          [sequelize.fn("MAX", sequelize.col('views')), "max_views"],
          [sequelize.fn("AVG", sequelize.col('views')), "avg_views"],
          [sequelize.fn("SUM", sequelize.col('likes')), "likes"],
          [sequelize.fn("MAX", sequelize.col('likes')), "max_likes"],
          [sequelize.fn("AVG", sequelize.col('likes')), "avg_likes"],
          [sequelize.fn("SUM", sequelize.col('comments')), "comments"],
          [sequelize.fn("MAX", sequelize.col('comments')), "max_comments"],
          [sequelize.fn("AVG", sequelize.col('comments')), "avg_comments"],
        ], where: whereClause, group: ['year', 'channel_title'], order: [sort]
      });

      // console.log('/n/n HERE:::', records);

      return res.status(200).json({
        status: "success",
        results: records,
      });
    }


    // // console.log(JSON.stringify(whereClause));
    const records = await Video.findAll({
      attributes: [
        [sequelize.literal("EXTRACT(YEAR FROM video.published_at)"), 'year'],
        [sequelize.fn("COUNT", sequelize.col('*')), "frequency"],
        [sequelize.fn("SUM", sequelize.col('views')), "views"],
        [sequelize.fn("MAX", sequelize.col('views')), "max_views"],
        [sequelize.fn("AVG", sequelize.col('views')), "avg_views"],
        [sequelize.fn("SUM", sequelize.col('likes')), "likes"],
        [sequelize.fn("MAX", sequelize.col('likes')), "max_likes"],
        [sequelize.fn("AVG", sequelize.col('likes')), "avg_likes"],
        [sequelize.fn("SUM", sequelize.col('comments')), "comments"],
        [sequelize.fn("MAX", sequelize.col('comments')), "max_comments"],
        [sequelize.fn("AVG", sequelize.col('comments')), "avg_comments"],
      ], where: whereClause, group: 'year', order: [sort]
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


export const fetchStatsGroupedByDurationRange = async (
  req: Request<any, any, any, VideosSearchReqQuery>,
  res: Response
) => {
  try {


    let excludeShorts = req.query.excludeShorts ? req.query.excludeShorts : true;

    let sort = req.query.sort ? req.query.sort.split('%') : ['year', 'ASC'];
    let whereClause = {}
    if (req.query.channels) {
      var channelsArr = req.query.channels.split(',');

      whereClause = {
        channel_id: {
          [Op.or]: channelsArr
        }
      }
    }

    if (excludeShorts) {
      whereClause['duration_parsed'] = { [Sequelize.Op.gt]: ['69'] };
    } else {

    }

    // I know, lazy implementation, but if it works...
    const records = await Video.findAll({
      attributes: [
        [
          Sequelize.literal(`
        CASE
          WHEN duration_parsed <= 600 THEN '1000'
          WHEN duration_parsed <= 1200 THEN '1200'
          WHEN duration_parsed <= 1800 THEN '1800'
          WHEN duration_parsed <= 3600 THEN '3600'
          WHEN duration_parsed <= 7200 THEN '7200'
          ELSE '7201'
        END
      `),
          'durationGroup'
        ],
        [sequelize.fn("COUNT", sequelize.col('*')), "frequency"],
        [sequelize.fn("SUM", sequelize.col('views')), "views"],
        [sequelize.fn("MAX", sequelize.col('views')), "max_views"],
        [sequelize.fn("AVG", sequelize.col('views')), "avg_views"],
        [sequelize.fn("SUM", sequelize.col('likes')), "likes"],
        [sequelize.fn("MAX", sequelize.col('likes')), "max_likes"],
        [sequelize.fn("AVG", sequelize.col('likes')), "avg_likes"],
        [sequelize.fn("SUM", sequelize.col('comments')), "comments"],
        [sequelize.fn("MAX", sequelize.col('comments')), "max_comments"],
        [sequelize.fn("AVG", sequelize.col('comments')), "avg_comments"],
      ], where: whereClause,
      group: 'durationGroup', order: ['durationGroup'],
      raw: true,
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
      // // console.log(req.query.channels);
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
      whereClause['duration_parsed'] = { [Sequelize.Op.gt]: ['69'] };
    } else {

    }

    // // console.log(JSON.stringify(whereClause));
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
      // // console.log(req.query.channels);
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
      whereClause['duration_parsed'] = { [Sequelize.Op.gt]: ['69'] };
    } else {

    }

    // console.log(JSON.stringify(whereClause));
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

export const findHighlightedVideosController = async (
  req: Request<{}, {}, {}, VideosSearchReqQuery & { series?: string, title?: string }>,
  res: Response
) => {
  try {
    const page = 1;
    const limit = 10;
    const skip = (page - 1) * limit;

    // console.log(req.query)
    //sort 
    let sort = ['published_at', 'DESC'];

    let excludeShorts =  'true';

    let whereClause = {}

    if (req.query.channels) {
      var channelsArr = req.query.channels.split(',');

      whereClause['channel_id'] = { [Op.or]: channelsArr };
    }

    if (req.query.excludedChannels) {
      var channelsArr = req.query.excludedChannels.split(',');

      whereClause['channel_id'] = { [Op.notIn]: channelsArr };
    }

    if (req.query.castMember) {
      var creatorArr = req.query.castMember.split(',');

      whereClause['channel_id'] = { [Op.notIn]: channelsArr };
    }

    if (req.query.series) {
      var seriessArr = req.query.series.split(',');

      whereClause['serie'] = { [Op.or]: seriessArr };
    }

    if (req.query.games) {
      var gamesArr = req.query.games.split(',');

      whereClause['game'] = { [Op.or]: gamesArr };
    }

    if (req.query.tags) {
      var tagsArr = req.query.tags.split(',');

      whereClause['tags'] = { [Op.contains]: tagsArr };
    }

    if (req.query.publishedAtRange) {
      let rangeDate = req.query.publishedAtRange.split(',');
      const publishedAtSearchInitial = dayjs(rangeDate[0]).format("YYYY-MM-DD");
      const publishedAtSearchFinal = dayjs(rangeDate[1]).format("YYYY-MM-DD");
      whereClause['published_at'] = { [Sequelize.Op.between]: [publishedAtSearchInitial, publishedAtSearchFinal] };

    }

    if (req.query.onlyShorts === 'true') {
      whereClause['duration_parsed'] = { [Sequelize.Op.lt]: ['69'] };
    }

    if (excludeShorts === 'true') {
      whereClause['duration_parsed'] = { [Sequelize.Op.gt]: ['69'] };
    }

    // // console.log(whereClause);

    const videos = await Video.findAll({
      attributes: ['video_id', 'title',
        'duration',
        'duration_parsed',
        'channel_id',
        'channel_title',
        'views',
        'likes',
        'dislikes',
        'comments',
        'url',
        'player',
        'tags',
        'locations',
        'category',
        'serie',
        'game',
        'published_at',
        'updated_at'
      ], where: whereClause,
      include: [{
        model: Channel,
        as: 'channel', attributes: ['channel_id', 'custom_url',
          'title',
          'subs',
          'videos',
          'views',
          'likes',
          'comments',
          'logo_url',]
      },
      {
        model: Creator,
        as: 'directedBy', attributes: ['id', 'custom_url', 'name', 'profile_picture']
      },
      {
        model: Creator,
        as: 'cast',
        attributes: ['id', 'custom_url', 'name', 'profile_picture'],
      }],
      limit, offset: skip, order: [sort]
    });

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

export const findAllVideosController = async (
  req: Request<{}, {}, {}, VideosSearchReqQuery & { series?: string, title?: string }>,
  res: Response
) => {
  try {
    const page = req.query.page || 1;
    const limit = req.query.limit || 10;
    const skip = (page - 1) * limit;

    // console.log(req.query)
    //sort 
    let sort = req.query.sort ? req.query.sort.split('%') : ['published_at', 'DESC'];

    let excludeShorts = req.query.excludeShorts !== undefined ? req.query.excludeShorts : 'true';

    let whereClause = {}

    if (req.query.channels) {
      var channelsArr = req.query.channels.split(',');

      whereClause['channel_id'] = { [Op.or]: channelsArr };
    }

    if (req.query.excludedChannels) {
      var channelsArr = req.query.excludedChannels.split(',');

      whereClause['channel_id'] = { [Op.notIn]: channelsArr };
    }

    if (req.query.castMember) {
      var creatorArr = req.query.castMember.split(',');

      whereClause['channel_id'] = { [Op.notIn]: channelsArr };
    }

    if (req.query.series) {
      var seriessArr = req.query.series.split(',');

      whereClause['serie'] = { [Op.or]: seriessArr };
    }

    if (req.query.games) {
      var gamesArr = req.query.games.split(',');

      whereClause['game'] = { [Op.or]: gamesArr };
    }

    if (req.query.tags) {
      var tagsArr = req.query.tags.split(',');

      whereClause['tags'] = { [Op.contains]: tagsArr };
    }

    if (req.query.title) {
      const searchTitle = req.query.title.toLowerCase();
      const lowerTitleCol = Sequelize.fn('lower', Sequelize.col('title'));
      whereClause['video.title'] = Sequelize.where(Sequelize.fn('LOWER', Sequelize.col('video.title')), 'LIKE', '%' + searchTitle + '%');
    }

    if (req.query.publishedAtRange) {
      let rangeDate = req.query.publishedAtRange.split(',');
      const publishedAtSearchInitial = dayjs(rangeDate[0]).format("YYYY-MM-DD");
      const publishedAtSearchFinal = dayjs(rangeDate[1]).format("YYYY-MM-DD");
      whereClause['published_at'] = { [Sequelize.Op.between]: [publishedAtSearchInitial, publishedAtSearchFinal] };

    }

    if (req.query.onlyShorts === 'true') {
      whereClause['duration_parsed'] = { [Sequelize.Op.lt]: ['69'] };
    }

    if (excludeShorts === 'true') {
      whereClause['duration_parsed'] = { [Sequelize.Op.gt]: ['69'] };
    }

    // // console.log(whereClause);

    const videos = await Video.findAndCountAll({
      attributes: ['video_id', 'title',
        'duration',
        'duration_parsed',
        'channel_id',
        'channel_title',
        'views',
        'likes',
        'dislikes',
        'comments',
        'url',
        'player',
        'tags',
        'locations',
        'category',
        'serie',
        'game',
        'published_at',
        'updated_at'
      ], where: whereClause,
      include: [{
        model: Channel,
        as: 'channel', attributes: ['channel_id', 'custom_url',
          'title',
          'subs',
          'videos',
          'views',
          'likes',
          'comments',
          'logo_url',]
      },
      {
        model: Creator,
        as: 'directedBy', attributes: ['id', 'custom_url', 'name', 'profile_picture']
      },
      {
        model: Creator,
        as: 'cast',
        attributes: ['id', 'custom_url', 'name', 'profile_picture'],
      }],
      limit, offset: skip, order: [sort], subQuery: false,
    });

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

export const findAllAppearencesController = async (
  req: Request<{}, {}, {}, VideosSearchReqQuery & { series?: string, title?: string }>,
  res: Response
) => {
  try {
    const page = req.query.page || 1;
    const limit = req.query.limit || 10;
    const skip = (page - 1) * limit;

    // console.log(req.query)
    //sort 
    let sort = req.query.sort ? req.query.sort.split('%') : ['published_at', 'DESC'];

    let excludeShorts = req.query.excludeShorts !== undefined ? req.query.excludeShorts : 'true';

    let whereClause = {}
    let castWhereClause = {}

    if (req.query.channels) {
      var channelsArr = req.query.channels.split(',');

      whereClause['channel_id'] = { [Op.or]: channelsArr };
    }

    if (req.query.excludedChannels) {
      var channelsArr = req.query.excludedChannels.split(',');

      whereClause['channel_id'] = { [Op.notIn]: channelsArr };
    }

    if (req.query.castMember) {
      var creatorArr = req.query.castMember.split(',');

      castWhereClause['id'] = { [Op.in]: creatorArr };
    }

    if (req.query.series) {
      var seriessArr = req.query.series.split(',');

      whereClause['serie'] = { [Op.or]: seriessArr };
    }

    if (req.query.tags) {
      var tagsArr = req.query.tags.split(',');

      whereClause['tags'] = { [Op.contains]: tagsArr };
    }

    if (req.query.title) {
      const searchTitle = req.query.title.toLowerCase();
      const lowerTitleCol = Sequelize.fn('lower', Sequelize.col('title'));
      whereClause['video.title'] = Sequelize.where(Sequelize.fn('LOWER', Sequelize.col('video.title')), 'LIKE', '%' + searchTitle + '%');
    }

    if (req.query.publishedAtRange) {
      let rangeDate = req.query.publishedAtRange.split(',');
      const publishedAtSearchInitial = dayjs(rangeDate[0]).format("YYYY-MM-DD");
      const publishedAtSearchFinal = dayjs(rangeDate[1]).format("YYYY-MM-DD");
      whereClause['published_at'] = { [Sequelize.Op.between]: [publishedAtSearchInitial, publishedAtSearchFinal] };

    }

    if (req.query.onlyShorts === 'true') {
      whereClause['duration_parsed'] = { [Sequelize.Op.lt]: ['69'] };
    }

    if (excludeShorts === 'true') {
      whereClause['duration_parsed'] = { [Sequelize.Op.gt]: ['69'] };
    }

    // console.log(whereClause);

    // await sequelize.query(
    //   'SELECT * FROM videos WHERE id = CAST($1 AS int)',
    //   {
    //     bind: [5],
    //     type: QueryTypes.SELECT,
    //   },
    // );

    const videos = await Video.findAndCountAll({
      attributes: ['video_id', 'title',
        'duration',
        'duration_parsed',
        'channel_id',
        'channel_title',
        'views',
        'likes',
        'dislikes',
        'comments',
        'url',
        'player',
        'tags',
        'locations',
        'category',
        'serie',
        'game',
        'published_at',
        'updated_at'
      ],
      where: whereClause,
      nest: true,
      include: [{
        model: Creator,
        as: 'directedBy', attributes: ['id', 'custom_url', 'name', 'profile_picture']
      },
      // {
      //   sequelize.literal(`(
      //     INNER JOIN ( "video_creator" AS "cast") 
      //       ON "video"."video_id" = "cast"."video_id" 
      //       AND "cast"."creator_id" IN ('23ecdddf-ae37-4af4-82a4-d72e572b2072') 
      //   )`),
      //   'laughReactionsCount'
      // }

      {
        model: Creator,
        as: 'cast',
        required: true,
        attributes: ['id', 'custom_url', 'name', 'profile_picture'],
        where: castWhereClause
      }
      ],
      raw: true,
      limit, offset: skip, order: [sort]
    });

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

export const findAllVideoGuestsController = async (
  req: Request<{}, {}, {}, VideosSearchReqQuery & { series?: string, title?: string }>,
  res: Response
) => {
  try {
    const page = req.query.page || 1;
    const limit = req.query.limit || 10;
    const skip = (page - 1) * limit;

    // console.log(req.query)
    //sort 
    let sort = req.query.sort ? req.query.sort.split('%') : ['published_at', 'DESC'];

    let excludeShorts = req.query.excludeShorts !== undefined ? req.query.excludeShorts : 'true';

    let whereClause = {}
    let castWhereClause = {}

    if (req.query.channels) {
      var channelsArr = req.query.channels.split(',');

      whereClause['channel_id'] = { [Op.or]: channelsArr };
    }

    if (req.query.excludedChannels) {
      var channelsArr = req.query.excludedChannels.split(',');

      whereClause['channel_id'] = { [Op.notIn]: channelsArr };
    }

    if (req.query.castMember) {
      var creatorArr = req.query.castMember.split(',');

      castWhereClause['id'] = { [Op.in]: creatorArr };
    }

    if (req.query.notInCastMember) {
      var creatorArr = req.query.notInCastMember.split(',');

      castWhereClause['id'] = { [Op.notIn]: creatorArr };
    }

    if (req.query.series) {
      var seriessArr = req.query.series.split(',');

      whereClause['serie'] = { [Op.or]: seriessArr };
    }

    if (req.query.tags) {
      var tagsArr = req.query.tags.split(',');

      whereClause['tags'] = { [Op.contains]: tagsArr };
    }

    if (req.query.title) {
      const searchTitle = req.query.title.toLowerCase();
      const lowerTitleCol = Sequelize.fn('lower', Sequelize.col('title'));
      whereClause['video.title'] = Sequelize.where(Sequelize.fn('LOWER', Sequelize.col('title')), 'LIKE', '%' + searchTitle + '%');
    }

    if (req.query.publishedAtRange) {
      let rangeDate = req.query.publishedAtRange.split(',');
      const publishedAtSearchInitial = dayjs(rangeDate[0]).format("YYYY-MM-DD");
      const publishedAtSearchFinal = dayjs(rangeDate[1]).format("YYYY-MM-DD");
      whereClause['published_at'] = { [Sequelize.Op.between]: [publishedAtSearchInitial, publishedAtSearchFinal] };

    }

    if (req.query.onlyShorts === 'true') {
      whereClause['duration_parsed'] = { [Sequelize.Op.lt]: ['69'] };
    }

    if (excludeShorts === 'true') {
      whereClause['duration_parsed'] = { [Sequelize.Op.gt]: ['69'] };
    }

    // // console.log(whereClause);

    // await sequelize.query(
    //   'SELECT * FROM videos WHERE id = CAST($1 AS int)',
    //   {
    //     bind: [5],
    //     type: QueryTypes.SELECT,
    //   },
    // );

    const videos = await Video.findAndCountAll({
      attributes: ['video_id', 'title',
        'duration',
        'duration_parsed',
        'channel_id',
        'channel_title',
        'views',
        'likes',
        'dislikes',
        'comments',
        'url',
        'player',
        'tags',
        'locations',
        'category',
        'serie',
        'game',
        'published_at',
        'updated_at'
      ],
      where: whereClause,
      nest: true,
      include: [
        //   {
        //   model: Creator,
        //   as: 'directedBy', attributes: ['id', 'custom_url', 'name', 'profile_picture']
        // },
        // {
        //   sequelize.literal(`(
        //     INNER JOIN ( "video_creator" AS "cast") 
        //       ON "video"."video_id" = "cast"."video_id" 
        //       AND "cast"."creator_id" IN ('23ecdddf-ae37-4af4-82a4-d72e572b2072') 
        //   )`),
        //   'laughReactionsCount'
        // }

        {
          model: Creator,
          as: 'cast',
          required: true,
          attributes: ['id', 'custom_url', 'name', 'profile_picture'],
          where: castWhereClause
        }
      ],
      raw: true,
      order: [sort]
    });
    // limit, offset: skip, 
    // // console.log(videos.rows);
    // Create an empty object to store the grouped data
    const groupedData = [];
    const castIdToIndex = {};  // Mapping of cast IDs to array indexes

    // Iterate through the videos in the data
    videos.rows.forEach(video => {
      const castId = video.cast.id;

      // If the cast member is not already in the array, add them with an empty array
      if (!castIdToIndex.hasOwnProperty(castId)) {
        const newIndex = groupedData.push({ creator_info: video.cast, videos: [] }) - 1;
        castIdToIndex[castId] = newIndex;
      }

      // Push the video details to the cast member's array using the index
      const castIndex = castIdToIndex[castId];
      groupedData[castIndex].videos.push(video);
    });

    res.status(200).json({
      status: "success",
      count: groupedData.length,
      results: groupedData,
    });
  } catch (error: any) {
    res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
};

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
    // console.log(id);
    const video = await Video.findOne({
      where: { video_id: id },
      attributes: ['video_id', 'title',
        'duration',
        'duration_parsed',
        'channel_id',
        'channel_title',
        'views',
        'likes',
        'dislikes',
        'comments',
        'url',
        'player',
        'tags',
        'locations',
        'category',
        'serie',
        'game',
        'published_at',
        'updated_at'
      ],
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