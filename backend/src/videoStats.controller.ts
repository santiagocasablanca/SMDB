import { Request, Response } from "express";
import VideoStatsModel from "./videoStats";
import {
  CreateVideoInput,
  FilterQueryInput,
  ParamsInput,
  UpdateVideoInput,
} from "./videoStats.schema";

export const createVideoStatsController = async (
  req: Request<{}, {}, CreateVideoInput>,
  res: Response
) => {
  try {
    // const { title, content, category, published } = req.body;

    // const video = await VideoStatsModel.create({
    //   title,
    //   content,
    //   category,
    //   published,
    // });
    

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

export const updateVideoStatsController = async (
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

    const video = await VideoStatsModel.findByPk(req.params.videoId);

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

export const findVideoStatsController = async (
  req: Request<ParamsInput>,
  res: Response
) => {
  try {
    const video = await VideoStatsModel.findByPk(req.params.videoId);

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

export const findAllVideoStatsController = async (
  req: Request<{}, {}, {}, FilterQueryInput>,
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
    
    const videos = await VideoVideoStatsModelModel.findAndCountAll({ limit, offset: skip, order: [sort] });
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
  req: Request<ParamsInput>,
  res: Response
) => {
  try {
    const result = await VideoStatsModel.destroy({
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
