const { Op } = require('sequelize');

import { db, sequelize } from "./util/db";
const Video = db.video;
const Channel = db.channel;
const ChannelStats = db.ChannelStats;
const VideoStats = db.VideoStats;

// Set up the API request parameters
const apiKey = 'AIzaSyA9IHgl5-gGaQYpN01q2TiYcF5mKw6TQ8A';

class YoutubeService {

    async fetchChannelDataFromAPI(channelId: any) {
        console.log('fetchChannelInfo()' + channelId);

        const url = `https://www.googleapis.com/youtube/v3/channels?part=snippet,statistics&id=${channelId}&key=${apiKey}`;
        let response = await fetch(url);

        return response.json(); //await
    }

    async fetchVideoDataFromAPI(channelId: any) {

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
        const logo = data.items[0].snippet.thumbnails.medium.url;

        // Store channel data in the database
        await Channel.findOrCreate({
            defaults: {
                'channel_id': channelId,
                'title': channelTitle,
                'description': channelDescription,
                'views': viewCount,
                'subs': subscriberCount,
                'videos': videoCount,
                'logo_url': logo,
                'customUrl': data.items[0].snippet.customUrl
            },
            where: { channel_id: channelId }
        });

    }

    async fetchVideoData(videoId: any) {
        // Fetch video data using the YouTube API
        const data = await this.fetchVideoDataFromAPI(videoId);

        // Store video data in the database
        await Video.findOrCreate({
            where: { videoId },
            defaults: {
                // Save the relevant video data fields
                title: videoData.title,
                description: videoData.description,
                // ...
            },
        });
    }


    async fetchStatisticsForAllChannels() {
        try {
            const channels = await Channel.findAll();

            for (const channel of channels) {
                await this.fetchChannelData(channel.channelId);

                const videos = await Video.findAll({
                    where: { channelId: channel.channelId },
                });

                for (const video of videos) {
                    await this.fetchVideoData(video.videoId);
                }
            }
        } catch (error) {
            console.error('Error fetching YouTube statistics:', error);
        }
    }
}

module.exports = YoutubeService;