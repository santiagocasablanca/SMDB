export type SearchReqQuery = {
  limit?: number,
  page?: number,
  sort?: string
}

export type ChannelsReqQuery = {
  channels?: string,
  publishedAtRange?: string
}

export type ChannelsSearchReqQuery = SearchReqQuery & ChannelsReqQuery;