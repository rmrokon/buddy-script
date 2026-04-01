import { z } from "zod";
import { EPostVisibility } from "./types";
export const PostBodyValidationSchema = z.object({
  title: z.string({ message: 'Title is required!' }).min(1, 'Title is required!'),
  content: z.string({ message: 'Content is required!' }).min(1, 'Content is required!'),
  image: z.string({ message: 'Image is required!' }).min(1, 'Image is required!'),
  userId: z.string({ message: 'User ID is required!' }).min(1, 'User ID is required!'),
  visibility: z.enum([EPostVisibility.PUBLIC, EPostVisibility.PRIVATE]),
});

