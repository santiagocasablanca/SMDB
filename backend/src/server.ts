require("dotenv").config();
import express, { Request, Response } from "express";
import morgan from "morgan";
import cors from "cors";
import noteRouter from "./routes/routes";


const natural = require('natural');
const tokenizer = new natural.WordTokenizer();

import { db, sequelize } from "./util/db";
const Video = db.video;
const Channel = db.channel;

const app = express();

app.use(express.json({ limit: "10kb" }));
if (process.env.NODE_ENV === "development") app.use(morgan("dev"));

app.use(
  cors({
    origin: ["http://localhost:3000"],
    credentials: true,
  })
);

app.get("/api/healthchecker", (req: Request, res: Response) => {
  res.status(200).json({
    status: "success",
    message: "Build CRUD API with Node.js and Sequelize",
  });
});

app.use("/api/", noteRouter);

app.all("*", (req: Request, res: Response) => {
  res.status(404).json({
    status: "fail",
    message: `Route: ${req.originalUrl} does not exist on this server`,
  });
});

const PORT = process.env.PORT;
// app.listen(PORT, async () => {
//   console.log("🚀Server started Successfully");
//   await connectDB();
//   sequelize.sync({ force: false }).then(() => {
//     console.log("✅Synced database successfully...");
//     // extractRelevantTagsFromTitles();
//     // associateTagsToVideos();
//   });
//   channel_ids.forEach(item => {
//     // fetchVideos(item);
//   })
// });

db.sequelize
  .sync()
  .then(() => {
    console.log("Database connected");
    app.listen(PORT, async () => {
      console.log("listening at port 8005");

      //extractRelevantTagsFromTitles();
      associateTagsToVideos();

      channel_ids.forEach(item => {
        console.log("fetching for channel " +  item);
        // fetchChannelInfo(item);
            // fetchVideos(item);
      })
    })
  })
  .catch(err => console.log(err));


// Set up the API request parameters
const apiKey = 'AIzaSyA9IHgl5-gGaQYpN01q2TiYcF5mKw6TQ8A';

const channel_ids = [
  "UCDogdKl7t7NHzQ95aEwkdMw", // Sidemen
  "UCh5mLn90vUaB1PbRRx_AiaA", // MoreSidemen
  "UCjRkTl_HP4zOh3UFaThgRZw", // SidemenReacts
  "UCWZmCMB7mmKWcXJSIPRhzZw", // https://www.youtube.com/@Miniminter, 
  "UCjB_adDAIxOL8GA4Y4OCt8g", // https://www.youtube.com/@MM7Games, 
  "UCFPElAbES8GHfBZrDrGbSLQ", // https://www.youtube.com/@Whatsgoodpodcast, 
  "UCPwrSW0HPiba4lu1DW_zdjA", // https://www.youtube.com/@RandolphUK, 
  // wrong "UCFPElAbES8GHfBZrDrGbSLQ" // https://www.youtube.com/@Randolph2
  // "UCD1XaKkzzLbEAzZkhvOuLjg", // Zerkaa
  // "UC5PwFB_HLMhGyjKrUj7GMDw", // KSI
  // "UCUKi4zY5ETSqrKAjTBgjM-g", // Behzinga
  // "UCvtRTOMP2TqYqu51xLUIDRg", // Vikkstar123
  // "UCDf19MozdSZdDO6UOz6FY9Q", // TBJZL
  // "UCYzPXprvl5Y-Sf0g4vX-m6g", // W2S
  // "UCpXf6KALwsth7owH6_2sV7w" // Calfreezy
];

async function fetchChannelInfo(_channel_id) {

  console.log('fetchChannelInfo()' + _channel_id);
 

  const url = `https://www.googleapis.com/youtube/v3/channels?part=snippet,statistics&id=${_channel_id}&key=${apiKey}`;
  let response = await fetch(url);
    
  let data = await response.json();
  console.log('data: ' + JSON.stringify(data));

  // const channelData = JSON.parse(data);

  // Extract relevant attributes from the API response
  const channelId = data.items[0].id;
  const channel_title = data.items[0].snippet.title;
  const channelDescription = data.items[0].snippet.description;
  const viewCount = data.items[0].statistics.viewCount;
  const subscriberCount = data.items[0].statistics.subscriberCount;
  const videoCount = data.items[0].statistics.videoCount;
  const logo = data.items[0].snippet.thumbnails.medium.url;

  const channel = Channel.findOrCreate({
    defaults: {
    'channel_id': _channel_id,
    'title': channel_title,
    'description': channelDescription,
    'views': viewCount,
    'subs': subscriberCount,
    'videos': videoCount,
    'logo_url': logo,
    'customUrl': data.items[0].snippet.customUrl
    },
    where: { channel_id: _channel_id }
  });

  return;
}



