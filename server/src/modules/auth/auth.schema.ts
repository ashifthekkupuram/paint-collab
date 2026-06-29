import { z } from "zod";

export const registerSchema = z.object({
  email: z.email("Email is required."),
  username: z
    .string("Username is required.")
    .min(3, "Username must be at least 3 characters long.")
    .max(55, "Username must be less than 55 characters."),
  password: z
    .string("Password is required.")
    .min(6, "Password must be at least 6 characters long."),
});

export const loginSchema = z.object({
  email: z.email("Email is required."),
  password: z.string("Password is required."),
});
