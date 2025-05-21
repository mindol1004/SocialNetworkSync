import { z } from 'zod';

export const SignInSchema = z.object({
  email: z.string({
    required_error: 'email.required'
  }).email('email.invalid'),
  password: z.string({
    required_error: 'password.required'
  }).min(6, 'password.minLength'),  
});

export type SignInDTO = z.infer<typeof SignInSchema>;
