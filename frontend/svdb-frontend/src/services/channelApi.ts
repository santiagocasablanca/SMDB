import axios from "axios";

import { IChannelResponse } from "./types";

const BASE_URL = process.env.REACT_APP_BASE_URL || "http://localhost:8005/api/";

export const channelApi = axios.create({
  baseURL: BASE_URL,
  withCredentials: false,
});

export const getChannelFn = async (id) => {
  const req = `channels/${id}`;

  const response = await channelApi.get<IChannelResponse>(
    req
  );
  return response.data;
};

export const getChannelsFn = async (page = 1, limit = 30, params) => {
  const req = `channels?page=${page}&limit=${limit}&${params}`;
  const response = await channelApi.get<IChannelResponse>(
    req
  );

  return response.data;
};

export const getChannelStatsFn = async (channel_id) => {
  try {
    const cachedData = localStorage.getItem('channelStats');
    if (cachedData) {
      const parsedData = JSON.parse(cachedData);
      const channel = parsedData.find(entry => entry.channel_id === channel_id);
      return channel || null;
    } else {
      // Data not found in cache, fetch it and store it in cache
      console.log('shouldnt happen but either way: TODO implement DATA NOT FOUND in CACHE, fetch it from API and STORE it');
    }
  } catch (error) {
    console.error('Error parsing cached data:', error);
  }
};
