import { Request, Response } from "express";

const { Sequelize, QueryTypes } = require('sequelize');
const Op = Sequelize.Op;
import { db, sequelize } from "../util/db";
import { ChannelsReqQuery } from "./types";
const ChannelStats = db.channelStats;
const Channel = db.channel;
const Video = db.video;

export const fetchMostSubscribedChannelsByMonth = async (
  req: Request<{}, {}, {}, ChannelsReqQuery>,
  res: Response
) => {
  try {
    sequelize.query(`
  SELECT
    "channel"."title",
    "channel"."channel_id",
    MIN("channel_stats"."subs") AS "first_subs",
    MAX("channel_stats"."subs") AS "last_subs",
    MAX("channel_stats"."fetched_at") AS "last_fetched_at",
    MAX("channel_stats"."subs") - MIN("channel_stats"."subs") AS "subs_growth"
  FROM
    "channel_stats" AS "channel_stats"
  LEFT JOIN
    "channel" AS "channel"
  ON
    "channel_stats"."channel_id" = "channel"."channel_id"
  WHERE
    "channel_stats"."fetched_at" BETWEEN date_trunc('month', CURRENT_DATE)
    AND date_trunc('month', CURRENT_DATE + INTERVAL '1' MONTH - INTERVAL '1' DAY)
  GROUP BY
  "channel"."title", "channel"."channel_id"
  ORDER BY
    "subs_growth" DESC;
`, { type: Sequelize.QueryTypes.SELECT })
      .then(results => {
        console.log(results);
        res.status(200).json({
          status: "success",
          results: results,
        });
      })
      .catch(error => {
        console.error('Error executing Sequelize query', error);
      });


  } catch (error: any) {
    res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
};

export const fetchHottestChannels = async (
  req: Request<{}, {}, {}, ChannelsReqQuery>,
  res: Response
) => {
  try {

    // const thirtyDaysAgo = new Date();
    // thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const range = req.query.range ? req.query.range : 30;

    const hottestChannelsQuery = `
    select _c.id as "creator_id", 
    _c.name,
    _c.profile_picture,
    _ch.channel_id,
    _ch.title,
    _ch.logo_url,
		COUNT(_v.video_id) as "videos_published",
    SUM(_v.views) as "videos_views",
    SUM(_v.likes) as "videos_likes",
		_ch.subs,
		MAX(first_subs."first_subs") as "_first_subs",
		MAX(_ch."subs" - first_subs.first_subs) AS "total_subs_increase",
  		MAX(((_ch."subs" - first_subs.first_subs) / first_subs.first_subs) * 100) AS "subs_growth_percentage",
		_ch.views,
		MAX(first_subs."first_views") as "_first_views",
		MAX(_ch."views" - first_subs.first_views) AS "total_views_increase",
  		MAX(((_ch."views" - first_subs.first_views) / first_subs.first_views) * 100) AS "views_growth_percentage",
		_ch.updated_at
from creator _c 
	inner join channel_creator _cc on _cc.creator_id = _c.id
	left join channel _ch on _ch.channel_id = _cc.channel_id
	LEFT JOIN (
	  SELECT
		"channel_id",
		"subs" AS "first_subs",
    "views" AS "first_views",
		"fetched_at"
	  FROM
		"channel_stats"
	  WHERE
		("channel_id", "fetched_at") IN (
		  SELECT "channel_id", MIN("fetched_at") AS "first_fetched_at"
		  FROM "channel_stats"
		  WHERE "fetched_at" BETWEEN NOW() - INTERVAL '${range} days' AND NOW()
		  GROUP BY "channel_id"
		) 
	) AS first_subs ON _ch."channel_id" = first_subs."channel_id"
	LEFT JOIN video _v on _v.channel_id = _ch."channel_id" and (_v.duration_parsed > 69 and _v.published_at BETWEEN NOW() - INTERVAL '${range} days' AND NOW())
	
group by _c.id, _ch.channel_id
order by name asc, _ch.subs desc;
    `;


    const hottestChannels = await sequelize.query(hottestChannelsQuery, {
      // replacements: { range: parseInt(range) },
      type: Sequelize.QueryTypes.SELECT,
    });

    // console.log(hottestChannels);
    res.status(200).json({
      status: "success",
      results: hottestChannels,
    });
  } catch (error: any) {
    res.status(500).json({
      status: "error",
      message: error.message,
    });
  }

};

export const findAllChannelStatsController = async (
  req: Request<{}, {}, {}, ChannelsReqQuery>,
  res: Response
) => {
  try {
    let whereClause = {}
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    if (req.query.channels) {
      var channelsArr = req.query.channels.split(',');

      whereClause['channel_id'] = { [Op.or]: channelsArr };
    }

    if (true) {

      whereClause['fetched_at'] = { [Op.gt]: thirtyDaysAgo };
    }


    const stats = await ChannelStats.findAll({
      attributes: [
        'channel_id',
        [sequelize.fn("DATE", sequelize.col('fetched_at')), "fetched_date"],
        [sequelize.fn("MIN", sequelize.col('subs')), "subs"],
        [sequelize.fn("MIN", sequelize.col('views')), "views"],
      ], where: whereClause, group: ['channel_id', "fetched_date"], order: [['fetched_date', 'asc']],
      raw: true,
    });

    // console.log(videos);

    res.status(200).json({
      status: "success",
      results: stats,
    });
  } catch (error: any) {
    res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
};
