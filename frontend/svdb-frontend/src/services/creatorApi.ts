import axios from "axios";

import { IChannelResponse } from "./types";


const BASE_URL = process.env.REACT_APP_BASE_URL || "http://localhost:8005/api/";

// TODO clean redundant code
export const api = axios.create({
  baseURL: BASE_URL,
  withCredentials: false,
});

export const getCreatorFn = async (id) => {
  const req = `creators/${id}`;

  const response = await api.get<IChannelResponse>(
    req
  );
  return response.data;
};

export const getCreatorsFn = async (page = 1, limit = 30, params) => {
  const req = `creators?page=${page}&limit=${limit}&${params}`;
  const response = await api.get<IChannelResponse>(
    req
  );
  return response.data;
};

export const getTopCreatorsFn = async (page = 1, limit = 30, params) => {
  const req = `topCreators?page=${page}&limit=${limit}&${params}`;
  const response = await api.get<IChannelResponse>(
    req
  );
  return response.data;
};

// fetchCreatorStatsController
export const getCreatorStatsFn = async (params) => {
  const req = `creator/fetchStats?${params}`;
  const response = await api.get<IChannelResponse>(
    req
  );
  return response.data;
};


export const createAndAssociateChannelsFn = async (apiKey, params) => {

  try {
    const response = await api.post('creators/', params, {headers: {'X-API-KEY': apiKey}});
    return response.data;
  }  catch (error) {
    console.log(error);
  }

};

export const associateChannelIdsToCreatorFn = async (params) => {
  const response = await api.post('channels/', params);
  return response.data;
};