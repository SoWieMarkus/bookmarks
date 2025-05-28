import z from "zod";

export const ImportQueueItemSchema = z.object({
  url: z.string().url(),
  userId: z.string().nullable(),
  id: z.string(),
});

export type ImportQueueItem = z.infer<typeof ImportQueueItemSchema>;
