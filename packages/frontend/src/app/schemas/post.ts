import z from "zod";
import { CreatorSchema } from "./creator";
import { TagSchema } from "./tag";

export const PostSchema = z.object({
	createdAt: z.string().datetime(),
	id: z.string(),
	title: z.string(),
	description: z.string().nullable(),
	thumbnail: z.string().nullable(),
	url: z.string().url(),
	readLater: z.boolean(),
	tags: z.array(TagSchema),
	creators: z.array(CreatorSchema),
	duration: z.number().int().min(0).nullable(),
});

export const PostTemplateSchema = z.object({
	title: z.string(),
	description: z.string().nullable(),
	thumbnail: z.string().nullable(),
	url: z.string().url(),
	duration: z.union([z.string(), z.number().int().min(0)]).nullable(),
});

export type Post = z.infer<typeof PostSchema>;
export type PostTemplate = z.infer<typeof PostTemplateSchema>;
