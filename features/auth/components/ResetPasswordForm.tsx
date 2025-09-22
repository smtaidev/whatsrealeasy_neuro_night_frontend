"use client";
import TextField from "./TextField";
import { Form } from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { LucideMail } from "lucide-react";
import { useForm } from "react-hook-form";
import { AuthCard } from "./AuthForm";
import PasswordField from "./PasswordField";
import {
  resetPassword,
  ResetPasswordFormSchema,
  forgotPassword,
  ForgotPasswordFormSchema,
} from "../utils/validation";

import AuthButton from "./AuthButton";
import { forgotPasswordPath, loginPath } from "@/paths";
import { useSearchParams } from "next/navigation";

export function ForgotPasswordForm() {
  const form = useForm<ForgotPasswordFormSchema>({
    mode: "all",
    resolver: zodResolver(forgotPassword),
    defaultValues: {
      email: "",
    },
  });
  const onSubmit = async () => {};

  return (
    <AuthCard>
      <AuthCard.Header>
        <h2 className="text-xl font-semibold text-center text-gray-200">
          Forgot Password?
        </h2>
        <p className="text-xs text-gray-300">
          Enter your email for the verification process.
        </p>
      </AuthCard.Header>

      <AuthCard.Content>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <fieldset className="space-y-6">
              <TextField
                label="Email"
                name="email"
                placeholder="Enter your email"
              >
                <LucideMail className="size-9 p-2.5 absolute right-0 bottom-0" />
              </TextField>
            </fieldset>
            <div className="mt-4">
              <AuthButton
                disabled={
                  !form.formState.isValid || form.formState.isSubmitting
                }
                className="w-full"
                type="submit"
                isLoading={form.formState.isSubmitting}
              />
            </div>
          </form>
        </Form>
      </AuthCard.Content>
      <AuthCard.Footer>
        <AuthCard.Text>Remembered your password?</AuthCard.Text>
        <AuthCard.Link href={loginPath()}>Back to Login</AuthCard.Link>
      </AuthCard.Footer>
    </AuthCard>
  );
}

export function NewPasswordForm() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token") || "";
  const form = useForm<ResetPasswordFormSchema>({
    mode: "all",
    resolver: zodResolver(resetPassword),
    defaultValues: {
      new_password: "",
      confirm_new_password: "",
      token,
    },
  });
  const onSubmit = async () => {};

  return (
    <AuthCard>
      <AuthCard.Header>
        <h2 className="text-xl font-semibold text-center text-gray-200">
          New Password?
        </h2>
        <p className="text-xs text-gray-300">
          Set the new password for your account.
        </p>
      </AuthCard.Header>

      <AuthCard.Content>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <fieldset className="space-y-6">
              <PasswordField
                label="Password"
                name="new_password"
                placeholder="Enter your password"
              />
              <PasswordField
                label="Confirm Password"
                name="confirm_new_password"
                placeholder="Confirm your password"
              />
            </fieldset>
            <div className="mt-4">
              <AuthButton
                disabled={
                  !form.formState.isValid || form.formState.isSubmitting
                }
                className="w-full"
                type="submit"
                isLoading={form.formState.isSubmitting}
              />
            </div>
          </form>
        </Form>
      </AuthCard.Content>
      <AuthCard.Footer>
        <AuthCard.Text>Need to start over?</AuthCard.Text>
        <AuthCard.Link href={forgotPasswordPath()}>
          Request Reset Link
        </AuthCard.Link>
      </AuthCard.Footer>
    </AuthCard>
  );
}
