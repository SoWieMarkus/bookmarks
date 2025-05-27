import { z } from "zod";

export const CreatorSchema = z.object({
  id: z.string(),
  name: z.string(),
  image: z.string().nullable(),
});

export type Creator = z.infer<typeof CreatorSchema>;