async function fetchVideos(_channel_id) {
  console.log('fetchVideos()' + _channel_id);

  let nextPageToken = '';

  let allVideos: any[] = [];

  do {
    let url = `https://www.googleapis.com/youtube/v3/search?key=${apiKey}&channelId=${_channel_id}&part=snippet,id&order=date&maxResults=50&pageToken=${nextPageToken}`;     
    let response = await fetch(url);
    
    let data = await response.json();
    
    // console.log('data: ' + JSON.stringify(data));
    // TODO pre save videos here data.items (videoId)

    let videoIds = data.items.map(item => item.id.videoId).join(',');
    let videoUrl = `https://www.googleapis.com/youtube/v3/videos?part=snippet,statistics,contentDetails,player,liveStreamingDetails&id=${videoIds}&key=${apiKey}`;
    let videoResponse = await fetch(videoUrl);
    let videoData = await videoResponse.json();
    
    videoData.items.forEach((item: any) => {
      // console.log('size ' + JSON.stringify(item))
      // console.log('duration ' + JSON.stringify(item.contentDetails))
        try {
          const video = Video.findOrCreate({
            defaults: {
            'videoId': item.id,
            'title': item.snippet.title,
            'description': item.snippet.description,
            'channel_id': item.snippet.channelId,
            'channel_title': item.snippet.channel_title,
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
          },
          where: { video_id: item.id }
        });
      
        console.log('ok');
      } catch (error: any) {
        console.log('error: ' + error.name)
    
      }
    });


    nextPageToken = data.nextPageToken;

  } while (nextPageToken);

  

  return allVideos;
};

const seriesCategories = [
  { category: 'Tinder', keywords: ['tinder'] },
  { category: '20vs1', keywords: ['20 WOMEN VS 1 SIDEMEN' ] },
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
  { category: 'Football', keywords: ['football', 'goal', 'charity', 'match'],  },
  { category: 'Tinder', keywords: ['tinder'] },
  { category: '20vs1', keywords: ['20 WOMEN VS 1 SIDEMEN' ] },
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
  { category: 'Gaming', keywords: ['game', 'play', 'GTA', 'among', 'minecraft', 'fifa', 'fall guys', 'gartic phone']},
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

// Function to determine the associated tags for a video
function determineTags(title) {
  const tokenizer = new natural.WordTokenizer();
  const titleTokens = tokenizer.tokenize(title.toLowerCase());

  const associatedTags = [];

  tagCategories.forEach((tagCategory) => {
    let matchCount = 0;
    tagCategory.keywords.forEach((keyword) => {
      const keywordTokens = tokenizer.tokenize(keyword.toLowerCase());
      if (containsPhrase(titleTokens, keywordTokens)) {
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
function containsPhrase(tokens, phraseTokens) {
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
async function associateTagsToVideos() {
  try {
    // Retrieve all videos from the database
    const videos = await Video.findAll();

    // Process each video and associate a tag
    for (const video of videos) {
      const associatedTag = determineTags(video.title);
      let seriesTag = "";

      if (video.channel_title == 'SidemenReacts') {
        associatedTag.push('React');
      } else if (video.channel_title == 'Sidemen') {
        seriesCategories.forEach((category) => {

          if(associatedTag.includes(category.category)) {
            seriesTag = (category.category);
          } 
        })
      }

      console.log(seriesTag);
      // Update the video record with the associated tag
      await video.update({ tags: associatedTag, serie: seriesTag });
    }
    console.log('Tags associated successfully!');
  } catch (error) {
    console.error('Error associating tags:', error);
  }
}



// const extractRelevantTagsFromTitles = async () => {
//   try {
//     const videos = await VideoModel.findAll({
//       where:{
//         channel_title: 'Sidemen'
//       }
//     });

//     // Extract all video titles
//     const titles = videos.map((video) => video.title);

//     // Tokenize and clean up the titles
//     const tokenizedTitles = titles.map((title) => tokenizer.tokenize(title.toLowerCase()));

//     // Count the occurrence of each token in the titles
//     const tokenCounts = {};
//     for (const tokenizedTitle of tokenizedTitles) {
//       for (const token of tokenizedTitle) {
//         tokenCounts[token] = (tokenCounts[token] || 0) + 1;
//       }
//     }

//     // Filter out tokens with low occurrence counts
//     const relevantTags = Object.keys(tokenCounts).filter((token) => tokenCounts[token] >= 3 && token.length >= 3);


//      // Assign relevant tags to each video
//      for (const video of videos) {
//       const videoTags = [];
//       const videoTitleTokens = tokenizer.tokenize(video.title.toLowerCase());

//       for (const token of videoTitleTokens) {
//         if (relevantTags.includes(token)) {
//           videoTags.push(token);
//         }
//       }

//       video.tags = videoTags;
//       await video.save();
//     }

//     console.log('Relevant tags extraction completed successfully.');
//     console.log('Relevant tags:', relevantTags);
//   } catch (error) {
//     console.error('Error extracting relevant tags:', error);
//   }
// };