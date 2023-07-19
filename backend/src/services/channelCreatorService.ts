const { Op } = require('sequelize');

import { db, sequelize } from "../util/db";
import { now } from "sequelize/types/utils";
const Video = db.video;
const VideoStats = db.videoStats;
const Channel = db.channel;
const ChannelStats = db.channelStats;
const Creator = db.creator;


async function delay(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

class ChannelCreatorService {

    async associateWithCreatorWithChannel(channelId: any, creatorId: any) {
        console.log('associating')
            const channel = await Channel.findOne({where: { channel_id: channelId }}, {include: 'creators'});
            const creator = await Creator.findOne({where: {id: creatorId}});
            return await channel.addCreator(creator);
    }
}

module.exports = ChannelCreatorService;