const { Op } = require('sequelize');

import { db, sequelize } from "../util/db";
const Video = db.video;
const VideoStats = db.videoStats;
const Channel = db.channel;
const ChannelStats = db.channelStats;
const Creator = db.creator;


// Set up the API request parameters
const apiKey = 'AIzaSyA9IHgl5-gGaQYpN01q2TiYcF5mKw6TQ8A';

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
        creators.map((creator) => {
            const channel = creator.channels.find((it) => it.custom_url === creator.custom_url);
            Creator.update({
                banner_picture: channel.banner_url,
                profile_picture: channel.logo_url
            }, {where: {id : creator.id}});
        })
    }

    async fetchChannelDataFromAPI(channelId: any) {
        console.log('fetchChannelInfo()' + channelId);

        const url = `https://www.googleapis.com/youtube/v3/channels?part=snippet,statistics,brandingSettings&id=${channelId}&key=${apiKey}`;
        let response = await fetch(url);

        return response.json(); //await
    }

    async fetchVideoDataFromAPI(channelId: any, nextPageToken: any) {
        let url = `https://www.googleapis.com/youtube/v3/search?key=${apiKey}&channelId=${channelId}&part=snippet,id&order=date&maxResults=50&pageToken=${nextPageToken}`;
        let response = await fetch(url);

        return response.json();
    }

    async fetchAndCreateVideosFromChannel(channelId: any) {

        let nextPageToken = '';

        let allVideos: any[] = [];
        let data: any;

        do {
            try {
                data = await this.fetchVideoDataFromAPI(channelId, nextPageToken);
            } catch (error: any) {
                console.log('Error fetching videos for: ' + channelId);
                console.error(error);
            }

            // console.log(data);
            let videoIds = data.items.map(item => item.id.videoId).join(',');
            let videoUrl = `https://www.googleapis.com/youtube/v3/videos?part=snippet,statistics,contentDetails,player,liveStreamingDetails&id=${videoIds}&key=${apiKey}`;
            let videoResponse = await fetch(videoUrl);
            let videoData = await videoResponse.json();

            videoData.items?.forEach(async (item: any) => {
                try {
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
                            'url': item.snippet.thumbnails.high.url,
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
                            'url': item.snippet.thumbnails.high.url,
                            'published_at': item.snippet.publishedAt,
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
                        'fetched_at': new Date()
                    })

                } catch (error: any) {
                    console.log('error fetching and saving video: ')
                    console.error(error);
                }
            });

            nextPageToken = data.nextPageToken;

        } while (nextPageToken);
        return allVideos;
    }


    async fetchChannelData(channelId: any) {
        // Fetch channel data using the YouTube API
        const data = await this.fetchChannelDataFromAPI(channelId);

        // const channelId = data.items[0].id;
        const channelTitle = data.items[0].snippet.title;
        const channelDescription = data.items[0].snippet.description;
        const viewCount = data.items[0].statistics.viewCount;
        const subscriberCount = data.items[0].statistics.subscriberCount;
        const videoCount = data.items[0].statistics.videoCount;
        const logo = data.items[0].snippet.thumbnails.high.url;
        const banner = data.items[0].brandingSettings.image ? data.items[0].brandingSettings.image.bannerExternalUrl : null;


        // Store channel data in the database
        const channelExists = await Channel.findOne({ where: { channel_id: channelId } });
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
                'banner_url': banner,
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
                'logo_url': logo,
                'custom_url': data.items[0].snippet.customUrl
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


    async fetchStatisticsForAllChannels() {
        console.info("STARTING JOB");
        console.log('starting job');
        try {
            const channels = await Channel.findAll();

            for (const channel of channels) {
                console.info('Channel ', channel.channel_id);
                await this.fetchChannelData(channel.channel_id);

                // TODO refactor to update
                await this.fetchAndCreateVideosFromChannel(channel.channel_id);
            }
            console.info('finished job');

        } catch (error) {
            console.error('Error fetching YouTube statistics:', error);
        }
    }
}

module.exports = YoutubeService;