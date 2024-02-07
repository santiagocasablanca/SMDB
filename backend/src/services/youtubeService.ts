const { Op, QueryTypes } = require('sequelize');
const { Sequelize } = require('sequelize');

import { db, sequelize } from "../util/db";
import { sendErrorEmail } from './emailService';
import { now } from "sequelize/types/utils";
const Video = db.video;
const VideoStats = db.videoStats;
const Channel = db.channel;
const ChannelStats = db.channelStats;
const Creator = db.creator;

async function parseDuration(durationString) {

    const regex = /PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/;
    const matches = durationString.match(regex);

    if (!matches) {
        // Return 0 or any other default value if the durationString does not match the format.
        return 0;
    }
    const hours = matches[1] ? parseInt(matches[1]) : 0;
    const minutes = matches[2] ? parseInt(matches[2]) : 0;
    const seconds = matches[3] ? parseInt(matches[3]) : 0;
    return hours * 3600 + minutes * 60 + seconds;
}

async function delay(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

const apiKey = process.env.API_KEY;

class YoutubeService {

    async updateAllCreatorPicturesFromMainChannel() {
        const creators = await Creator.findAll({
            include: {
                model: Channel,
                as: 'channels', attributes: ['channel_id', 'custom_url',
                    'title',
                    'subs',
                    'videos',
                    'views',
                    'likes',
                    'comments',
                    'logo_url',
                    'banner_url',
                    'channel_created_at']
            }
        });

        for (const creator of creators) {
            // console.log('Iterating creators: ', creator.name, creator.custom_url, creator.banner_picture);
            // console.log('channels: ', creator.channels.map(ch => { return ch.custom_url; }))

            const channel = creator.channels.find(({ custom_url }) => custom_url === creator.custom_url);

            console.log('channel found: ', channel?.channel_id, channel?.custom_url, channel?.banner_url);
            if (channel) {

                await Creator.update({
                    banner_picture: channel.banner_url,
                    // profile_picture: channel.logo_url
                }, { where: { id: creator.id } });
            }
        }
    }

    async handleApiRequest(url, maxRetries = 3, currentRetries = 0) {
        try {
            console.log('calling YOUTUBE API: ', url);
            const response = await fetch(url);
            return await response.json();
        } catch (error) {
            console.error(`Error fetching data from API (${url}):`, error.status, error.message);

            if (this.shouldRetry(error, maxRetries, currentRetries)) {
                console.log('Retrying the connection...', maxRetries, currentRetries);
                await delay(1000);
                return this.handleApiRequest(url, maxRetries, currentRetries + 1);
            } else {
                throw error;
            }
        }
    }

    shouldRetry(error, maxRetries, currentRetries) {
        if (currentRetries < maxRetries) {
            // Add conditions to check for specific errors that warrant a retry
            if (error.code === 'EAI_AGAIN') {
                // Example: Retry for DNS lookup errors
                console.error('DNS resolution failed. Might retry the connection.');
                return true;
            } else if (error.errors && error.errors[0].reason === 'quotaExceeded') {
                // If the error is quotaExceeded, do not retry
                console.error('Quota Exceeded. No retry will be made.');
                throw error;
            }
        }
        return false;
    }

    async fetchChannelDataFromAPI(channelId: any) {
        const url = `https://www.googleapis.com/youtube/v3/channels?part=snippet,contentDetails,statistics,brandingSettings&id=${channelId}&key=${apiKey}`;
        return await this.handleApiRequest(url);
    }

    // https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&maxResults=50&playlistId=UUDogdKl7t7NHzQ95aEwkdMw&pageToken=EAAaB1BUOkNQb0I&_=1688923054074

    async fetchVideoDataFromAPI(playlistId: any, nextPageToken: any) {
        let url = `https://www.googleapis.com/youtube/v3/playlistItems?key=${apiKey}&playlistId=${playlistId}&part=snippet,id&maxResults=50&pageToken=${nextPageToken}`;
        return await this.handleApiRequest(url);
    }

    async fetchLatestVideoDataFromAPI(playlistId: any, nextPageToken: any) {
        let url = `https://www.googleapis.com/youtube/v3/playlistItems?key=${apiKey}&playlistId=${playlistId}&part=snippet,id&maxResults=50&pageToken=${nextPageToken}`;
        return await this.handleApiRequest(url);
    }


    async fetchAndCreateVideosFromChannel(channelId: any, playlistId: any) {

        let nextPageToken = '';

        let allVideos: any[] = [];
        let data: any;
        let index = 0;

        do {
            try {
                data = await this.fetchVideoDataFromAPI(playlistId, nextPageToken);
                await delay(500);
            } catch (error: any) {
                console.log('Error fetching playlist videos for playlist id: ' + playlistId);
                console.error(error);
                throw error;
            }

            // console.log(data.nextPageToken, data.prevPageToken, data);
            let videoData;
            try {
                let videoIds = data.items.map(item => item.snippet.resourceId.videoId).join(',');
                let videoUrl = `https://www.googleapis.com/youtube/v3/videos?part=snippet,statistics,contentDetails,player,liveStreamingDetails&id=${videoIds}&key=${apiKey}`;
                console.log('calling YOUTUBE API: ', videoUrl);

                let videoResponse = await fetch(videoUrl);
                videoData = await videoResponse.json();
            } catch (error: any) {
                console.log('Error fetching videos for: ' + playlistId);
                console.error(error);
                throw error;
            }

            videoData.items?.forEach(async (item: any) => {
                try {
                    index++;
                    // console.log(index);
                    const parsedDuration = await parseDuration(item.contentDetails.duration);
                    const videoExists = await Video.findOne({ where: { video_id: item.id } });
                    if (!videoExists) {
                        await Video.create({
                            'video_id': item.id,
                            'title': item.snippet.title,
                            'description': item.snippet.description,
                            'channel_id': item.snippet.channelId,
                            'channel_title': item.snippet.channelTitle,
                            'views': item.statistics.viewCount,
                            'likes': item.statistics.likeCount,
                            'dislikes': item.statistics.dislikeCount,
                            'comments': item.statistics.commentCount,
                            'duration': item.contentDetails.duration,
                            'duration_parsed': parsedDuration,
                            'url': item.snippet.thumbnails.maxres ? item.snippet.thumbnails.maxres?.url : item.snippet.thumbnails.high.url,
                            'player': item.player,
                            'published_at': item.snippet.publishedAt,
                            'livestream': item.liveStreamingDetails,
                            'original_blob': item
                        });
                    } else {
                        await Video.update({
                            'video_id': item.id,
                            'title': item.snippet.title,
                            'views': item.statistics.viewCount,
                            'likes': item.statistics.likeCount,
                            'dislikes': item.statistics.dislikeCount,
                            'comments': item.statistics.commentCount,
                            'duration': item.contentDetails.duration,
                            'duration_parsed': parsedDuration,
                            'url': item.snippet.thumbnails.maxres ? item.snippet.thumbnails.maxres?.url : item.snippet.thumbnails.high.url,
                            'published_at': item.snippet.publishedAt,
                            'updated_at': new Date(),
                            'livestream': item.liveStreamingDetails,
                            'original_blob': item
                        }, { where: { video_id: item.id } });
                    }

                    await VideoStats.create({
                        'video_id': item.id,
                        'views': item.statistics.viewCount,
                        'likes': item.statistics.likeCount,
                        'dislikes': item.statistics.dislikeCount,
                        'comments': item.statistics.commentCount,
                        'fetched_at': new Date(),
                        'fetched_date': new Date()
                    })

                } catch (error: any) {
                    console.log('error fetching and saving video: ')
                    console.error(error);
                    throw error;
                }
            });

            try {
                await Channel.update({ 'updated_at': new Date() }, { where: { channel_id: channelId } });
            } catch (error: any) {
                console.log('error updating channel: ')
                console.error(error);
                throw error;
            }

            console.log(index);
            await delay(1000);
            nextPageToken = data.nextPageToken;
            console.log(nextPageToken);

        } while (nextPageToken);
        return allVideos;
    }


    async fetchChannelData(channelId: any) {
        console.log('youtube service: ', channelId)
        // Fetch channel data using the YouTube API
        const data = await this.fetchChannelDataFromAPI(channelId);

        // const channelId = data.items[0].id;
        const channelTitle = data.items[0].snippet.title;
        const channelDescription = data.items[0].snippet.description;
        const viewCount = data.items[0].statistics.viewCount;
        const subscriberCount = data.items[0].statistics.subscriberCount;
        const videoCount = data.items[0].statistics.videoCount;
        const logo = data.items[0].snippet.thumbnails.maxres ? data.items[0].snippet.thumbnails.maxres.url : data.items[0].snippet.thumbnails.high.url;
        const banner = data.items[0].brandingSettings.image ? data.items[0].brandingSettings.image.bannerExternalUrl : null;
        const playlistId = data.items[0].contentDetails.relatedPlaylists.uploads;


        // Store channel data in the database
        let channelExists = await Channel.findOne({ where: { channel_id: channelId } });
        if (!channelExists) {
            // create
            await Channel.create({
                'channel_id': channelId,
                'title': channelTitle,
                'description': channelDescription,
                'views': viewCount,
                'subs': subscriberCount,
                'videos': videoCount,
                'logo_url': logo,
                'channel_created_at': data.items[0].snippet.publishedAt,
                'banner_url': banner,
                'playlist_id': playlistId,
                'custom_url': data.items[0].snippet.customUrl
            });
        } else {
            // update
            await Channel.update({
                'channel_id': channelId,
                'title': channelTitle,
                'description': channelDescription,
                'views': viewCount,
                'subs': subscriberCount,
                'videos': videoCount,
                'channel_created_at': data.items[0].snippet.publishedAt,
                'logo_url': logo,
                'banner_url': banner,
                'playlist_id': playlistId,
                'custom_url': data.items[0].snippet.customUrl,
                'updated_at': new Date(),
            }, { where: { channel_id: channelId } });

        }

        await ChannelStats.create({
            'channel_id': channelId,
            'views': viewCount,
            'subs': subscriberCount,
            'videos': videoCount,
            'fetched_at': new Date()
        })
    }

    async fetchAndCreateRecentVideosFromChannel(channelId: any, playlistId: any) {


        let allVideos: any[] = [];
        let data: any;
        let index = 0;

        try {
            data = await this.fetchLatestVideoDataFromAPI(playlistId, "");
            await delay(500);

            let videoIds = data.items.map(item => item.snippet.resourceId.videoId).join(',');
            let videoUrl = `https://www.googleapis.com/youtube/v3/videos?part=snippet,statistics,contentDetails,player,liveStreamingDetails&id=${videoIds}&key=${apiKey}`;
            console.log('calling YOUTUBE API: ', videoUrl);

            let videoResponse = await fetch(videoUrl);
            let videoData = await videoResponse.json();


            videoData.items?.forEach(async (item: any) => {

                index++;
                // console.log(index);
                const parsedDuration = await parseDuration(item.contentDetails.duration);
                const videoExists = await Video.findOne({ where: { video_id: item.id } });
                if (!videoExists) {
                    await Video.create({
                        'video_id': item.id,
                        'title': item.snippet.title,
                        'description': item.snippet.description,
                        'channel_id': item.snippet.channelId,
                        'channel_title': item.snippet.channelTitle,
                        'views': item.statistics.viewCount,
                        'likes': item.statistics.likeCount,
                        'dislikes': item.statistics.dislikeCount,
                        'comments': item.statistics.commentCount,
                        'duration': item.contentDetails.duration,
                        'duration_parsed': parsedDuration,
                        'url': item.snippet.thumbnails.maxres ? item.snippet.thumbnails.maxres.url : item.snippet.thumbnails.high.url,
                        'player': item.player,
                        'published_at': item.snippet.publishedAt,
                        'livestream': item.liveStreamingDetails,
                        'original_blob': item
                    });
                } else {
                    await Video.update({
                        'video_id': item.id,
                        'title': item.snippet.title,
                        'views': item.statistics.viewCount,
                        'likes': item.statistics.likeCount,
                        'dislikes': item.statistics.dislikeCount,
                        'comments': item.statistics.commentCount,
                        'duration': item.contentDetails.duration,
                        'duration_parsed': parsedDuration,
                        'url': item.snippet.thumbnails.maxres ? item.snippet.thumbnails.maxres.url : item.snippet.thumbnails.high.url,
                        'published_at': item.snippet.publishedAt,
                        'updated_at': new Date(),
                        'livestream': item.liveStreamingDetails,
                        'original_blob': item
                    }, { where: { video_id: item.id } });
                }

                await VideoStats.create({
                    'video_id': item.id,
                    'views': item.statistics.viewCount,
                    'likes': item.statistics.likeCount,
                    'dislikes': item.statistics.dislikeCount,
                    'comments': item.statistics.commentCount,
                    'fetched_at': new Date(),
                    'fetched_date': new Date()
                })


            });

            await Channel.update({ 'updated_at': new Date() }, { where: { channel_id: channelId } });
            console.log(index);

        } catch (error: any) {
            console.log('Error fetching playlist videos for playlist id: ' + playlistId);
            console.error(error);
            throw error;
        }
        return allVideos;
    }

    async fetchStatisticsForAllChannels() {
        console.log('Starting Job :: fetchStatisticsForAllChannels');
        try {
            const channels = await Channel.findAll({ order: [['updated_at', 'ASC']] });

            for (const channel of channels) {
                console.log('Starting for channel: ', channel.title);
                await this.fetchChannelData(channel.channel_id);

                // TODO refactor to update
                await this.fetchAndCreateVideosFromChannel(channel.channel_id, channel.playlist_id);

                await delay(1000);
                console.log('Finished channel: ', channel.title);
            }
            console.info('Finished job fetchStatisticsForAllChannels');
            // await this.refreshMaterializedView();

        } catch (error) {
            console.error('Error fetching All YouTube statistics:', error);
            // await sendErrorEmail(error, 'fetchStatisticsForAllChannels');
            process.exit();
        }
    }

    async fetchLatestStatisticsForAllChannels() {
        console.log('Starting Job :: fetchLastestStatisticsForAllChannels');
        try {
            const range = new Date();
            range.setMinutes(range.getMinutes() - 30); // not updated on the last 30 minutes 
            const channels = await Channel.findAll({ where: { updated_at: { [Op.lt]: range } }, order: [['updated_at', 'ASC']] });
            for (const channel of channels) {
                console.log('Starting for channel: ', channel.title);
                await this.fetchChannelData(channel.channel_id);

                await this.fetchAndCreateRecentVideosFromChannel(channel.channel_id, channel.playlist_id);
                await delay(500);

                console.log('Finished channel: ', channel.title);
            }
            console.info('Finished job fetchLastestStatisticsForAllChannels');
            // await this.refreshMaterializedView();

        } catch (error) {
            console.error('Error fetching Latest YouTube statistics:', error);
            // await sendErrorEmail(error, 'fetchLastestStatisticsForAllChannels');
            process.exit();
        }
    }
    // 

    async fetchChannelAndVideoData(channelId: any) {
        await this.fetchChannelData(channelId);
        const channel = await Channel.findOne({ where: { channel_id: channelId } });
        await this.fetchAndCreateVideosFromChannel(channel.channel_id, channel.playlist_id);
        return channel;
    }

    async refreshMaterializedView() {
        try {

            const startTime = new Date();
            console.log(`Materializing video_stats_view... ${startTime} `);

            // REFRESH MATERIALIZED VIEW CONCURRENTLY public.video_stats_view
            sequelize.query('REFRESH MATERIALIZED VIEW CONCURRENTLY public.video_stats_view', {
                type: QueryTypes.SELECT,
                raw: true,
            }).then(() => {
                const endTime = new Date();
                const executionTime = endTime.getTime() - startTime.getTime(); // Time difference in milliseconds

                console.log(`Materialized view refreshed successfully. ${startTime} | ${endTime} | Time taken: ${executionTime}ms`);
            }).catch(error => {
                console.error('Error refreshing materialized view:', error.message);
            });


        } catch (error) {
            console.error('Error refreshing materialized view:', error.message);
        }
    }
}

module.exports = YoutubeService;