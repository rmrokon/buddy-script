import { z } from "zod";
import { EReactableType, EReactionType } from "./types";

export const ReactionBodyValidationSchema = z.object({
  userId: z.string({ message: 'User ID is required!' }).min(1, 'User ID is required!'),
  reactableType: z.enum([EReactableType.POST, EReactableType.COMMENT]),
  reactableId: z.string({ message: 'Reactable ID is required!' }).min(1, 'Reactable ID is required!'),
  reactionType: z.enum([EReactionType.LIKE, EReactionType.LOVE, EReactionType.HAHA, EReactionType.WOW, EReactionType.SAD, EReactionType.ANGRY]),
});
