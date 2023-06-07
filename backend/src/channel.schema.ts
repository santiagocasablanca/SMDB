import { z } from "zod";

// channelId
// channelTitle
export const createChannelSchema = z.object({
  body: z.object({
    channelId: z.string({
      required_error: "videoId is required",
    }),
  }),
});

export const params = z.object({
  videoId: z.string(),
});

export const updateChannelSchema = z.object({
  params,
  body: z
    .object({
      title: z.string(),
      content: z.string(),
      category: z.string(),
      published: z.boolean(),
    })
    .partial(),
});

export const filterQuery = z.object({
  limit: z.number().default(1),
  page: z.number().default(10),
});

export type ParamsInput = z.TypeOf<typeof params>;
export type FilterQueryInput = z.TypeOf<typeof filterQuery>;
export type CreateVideoInput = z.TypeOf<typeof createChannelSchema>["body"];
export type UpdateVideoInput = z.TypeOf<typeof updateChannelSchema>;
