import * as z from "zod";

const CreatorNameSchema = z
	.string()
	.min(1, "Creator name is required")
	.max(100, "Creator name must be at most 100 characters long")
	.trim();

export const add = z.object({
	name: CreatorNameSchema,
	image: z.string().nullable(),
});

export const query = z.object({
	name: z.string().max(100, "Creator name must be at most 100 characters long").optional(),
});

export const edit = add;
