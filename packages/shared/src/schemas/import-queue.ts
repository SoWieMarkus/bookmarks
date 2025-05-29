import { z } from "zod";

export const addMultiple = z.array(z.string().url());
