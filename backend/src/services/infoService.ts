const { Op } = require('sequelize');
const { Sequelize, QueryTypes } = require('sequelize');

import { db, sequelize } from "../util/db";
import { now } from "sequelize/types/utils";
const Video = db.video;
const VideoStats = db.videoStats;
const Channel = db.channel;
const ChannelStats = db.channelStats;
const Creator = db.creator;


class InfoService {

    async fetchDBInfo() {

        const query = "select count(distinct c.id) as creators, count(distinct ch.channel_id) as channels, (select updated_at from video order by updated_at desc limit 1)  as last_updated_at " +
            " from creator c " +
            " left join channel_creator cc on cc.creator_id = c.id " +
            " left join channel ch on cc.channel_id = ch.channel_id;";


        return await sequelize.query(query,
            {
                replacements: {},
                // bind: { initial: '2010-05-23 23:00:00.000 +00:00', final: '2023-06-23 23:00:00.000 +00:00', orderBy: 'likes desc' },
                type: QueryTypes.SELECT,
                logging: console.log,
                raw: true,

            }
        );
    }


}

module.exports = InfoService;