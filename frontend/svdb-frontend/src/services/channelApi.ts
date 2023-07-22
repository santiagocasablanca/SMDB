import axios from "axios";

import { IChannelResponse } from "./types";

const BASE_URL = process.env.REACT_APP_BASE_URL || "http://localhost:8005/api/";

export const channelApi = axios.create({
  baseURL: BASE_URL,
  withCredentials: false,
});


export const getChannelsFn = async (page = 1, limit = 30, params) => {
  const req = `channels?page=${page}&limit=${limit}&${params}`;
  const response = await channelApi.get<IChannelResponse>(
    req
  );
  
  return response.data;
};
