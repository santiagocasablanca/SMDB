import axios from "axios";

import { IChannelResponse } from "./types";

const BASE_URL = "http://localhost:8005/api/";

export const channelApi = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
});


export const getChannelsFn = async (page = 1, limit = 30, params) => {
  console.log(page + " - " + limit + ' - ' + params);

  const req = `channels?page=${page}&limit=${limit}&${params}`;
  // if(params) req.concat(`&${params}`);

  console.log(req);
  const response = await channelApi.get<IChannelResponse>(
    req
  );
  return response.data;
};
