import { z } from "zod";

export const add = z.object({
	title: z
		.string()
		.min(1, "Tag text is required")
		.max(50, "Tag text must be at most 50 characters long")
		.trim(),
});

export const edit = z.object({
	title: z
		.string()
		.min(1, "Tag text is required")
		.max(50, "Tag text must be at most 50 characters long")
		.trim(),
});

export const query = z.object({
	title: z
		.string()
		.max(50, "Tag text must be at most 50 characters long")
		.optional(),
});
