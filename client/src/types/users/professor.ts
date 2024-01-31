import { z } from "zod";

export const Professor = z.object({
  courseId: z.number(),
  email: z.string(),
  id: z.number(),
  name: z.string(),
  imageUrl: z.nullable(z.string()),
  phone: z.nullable(z.string()),
});

export type Professor = z.infer<typeof Professor>;
