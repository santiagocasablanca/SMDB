import axios from "axios";
import { openDB, deleteDB, wrap, unwrap } from 'idb';


import { IChannelResponse } from "./types";

const BASE_URL = process.env.REACT_APP_BASE_URL || "http://localhost:8005/api/";

const DB_NAME = 'channelsDB';
const STORE_NAME = 'channelStats';


export const api = axios.create({
  baseURL: BASE_URL,
  withCredentials: false,
});

async function openDatabase() {
  return await openDB(DB_NAME, 1, {
    upgrade(db) {
      db.createObjectStore(STORE_NAME);
    },
  });
}

export const getCreatorStatsFn = async (params) => {
  const req = `creator/fetchStats?${params}`;
  const response = await api.get<IChannelResponse>(
    req
  );
  return response.data;
};


export const getChannelsFn = async (page = 1, limit = 30, params) => {
  const req = `channels?page=${page}&limit=${limit}&${params}`;
  const response = await api.get<IChannelResponse>(
    req
  );

  return response.data;
};

export const getChannelStatsFn = async (channel_id) => {
  // try {
  //   const cachedData = localStorage.getItem('channelStats');
  //   if (cachedData) {
  //     const parsedData = JSON.parse(cachedData);
  //     const channel = parsedData.find(entry => entry.channel_id === channel_id);
  //     return channel || null;
  //   } else {
  //     // Data not found in cache, fetch it and store it in cache
  //     console.log('shouldnt happen but either way: TODO implement DATA NOT FOUND in CACHE, fetch it from API and STORE it');
  //   }
  // } catch (error) {
  //   console.error('Error parsing cached data:', error);
  // }
  // console.log('fetching from cache: ', channel_id);
  try {
    const db = await openDatabase();
    const tx = db.transaction(STORE_NAME, 'readonly');
    const store = tx.objectStore(STORE_NAME);

    const cachedChannel = await store.get(channel_id);
    // console.log('found: ', cachedChannel );
    if (cachedChannel) {
      return cachedChannel;
    } else {
      // do nothing for now
      console.log('shouldnt happen but either way: TODO implement DATA NOT FOUND in CACHE, fetch it from API and STORE it');

    }
  } catch (error) {
    console.error('Error fetching or storing cached data:', error);
  }
};

export const storeChannelsOnCache = async (channels) => {
  try {

    const db = await openDatabase();
    const tx = db.transaction("channels", 'readwrite');
    const store = tx.objectStore("channels");

    for (const channel of channels) {
      await store.put(channel, channel.channel_id);
    }

    // Complete the transaction
    await tx.complete;

    // Close the database
    db.close();
  } catch (error) {
    console.error('Error fetching or storing data:', error);
  }
}


export const fetchAndCacheAllData = async (params) => {
  try {

    await getCreatorStatsFn(params)
      .then(async (result) => {

        // Fetch data and cache logic here
        const db = await openDatabase();
        const tx = db.transaction(STORE_NAME, 'readwrite');
        const store = tx.objectStore(STORE_NAME);

        const data = (result.results);
        let tempArray = [];
        for (const el of data) {
          let temp = {
            channel_id: el.channel_id,
            subs: {
              title: 'Total Subscribers',
              value: el.subs
            },
            views: {
              title: 'Total Views',
              value: el.views,
              avg: (el.views / el.total_videos),
              most: el.most_viewed,
              least: el.least_viewed
            },
            likes: {
              title: 'Total Likes',
              value: el.likes,
              avg: (el.likes / el.total_videos),
              most: el.most_liked,
              least: el.least_liked
            },
            comments: {
              title: 'Total Comments',
              value: el.comments,
              avg: (el.comments / el.total_videos),
              most: el.most_commented,
              least: el.least_commented
            },
            videos: {
              title: 'Videos Published',
              value: el.total_videos
            },
            duration: {
              title: 'Total Duration',
              value: el.duration,
              avg: (el.duration / el.total_videos),
              most: el.longest,
            }
          };
          tempArray.push(temp);
          // console.log('storing: ', temp);
          await store.put(temp, el.channel_id);
        }

        // Complete the transaction
        await tx.complete;

        // Close the database
        db.close();

        // localStorage.setItem('channelStats', JSON.stringify(tempArray));
      });
  } catch (error) {
    console.error('Error fetching or storing data:', error);
  }

}