import { z } from "zod";

export const CommentBodyValidationSchema = z.object({
  postId: z.string({ message: 'Post ID is required!' }).min(1, 'Post ID is required!'),
  parentCommentId: z.string().nullable().optional(),
  content: z.string({ message: 'Content is required!' }).min(1, 'Content is required!'),
});

export const UpdateCommentBodyValidationSchema = z.object({
  content: z.string({ message: 'Content is required!' }).min(1, 'Content is required!'),
});
