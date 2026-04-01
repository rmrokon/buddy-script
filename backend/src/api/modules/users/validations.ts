import { z } from "zod";
export const UserBodyValidationSchema = z.object({
  email: z.string({ message: 'Email is required!' }).min(1, 'Email is required!'),
  firstName: z.string({ message: 'First name is required!' }).min(1, 'First name is required!'),
  lastName: z.string({ message: 'Last name is required!' }).min(1, 'Last name is required!'),
});

