const { Op } = require('sequelize');

import { db, sequelize } from "../util/db";
import { now } from "sequelize/types/utils";

const natural = require('natural');
const tokenizer = new natural.WordTokenizer();

const Video = db.video;
const VideoStats = db.videoStats;
const Channel = db.channel;
const ChannelStats = db.channelStats;
const Creator = db.creator;


async function delay(ms: any) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}


const seriesCategories = [
    { category: 'Tinder', keywords: ['tinder'] },
    { category: '20vs1', keywords: ['20 WOMEN VS 1 SIDEMEN'] },
    { category: 'Road Trip', keywords: ['road TRIP', 'roadtrip', 'road trip'] },
    { category: 'Holiday', keywords: ['holiday'] },
    { category: 'Calories Challenge', keywords: ['calories', 'calorie'] },
    { category: 'Abandoned Challenge', keywords: ['abandoned'] },
    { category: 'Mukbang', keywords: ['mukbang'] },
    { category: 'Camping', keywords: ['camping'] },
    { category: 'Roast', keywords: ['roast'] },
    { category: 'Hide & Seek', keywords: ['hide', 'seek'] },
    { category: 'Sidemen Vs', keywords: ['sidemen vs'] },
    { category: 'Christmas Day', keywords: ['christmas day'] },
    { category: 'Christmas', keywords: ['christmas'] },
    { category: 'New Years Eve', keywords: ['new years eve'] },
    { category: 'Big Fat Quiz', keywords: ['fat quiz'] },
    { category: 'Cook Off', keywords: ['cook'] },
    { category: 'Gameshow', keywords: ['game show', 'gameshows', 'pointless', 'game of life', 'monopoly', 'the cube', 'family feud', 'who wants to be', 'the wheel'] },
    { category: '24 Hours', keywords: ['FOR 24 HOURS'] },
    { category: 'Race Across', keywords: ['race across'] },
    { category: 'Throw a Dart', keywords: ['throw'] },
    { category: 'Greatest Moments', keywords: ['greatest sidemen moments'] },
    { category: 'Pub Golf', keywords: ['pub'] },
    { category: 'Silent Library', keywords: ['library'] },
    { category: 'Try Not to Move', keywords: ['try not to move'] },
    { category: 'Bake off', keywords: ['bake'] },
    { category: 'Blind Date', keywords: ['blind date'] },
    { category: 'Hot vs Cold', keywords: ['hot vs cold'] },
];

