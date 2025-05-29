import { z } from "zod";

const MIN_LENGTH_USERNAME = 3;
const MAX_LENGTH_USERNAME = 30;

const MIN_LENGTH_PASSWORD = 6;
const MAX_LENGTH_PASSWORD = 100;

export const register = z.object({
	username: z
		.string()
		.trim()
		.min(MIN_LENGTH_USERNAME, `Username must be at least ${MIN_LENGTH_USERNAME} characters long`)
		.max(MAX_LENGTH_USERNAME, `Username can only be ${MAX_LENGTH_USERNAME} characters long`)
		.regex(/^[A-Za-z0-9!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?`~]+$/)
		.regex(/^[^\s]*$/, "Username cannot contain spaces."),
	password: z
		.string()
		.trim()
		.min(MIN_LENGTH_PASSWORD, `Password must be at least ${MIN_LENGTH_PASSWORD} characters long`)
		.max(MAX_LENGTH_PASSWORD, `Password can only be ${MAX_LENGTH_PASSWORD} characters long`)
		.regex(/^[A-Za-z0-9!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?`~]+$/)
		.regex(/^[^\s]*$/, "Password cannot contain spaces."),
});

export const login = z.object({
	username: z.string().trim(),
	password: z.string().trim(),
});

export const remove = z.object({
	password: z.string().trim(),
});
