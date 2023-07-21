export type SearchReqQuery = {
  limit?: number,
  page?: number,
  sort?: string
}

export type ChannelsReqQuery = {
  channels?: string,
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