import { z } from "zod";
import { EPostVisibility } from "./types";
export const PostBodyValidationSchema = z.object({
  content: z.string({ message: 'Content is required!' }).min(1, 'Content is required!'),
  image: z.string().optional(),
  visibility: z.enum([EPostVisibility.PUBLIC, EPostVisibility.PRIVATE]).default(EPostVisibility.PUBLIC),
});

