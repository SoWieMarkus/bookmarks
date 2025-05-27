import { z } from "zod";

export const AuthenticationSchema = z.object({
  token: z.string().jwt(),
});

export type Authentication = z.infer<typeof AuthenticationSchema>;
