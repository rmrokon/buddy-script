import { z } from "zod";
import { EPostVisibility } from "./types";
export const PostBodyValidationSchema = z
  .object({
    content: z.string().optional(),
    image: z.string().optional(),
    visibility: z
      .enum([EPostVisibility.PUBLIC, EPostVisibility.PRIVATE])
      .default(EPostVisibility.PUBLIC),
  })
  .refine((data) => data.content || data.image, {
    message: "Post must have either content or an image!",
    path: ["content"],
  });

