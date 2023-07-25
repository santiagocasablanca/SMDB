import axios from "axios";
import { IVideo, IVideoResponse, IVideosResponse } from "./types";


const BASE_URL = process.env.REACT_APP_BASE_URL || "http://localhost:8005/api/";

export const videoApi = axios.create({
  baseURL: BASE_URL,
  withCredentials: false,
});

// videoApi.defaults.headers.common["content-type"] = "application/json";

export const getSingleVideoFn = async (videoId: string) => {
  const response = await videoApi.get<IVideoResponse>(`videos/${videoId}`);
  return response.data;
};

export const getTreeMapPlotForTagsFn = async (params) => {
  // findMostLikedSSGroupedBySeries
  const req = `findMostLikedSSGroupedBySeries?${params}`;
  const response = await videoApi.get<IVideosResponse>(
    req
  );
  return response.data;
};

 //
 export const fetchVideoFrequencyFn = async (params) => {
  // fetchVideoFrequency
  const req = `fetchVideoFrequency?${params}`;
  const response = await videoApi.get<IVideosResponse>(
    req
  );
  return response.data;
};


export const fetchVideosChannelStatsFn = async (params) => {
  // fetchVideoFrequency
  const req = `fetchVideosChannelStats?${params}`;
  const response = await videoApi.get<IVideosResponse>(
    req
  );
  return response.data;
};

export const fetchVideoUploadTimeFrequencyFn = async (params) => {
  // fetchVideoFrequency
  const req = `fetchVideoUploadTimeFrequency?${params}`;
  const response = await videoApi.get<IVideosResponse>(
    req
  );
  return response.data;
};

export const getVideosFn = async (page = 1, limit = 30, params) => {
  const req = `videos?page=${page}&limit=${limit}&${params}`;
  // if(params) req.concat(`&${params}`);
  const response = await videoApi.get<IVideosResponse>(
    req
  );
  return response.data;
};

export const getVideoFn = async (id) => {
  const req = `videos/${id}`;

  const response = await videoApi.get<IVideosResponse>(
    req
  );
  return response.data;
};

export const fetchAllSeries = async () => {
  const req = `fetchAllSeries`;
  const response = await videoApi.get<IVideosResponse>(
    req
  );
  return response.data;
};

export const fetchAllTags = async () => {
  const req = `fetchAllTags`;
  const response = await videoApi.get<IVideosResponse>(
    req
  );
  return response.data;
};