// Define your tag categories and associated keywords
const tagCategories = [
    { category: 'Music', keywords: ['song', 'music video', 'artist', 'album'] },
    { category: 'Football', keywords: ['football', 'goal', 'charity', 'match'], },
    { category: 'Tinder', keywords: ['tinder'] },
    { category: '20vs1', keywords: ['20 WOMEN VS 1 SIDEMEN'] },
    { category: 'Road Trip', keywords: ['road TRIP', 'roadtrip', 'road trip'] },
    { category: 'Holiday', keywords: ['holiday'] },
    { category: 'Calories Challenge', keywords: ['calories', 'calorie'] },
    { category: 'Abandoned Challenge', keywords: ['abandoned'] },
    { category: 'Mukbang', keywords: ['mukbang'] },
    { category: 'Camping', keywords: ['camping'] },
    { category: 'Roast', keywords: ['roast'] },
    { category: 'Challenge', keywords: ['challenge'] },
    { category: 'Hide & Seek', keywords: ['hide', 'seek'] },
    { category: 'Among Us', keywords: ['among'] },
    { category: 'Gaming', keywords: ['game', 'play', 'GTA', 'among', 'minecraft', 'fifa', 'fall guys', 'gartic phone'] },
    { category: 'In Real Life', keywords: ['in real life'] },
    { category: 'Sidemen Vs', keywords: ['sidemen vs'] },
    { category: 'Christmas Day', keywords: ['christmas day'] },
    { category: 'New Years Eve', keywords: ['new years eve'] },
    { category: 'Waterpark', keywords: ['waterpark'] },
    { category: 'Big Fat Quiz', keywords: ['fat quiz'] },
    { category: 'Cook Off', keywords: ['cook'] },
    { category: 'Hotels', keywords: ['hotels', 'hotel'] },
    { category: 'Restaurant', keywords: ['restaurants', 'restaurant'] },
    { category: 'Gameshow', keywords: ['game show', 'gameshows', 'pointless', 'game of life', 'monopoly', 'the cube', 'family feud', 'who wants to be', 'the wheel'] },
    { category: '24 Hours', keywords: ['FOR 24 HOURS'] },
    { category: 'Race Across', keywords: ['race across'] },
    { category: 'Throw a Dart', keywords: ['throw'] },
    { category: 'Greatest Moments', keywords: ['greatest sidemen moments'] },
    { category: 'Pub Golf', keywords: ['pub'] },
    { category: 'Silent Library', keywords: ['library'] },
    { category: 'Try Not to Move', keywords: ['try not to move'] },
    { category: 'Bake off', keywords: ['bake'] },
    { category: 'Blind Date', keywords: ['blind date'] },
    { category: 'Christmas', keywords: ['christmas'] },
    { category: 'Extreme', keywords: ['extreme'] },
    { category: 'Rating', keywords: ['rate', 'who is'] },
    { category: 'GTA 5', keywords: ['gta'] },
    { category: 'Minecraft', keywords: ['minecraft'] },
    { category: 'Fall Guys', keywords: ['fall guys'] },
    { category: 'FIFA', keywords: ['fifa'] },
    { category: 'Hot vs Cold', keywords: ['hot vs cold'] },

    // Add more categories and keywords as needed
];

class VideoMetaService {


    // Function to determine the associated tags for a video
    determineTags(title: string) {
        const tokenizer = new natural.WordTokenizer();
        const titleTokens = tokenizer.tokenize(title.toLowerCase());

        const associatedTags: string[] = [];

        tagCategories.forEach((tagCategory) => {
            let matchCount = 0;
            tagCategory.keywords.forEach((keyword) => {
                const keywordTokens = tokenizer.tokenize(keyword.toLowerCase());
                if (this.containsPhrase(titleTokens, keywordTokens)) {
                    matchCount++;
                }
            });

            if (matchCount > 0) {
                associatedTags.push(tagCategory.category);
            }
        });

        return associatedTags;
    }


    // Function to check if a phrase is present in a given set of tokens
    containsPhrase(tokens: any, phraseTokens: any) {
        for (let i = 0; i < tokens.length - phraseTokens.length + 1; i++) {
            let found = true;
            for (let j = 0; j < phraseTokens.length; j++) {
                if (tokens[i + j] !== phraseTokens[j]) {
                    found = false;
                    break;
                }
            }
            if (found) {
                return true;
            }
        }
        return false;
    }


    // Function to associate tags for all videos
    async associateTagsToVideos() {
        try {
            // Retrieve all videos from the database
            const videos = await Video.findAll();

            // Process each video and associate a tag
            for (const video of videos) {
                const associatedTag = this.determineTags(video.title);
                let seriesTag = null;
                
                if (video.channel_title == 'SidemenReacts') {
                    associatedTag.push('React');
                } else if (video.channel_title == 'Sidemen') {
                    seriesCategories.forEach((category) => {
                        
                        if (associatedTag.includes(category.category)) {
                            seriesTag = (category.category);
                        }
                    })
                }
                
                console.log(associatedTag);
                console.log(seriesTag);
                // Update the video record with the associated tag
                await video.update({ tags: associatedTag, serie: seriesTag });
            }
            console.log('Tags associated successfully!');
        } catch (error) {
            console.error('Error associating tags:', error);
        }
    }

}

module.exports = VideoMetaService;