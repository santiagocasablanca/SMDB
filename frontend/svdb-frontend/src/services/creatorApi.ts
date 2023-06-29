import axios from "axios";

import { IChannelResponse } from "./types";

const BASE_URL = "http://localhost:8005/api/";

// TODO clean redundant code
export const api = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
});

export const getCreatorFn = async (id) => {
  const req = `creators/${id}`;

  console.log(req);
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
