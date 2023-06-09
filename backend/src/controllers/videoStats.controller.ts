import { Request, Response } from "express";


import { db, sequelize } from "../util/db";
const VideoStats = db.videoStats;


export const findAllVideoStatsController = async (
  req: Request<{}, {}, {}>,
  res: Response
) => {
  try {
    console.log('IM HERE');
    const page = req.query.page || 1;
    const limit = req.query.limit || 10;
    const skip = (page - 1) * limit;

    //sort 
    let sort = req.query.sort ? req.query.sort.split('%') : ['publishedAt', 'DESC'];
   
    console.log(sort[0], sort[1]);
    
    const videos = await VideoStats.findAndCountAll({ limit, offset: skip, order: [sort] });
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

export const deleteVideoStatsController = async (
  req: Request,
  res: Response
) => {
  try {
    const result = await VideoStats.destroy({
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
