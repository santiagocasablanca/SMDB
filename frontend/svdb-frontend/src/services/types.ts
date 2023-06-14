export type INote = {
  id: string;
  title: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
};

export type IGenericResponse = {
  status: string;
  message: string;
};

export type INoteResponse = {
  status: string;
  note: INote;
};

export type INotesResponse = {
  status: string;
  results: number;
  notes: INote[];
};


export type IVideo = {
  id: string;
  title: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
};

export type IVideoResponse = {
  status: string;
  video: IVideo;
};

export type IVideosResponse = {
  status: string;
  results: number;
  videos: IVideo[];
};

export type IChannelResponse = {
  status: string;
  count: number;
  results: IVideo[];
};
