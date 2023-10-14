import axios from "axios";
import { IVideoResponse, IVideosResponse } from "./types";


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

export const findGroupedByGameFn = async (params) => {
  // findMostLikedSSGroupedBySeries
  const req = `findGroupedByGame?${params}`;
  const response = await videoApi.get<IVideosResponse>(
    req
  );
  return response.data;
};

export const findGroupedByCastFn = async (params) => {
  const req = `fetchGroupedByCast?${params}`;
  const response = await videoApi.get<IVideosResponse>(
    req
  );
  return response.data;
};

export const fetchStatsGroupedByYearFn = async (params) => {
  const req = `fetchStatsGroupedByYear?${params}`;
  const response = await videoApi.get<IVideosResponse>(
    req
  );
  return response.data;
};

export const fetchStatsGroupedByDurationRangeFn = async (params) => {
  const req = `fetchStatsGroupedByDurationRange?${params}`;
  const response = await videoApi.get<IVideosResponse>(
    req
  );
  return response.data;
};

export const fetchVideoStatsFn = async (params) => {
  const req = `videoStats/?${params}`;
  const response = await videoApi.get<IVideosResponse>(
    req
  );
  return response.data;
};



export const findGroupedByTagsFn = async (params) => {
  // findMostLikedSSGroupedBySeries
  const req = `findGroupedByTags?${params}`;
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

export const getHighlightedVideosFn = async (page = 1, limit = 30, params) => {
  const req = `videos/highlighted?page=${page}&limit=${limit}&${params}`;
  // if(params) req.concat(`&${params}`);
  const response = await videoApi.get<IVideosResponse>(
    req
  );
  return response.data;
};

export const getAppearencesFn = async (page = 1, limit = 30, params) => {
  const req = `appearences?page=${page}&limit=${limit}&${params}`;
  // if(params) req.concat(`&${params}`);
  const response = await videoApi.get<IVideosResponse>(
    req
  );
  return response.data;
};

export const getVideoGuestsFn = async (page = 1, limit = 30, params) => {
  const req = `guests?page=${page}&limit=${limit}&${params}`;
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

export const getGameOneFn = async (params) => {
  const req = `videos/gameOne?${params}`;

  const response = await videoApi.get<IVideosResponse>(
    req
  );
  return response.data;
};

export const fetchGameOneLeaderboard = async (params) => {
  const req = `gameOneLeaderboard?${params}`;

  const response = await videoApi.get<IVideosResponse>(
    req
  );
  return response.data;
}; 
export const gameOneAddToLeaderboard = async ( params) => {

  try {
    const response = await videoApi.post('gameOneLeaderboard/', params);
    return response.data;
  }  catch (error) {
    console.log(error);
  }

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

export const updateVideoFn = async (apiKey, id, params) => {
  const req = `videos/${id}`;
  const response = await videoApi.patch(req, params, {headers: {'X-API-KEY': apiKey}});
  return response.data;
};
