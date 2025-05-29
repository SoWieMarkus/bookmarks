import z from "zod";

const MIN_POST_TITLE_LENGTH = 1;
const MAX_POST_TITLE_LENGTH = 500;

const MAX_POST_DESCRIPTION_LENGTH = 10000;

export const add = z.object({
	title: z
		.string()
		.min(MIN_POST_TITLE_LENGTH, `Post title must be at least ${MIN_POST_TITLE_LENGTH} characters long`)
		.max(MAX_POST_TITLE_LENGTH, `Post title must be at most ${MAX_POST_TITLE_LENGTH} characters long`)
		.trim(),
	description: z
		.string()
		.max(MAX_POST_DESCRIPTION_LENGTH, `Post description must be at most ${MAX_POST_DESCRIPTION_LENGTH} characters long`)
		.nullable(),
	thumbnail: z.string().nullable(),
	url: z.string().url("Post URL must be a valid URL"),
	tags: z.array(z.string().min(1, "Tag ID is required")).nullable(),
	creators: z.array(z.string().min(1, "Creator ID is required")).nullable(),
	readLater: z.boolean().default(false),
	duration: z.number().int().min(0, "Duration must be a non-negative integer").nullable(),
});

export const edit = add;

export const parseByUrl = z.object({
	url: z.string().url("Post URL must be a valid URL"),
});
