import { Request, Response } from "express";
import VideoModel from "./video";
import {
  CreateVideoInput,
  FilterQueryInput,
  ParamsInput,
  UpdateVideoInput,
} from "./video.schema";
const dayjs = require('dayjs')
const { Sequelize, QueryTypes } = require('sequelize');
const Op = Sequelize.Op;

import { sequelize } from "./db";

export const createVideoController = async (
  req: Request<{}, {}, CreateVideoInput>,
  res: Response
) => {
  try {
    const { title, content, category, published } = req.body;

    const video = await VideoModel.create({
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
  req: Request<UpdateVideoInput["params"], {}, UpdateVideoInput["body"]>,
  res: Response
) => {
  try {
    const result = await VideoModel.update(
      { ...req.body, updatedAt: Date.now() },
      {
        where: {
          id: req.params.videoId,
        },
      }
    );

    if (result[0] === 0) {
      return res.status(404).json({
        status: "fail",
        message: "Video with that ID not found",
      });
    }

    const video = await VideoModel.findByPk(req.params.videoId);

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
  req: Request<ParamsInput>,
  res: Response
) => {
  try {
    const video = await VideoModel.findByPk(req.params.videoId);

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
  req: Request<{}, {}, {}, FilterQueryInput>,
  res: Response
) => {
  try {
  
    const records = await sequelize.query("select category, count(*) as \"noVideos\", sum(views) as views, sum(likes) as likes, sum(comments) as comments" +
    " from videos v where v.\"channelTitle\" = 'Sidemen' and category != '' and v.\"publishedAt\" BETWEEN (:initial) AND (:final) GROUP By v.category order by likes desc ",
    {
      replacements: { initial: '2010-05-23 23:00:00.000 +00:00', final: '2023-06-23 23:00:00.000 +00:00', orderBy: 'likes desc' },
      // bind: { initial: '2010-05-23 23:00:00.000 +00:00', final: '2023-06-23 23:00:00.000 +00:00', orderBy: 'likes desc' },
      type: QueryTypes.SELECT,
      logging: console.log,
      raw: true,

    }
  );
  console.log(JSON.stringify(records));
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
  req: Request<{}, {}, {}, FilterQueryInput>,
  res: Response
) => {
  try {

//     SELECT
//   DATE(v."publishedAt") AS day, COUNT(*) AS frequency, SUM(views) AS total_views, SUM(likes) AS total_likes, SUM(comments) AS total_comments
// FROM
//   videos v
// GROUP BY
//   DATE(v."publishedAt")
// ORDER BY 
//  day
    let sort = req.query.sort ? req.query.sort.split('%') : ['day', 'ASC'];
    const whereClause = {
    }
    if(req.query.channels) {
      console.log(req.query.channels);
      var channelsArr = req.query.channels.split(',');
      
      whereClause.channelTitle = {
        [Op.or]: channelsArr
      } 
    }

    if(req.query.publishedAtRange) {
      let rangeDate = req.query.publishedAtRange.split(',');    
      const publishedAtSearchInitial = dayjs(rangeDate[0]).format("YYYY-MM-DD");
      const publishedAtSearchFinal = dayjs(rangeDate[1]).format("YYYY-MM-DD");
  
      whereClause['publishedAt'] = {[Sequelize.Op.between]: [publishedAtSearchInitial, publishedAtSearchFinal]};
    }

    console.log(JSON.stringify(whereClause));
    const records = await VideoModel.findAll({attributes: [
      [sequelize.fn("DATE", sequelize.col('video.\"publishedAt\"')), "day"],
      [sequelize.fn("COUNT", sequelize.col('*')), "frequency"],
      [sequelize.fn("SUM", sequelize.col('views')), "views"],
      [sequelize.fn("SUM", sequelize.col('likes')), "likes"],
      [sequelize.fn("SUM", sequelize.col('comments')), "comments"],
    ], where: whereClause, group: 'day', order: [sort] });
  
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
  req: Request<{}, {}, {}, FilterQueryInput>,
  res: Response
) => {
  try {

    const whereClause = {
    }
    if(req.query.channels) {
      console.log(req.query.channels);
      var channelsArr = req.query.channels.split(',');
      
      whereClause.channelTitle = {
        [Op.or]: channelsArr
      } 
    }

    if(req.query.publishedAtRange) {
      let rangeDate = req.query.publishedAtRange.split(',');    
      const publishedAtSearchInitial = dayjs(rangeDate[0]).format("YYYY-MM-DD");
      const publishedAtSearchFinal = dayjs(rangeDate[1]).format("YYYY-MM-DD");
  
      whereClause['publishedAt'] = {[Sequelize.Op.between]: [publishedAtSearchInitial, publishedAtSearchFinal]};
    }

    console.log(JSON.stringify(whereClause));
    const records = await VideoModel.findAll({attributes: [
      [sequelize.literal("video.\"channelId\""), 'channel'],
      "channelTitle",
      [sequelize.fn("COUNT", sequelize.col('*')), "total_videos"],
      [sequelize.fn("SUM", sequelize.col('views')), "views"],
      [sequelize.fn("SUM", sequelize.col('likes')), "likes"],
      [sequelize.fn("SUM", sequelize.col('comments')), "comments"],
    ], where: whereClause, group: ['channel','channelTitle'] });
  
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
  req: Request<{}, {}, {}, FilterQueryInput>,
  res: Response
) => {
  try {

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
    const whereClause = {
    }
    if(req.query.channels) {
      console.log(req.query.channels);
      var channelsArr = req.query.channels.split(',');
      
      whereClause.channelTitle = {
        [Op.or]: channelsArr
      } 
    }

    if(req.query.publishedAtRange) {
      let rangeDate = req.query.publishedAtRange.split(',');    
      const publishedAtSearchInitial = dayjs(rangeDate[0]).format("YYYY-MM-DD");
      const publishedAtSearchFinal = dayjs(rangeDate[1]).format("YYYY-MM-DD");
  
      whereClause['publishedAt'] = {[Sequelize.Op.between]: [publishedAtSearchInitial, publishedAtSearchFinal]};
    }

    console.log(JSON.stringify(whereClause));
    const records = await VideoModel.findAll({attributes: [
      [sequelize.literal("EXTRACT(DOW FROM video.\"publishedAt\")"), 'week_day'],
      [sequelize.literal("EXTRACT(HOUR FROM video.\"publishedAt\")"), 'upload_hour'],
      [sequelize.fn("COUNT", sequelize.col('*')), "frequency"],
      [sequelize.fn("SUM", sequelize.col('views')), "views"],
      [sequelize.fn("SUM", sequelize.col('likes')), "likes"],
      [sequelize.fn("SUM", sequelize.col('comments')), "comments"],
    ], 
    where: whereClause, 
    group: ['week_day', 'upload_hour'],
    order: ['week_day', 'upload_hour'] });
  
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
  req: Request<{}, {}, {}, FilterQueryInput>,
  res: Response
) => {
  try {
    console.log('IM HERE SEARCHIN ALL ' + JSON.stringify(req.query));
    console.log('FUCK : ' + req.query.sort);
    const page = req.query.page || 1;
    const limit = req.query.limit || 10;
    const skip = (page - 1) * limit;

    //sort 
    let sort = req.query.sort ? req.query.sort.split('%') : ['publishedAt', 'DESC'];
   
    const whereClause = {}
    if(req.query.channels) {
      console.log(req.query.channels);
      var channelsArr = req.query.channels.split(',');
      
      whereClause.channelTitle = {
        [Op.or]: channelsArr
      } 
    }
    if(req.query.title) {
      const searchTitle = req.query.title.toLowerCase();
      const lowerTitleCol = Sequelize.fn('lower', Sequelize.col('title'));
      whereClause['title'] = Sequelize.where(Sequelize.fn('LOWER', Sequelize.col('title')), 'LIKE', '%' + searchTitle + '%');
    }

    console.log(req.query.publishedAtRange);
    if(req.query.publishedAtRange) {
      let rangeDate = req.query.publishedAtRange.split(',');
      
      const publishedAtSearchInitial = dayjs(rangeDate[0]).format("YYYY-MM-DD");
      const publishedAtSearchFinal = dayjs(rangeDate[1]).format("YYYY-MM-DD");
      console.log(publishedAtSearchInitial);
      console.log(publishedAtSearchFinal);
  
      // const betweenClause = { [Sequelize.Op.between]: [publishedAtSearch[0], publishedAtSearch[1]] };
      whereClause['publishedAt'] = {[Sequelize.Op.between]: [publishedAtSearchInitial, publishedAtSearchFinal]};
      // whereClause[Sequelize.Op.or] = [{ publishedAt: betweenClause }, { final_date: betweenClause }];
    }

    console.log(whereClause);
    
    const videos = await VideoModel.findAndCountAll({where: whereClause, limit, offset: skip, order: [sort] });
    // console.log(videos);

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



export const deleteVideoController = async (
  req: Request<ParamsInput>,
  res: Response
) => {
  try {
    const result = await VideoModel.destroy({
      where: { id: req.params.videoId },
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
