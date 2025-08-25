import { z } from "zod";
import {
  MAX_PASSWORD_LENGTH,
  MIN_PASSWORD_LENGTH,
  PASSWORD_REGEX,
} from "./constants";

// -------------------- Signup Schema --------------------
export const signupSchema = z
  .object({
    fullName: z
      .string({ message: "Name is required" })
      .min(5, { message: "Fullname must be at least 5 characters long" })
      .max(25, { message: "Fullname must be at most 25 characters long" })
      .trim(),
    email: z.email("Invalid email address"),
    password: z
      .string({ message: "Password is required" })
      .min(MIN_PASSWORD_LENGTH, {
        message: `Password must be at least ${MIN_PASSWORD_LENGTH} characters long`,
      })
      .max(MAX_PASSWORD_LENGTH, {
        message: `Password must not exceed ${MAX_PASSWORD_LENGTH} characters`,
      })
      .regex(PASSWORD_REGEX, {
        message:
          "Password must include uppercase, lowercase, number, and special character (!@#$%^&* etc.)",
      })
      .trim(),

    confirmPassword: z
      .string({ message: "Please retype your password" })
      .min(MIN_PASSWORD_LENGTH, {
        message: "Confirm password must be at least 8 characters long",
      })
      .max(MAX_PASSWORD_LENGTH, {
        message: "Confirm password must not exceed 64 characters",
      }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

// -------------------- Login Schema --------------------
export const loginSchema = z.object({
  email: z.email("Invalid email address"),

  password: z
    .string({ message: "Password is required" })
    .min(MIN_PASSWORD_LENGTH, {
      message: `Password must be at least ${MIN_PASSWORD_LENGTH} characters long`,
    })
    .max(MAX_PASSWORD_LENGTH, {
      message: `Password must not exceed ${MAX_PASSWORD_LENGTH} characters`,
    })
    .trim(),
});

export const forgotPassword = z.object({
  email: z.email("Invalid email address"),
});

export const resetPassword = z.object({
  new_password: z
    .string({ message: "Password is required" })
    .min(MIN_PASSWORD_LENGTH, {
      message: `Password must be at least ${MIN_PASSWORD_LENGTH} characters long`,
    })
    .max(MAX_PASSWORD_LENGTH, {
      message: `Password must not exceed ${MAX_PASSWORD_LENGTH} characters`,
    })
    .regex(PASSWORD_REGEX, {
      message:
        "Password must include uppercase, lowercase, number, and special character (!@#$%^&* etc.)",
    })
    .trim(),

  confirm_new_password: z
    .string({ message: "Please confirm your password" })
    .min(MIN_PASSWORD_LENGTH, {
      message: "Confirm password must be at least 8 characters long",
    })
    .max(MAX_PASSWORD_LENGTH, {
      message: "Confirm password must not exceed 64 characters",
    }),

  token: z.string(),
});

// -------------------- Types --------------------
export type SignupFormSchema = z.infer<typeof signupSchema>;
export type LoginFormSchema = z.infer<typeof loginSchema>;
export type ForgotPasswordFormSchema = z.infer<typeof forgotPassword>;
export type ResetPasswordFormSchema = z.infer<typeof resetPassword>;
