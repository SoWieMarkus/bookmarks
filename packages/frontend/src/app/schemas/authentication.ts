import { z } from "zod";

export const AuthenticationSchema = z.object({
	token: z.string().jwt(),
});

export const UserSchema = z.object({
	id: z.string().uuid(),
	username: z.string().min(1),
	createdAt: z.string().datetime(),
});

export type User = z.infer<typeof UserSchema>;
export type Authentication = z.infer<typeof AuthenticationSchema>;
