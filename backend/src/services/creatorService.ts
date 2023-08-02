const { Op } = require('sequelize');

import { db, sequelize } from "../util/db";
import { now } from "sequelize/types/utils";
const Video = db.video;
const VideoStats = db.videoStats;
const Channel = db.channel;
const ChannelStats = db.channelStats;
const Creator = db.creator;
const { v4: uuidv4 } = require('uuid');

class CreatorService {

    async create(name: string, custom_url: string, profile_picture: string, banner_picture: string) {
        console.log('creating new Creator', name);
        const exists = await Creator.findOne({ where: { custom_url: custom_url } });
        if (exists) {
            throw 'AlreadyExistsException(custom_url)';
        }
        const creator = await Creator.create({
            id: uuidv4(),
            name: name,
            custom_url: custom_url,
            profile_picture: profile_picture,
            banner_picture: banner_picture,
            created_at: new Date(),
            updated_at: new Date()
        });

        return creator;
    }
}

module.exports = CreatorService;