const { Op } = require('sequelize');

import { db, sequelize } from "../util/db";
import { now } from "sequelize/types/utils";
const Video = db.video;
const VideoStats = db.videoStats;
const Channel = db.channel;
const ChannelStats = db.channelStats;
const Creator = db.creator;
const { v4: uuidv4 } = require('uuid');

class VideoService {

    async update(videoId: string, tags: [], series: [], directedBy: [], cast: []) {
        console.log('Updating video: ', videoId);
        const updateBody= {};
        if(tags && tags.length>0) {
            updateBody['tags']= tags;
        }
        if(series && series.length>0) {
            updateBody['tags']= tags;
        }
        if(directedBy && directedBy.length>0) {
            updateBody['tags']= tags;
        }
        if(cast && cast.length>0) {
            updateBody['tags']= tags;
        }

        // await video.update({ tags: associatedTag, serie: seriesTag });
        // associate cast and directedBy
       return await Video.update(
            { updateBody, updated_at: Date.now() },
            {
                where: {
                    video_id: videoId,
                },
            }
        );
    }
}

module.exports = VideoService;