import { z } from 'zod';

const email = z
  .string()
  .trim()
  .min(1, 'Email is required.')
  .email('Enter a valid email address.');

export const loginSchema = z.object({
  email,
  password: z.string().min(1, 'Password is required.'),
});

export type LoginFormValues = z.infer<typeof loginSchema>;

export const mfaSchema = z.object({
  code: z
    .string()
    .min(1, 'Verification code is required.')
    .regex(/^\d{6}$/, 'Enter the 6-digit verification code.'),
});

export type MfaFormValues = z.infer<typeof mfaSchema>;

export const signupSchema = z
  .object({
    name: z.string().trim().min(2, 'Enter your full name.'),
    email,
    password: z
      .string()
      .min(8, 'Password must be at least 8 characters.')
      .regex(/[A-Z]/, 'Include at least one uppercase letter.')
      .regex(/[0-9]/, 'Include at least one number.'),
    confirmPassword: z.string().min(1, 'Confirm your password.'),
  })
  .refine((values) => values.password === values.confirmPassword, {
    message: 'Passwords do not match.',
    path: ['confirmPassword'],
  });

export type SignupFormValues = z.infer<typeof signupSchema>;
