import * as z from "zod";

export const ImportQueueItemSchema = z.object({
	url: z.url(),
	userId: z.string().nullable(),
	id: z.string(),
});

export type ImportQueueItem = z.infer<typeof ImportQueueItemSchema>;
