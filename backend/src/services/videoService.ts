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

    // TODO redo
    async update(videoId: string, tags: [], series: string, directedBy: [], cast: [], game: string) {
        console.log('Updating video: ', videoId);
        const updateBody = {};
        if (tags && tags.length > 0) {
            updateBody['tags'] = tags;
        }
        if (series) {
            updateBody['serie'] = series;
        }
        if (game) {
            updateBody['game'] = game;
        }
        let transaction;

        try {
            // Start a transaction
            transaction = await sequelize.transaction();
            // Update the main Video entity
            const updatedVideo = await Video.update(
                { ...updateBody, updated_at: new Date() },
                {
                    where: {
                        video_id: videoId,
                    },
                },
                transaction

            );

            console.log('Video update successful.');

            // Create new records in the directedBy and cast tables if the arrays are not empty
            if (directedBy && directedBy.length > 0) {
                // DELETE records at DIRECTOR with :video_id
                // Delete existing records associated with the video_id in the director table
                await sequelize.query(
                    'DELETE FROM director WHERE video_id = :videoId',
                    {
                        replacements: { videoId },
                        transaction,
                    }
                );

                for (const creatorId of directedBy) {
                    await sequelize.query(
                        'INSERT INTO director (video_id, creator_id) VALUES (:videoId, :creatorId)',
                        {
                            replacements: { creatorId, videoId },
                            transaction,
                        }
                    );
                };
            }

            if (cast && cast.length > 0) {
                // DELETE records at VIDEO_CREATOR with :video_id
                await sequelize.query(
                    'DELETE FROM video_creator WHERE video_id = :videoId',
                    {
                        replacements: { videoId },
                        transaction,
                    }
                );

                await db.videoCreator.bulkCreate(
                    cast.map((creator: any) => ({
                        video_id: videoId,
                        creator_id: creator?.creator,
                        role: creator?.role
                    })),
                    { transaction }
                );
            }
            // Commit the transaction
            await transaction.commit();
            console.log('Associated records inserted successfully.');
            return updatedVideo;
        } catch (error) {
            console.error('Error updating video:', error);

            if (transaction) {
                await transaction.rollback();
            }

            return false;
        }

    }
}

module.exports = VideoService;