"use client"

import { cn } from "@/lib/utils"
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/atoms/Card"
import { Input } from "@/components/atoms/Input";
import { SubmitButton } from "@/components/molecules/SubmitButton";
import { useForgotPasswordMutation } from "@/redux/api/authManagementAPI";
import { useState } from "react";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/atoms/Form";

const resetPasswordSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
});

type ResetPasswordFormValues = z.infer<typeof resetPasswordSchema>;

export default function PasswordResetPage({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  const [forgotPassword, { isLoading }] = useForgotPasswordMutation();
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const form = useForm<ResetPasswordFormValues>({
    resolver: zodResolver(resetPasswordSchema),
  });
  // 
  const onSubmit = async (data: ResetPasswordFormValues) => {
    try {
      await forgotPassword({ email: data.email }).unwrap();
      setSuccessMessage(`Password reset email has been sent to "${data.email}"`);
      form.reset();
    } catch (error) {
      console.log("something went wrong", error);
    }
  };

  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-6 bg-muted p-6 md:p-10">
      <div className="flex w-full max-w-sm flex-col gap-6">
        <div className={cn("flex flex-col gap-6", className)} {...props}>
          <Card>
            <CardHeader className="text-center">
              <CardTitle className="text-xl">Reset your password</CardTitle>
              <CardDescription>
                Enter your user account's verified email address and we will send you a password reset link.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-4"
                >
                  {/* Email Field */}
                  <FormField
                    name="email"
                    control={form.control}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter email" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <SubmitButton
                    className="w-full"
                    label="Send password reset email"
                    isLoading={isLoading}
                  />
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
