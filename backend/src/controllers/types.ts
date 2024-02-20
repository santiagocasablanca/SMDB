export type SearchReqQuery = {
  limit?: number,
  page?: number,
  sort?: string
}

export type ChannelsReqQuery = {
  channels?: string,
  creators?: string,
  title?: string,
  range?: string,
  month?: string,
  year?: string,
  publishedAtRange?: string
}

export type VideosReqQuery = {
  channels?: string,
  video_ids?: string,
  excludedChannels?: string,
  castMember?: string,
  notInCastMember?: string,
  tags?: string,
  games?: string, 
  excludeShorts?: string,
  onlyShorts?: string,
  groupByChannel?: string,
  publishedAtRange?: string
}

export type CreatorsReqQuery = {
  channels?: string,
  publishedAtRange?: string
}

export type AddCreatorQuery = {
  channel_ids?: [],
  name: string,
  custom_url: string,
  profile_picture: string
}

export type ChannelsSearchReqQuery = SearchReqQuery & ChannelsReqQuery;
export type VideosSearchReqQuery = SearchReqQuery & VideosReqQuery;