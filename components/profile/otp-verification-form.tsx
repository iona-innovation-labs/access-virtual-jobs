"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "../ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { useToast } from "@/hooks/use-toast";
import { Loader2, ArrowLeft } from "lucide-react";

const otpSchema = z.object({
  otp: z
    .string()
    .min(6, "Please enter the 6-digit verification code")
    .max(6, "Please enter the 6-digit verification code")
    .regex(/^\d{6}$/, "Please enter a valid 6-digit code"),
});

type OtpFormData = z.infer<typeof otpSchema>;

interface OtpVerificationFormProps {
  phoneNumber: string;
  onBack: () => void;
  onSuccess: () => void;
}

const OtpVerificationForm = ({
  phoneNumber,
  onBack,
  onSuccess,
}: OtpVerificationFormProps) => {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const otpForm = useForm<OtpFormData>({
    resolver: zodResolver(otpSchema),
    defaultValues: {
      otp: "",
    },
  });

  // Focus OTP input on mount
  useEffect(() => {
    const timer = setTimeout(() => {
      const otpInput = document.querySelector(
        'input[name="otp"]'
      ) as HTMLInputElement;
      if (otpInput) {
        otpInput.focus();
      }
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  const handleVerifyCode = async (data: OtpFormData) => {
    setLoading(true);
    try {
      const response = await fetch("/api/verification/verify-code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: data.otp }),
      });

      const result = await response.json();

      if (result.success) {
        toast({
          title: "Phone verified successfully!",
          description: "You now have a verified badge.",
        });
        onSuccess();
      } else {
        toast({
          title: "Verification failed",
          description: result.message,
          variant: "destructive",
        });
      }
    } catch {
      toast({
        title: "Error",
        description: "Failed to verify code. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleResendCode = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/verification/send-code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phoneNumber }),
      });

      const result = await response.json();

      if (result.success) {
        toast({
          title: "Code resent!",
          description: "Please check your SMS for the new verification code.",
        });
        otpForm.reset({ otp: "" });
      } else {
        toast({
          title: "Error",
          description: result.message,
          variant: "destructive",
        });
      }
    } catch {
      toast({
        title: "Error",
        description: "Failed to resend code. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="max-w-md mx-auto mt-8">
      <CardHeader>
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={onBack}
            className="p-0 h-auto"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
        </div>
        <CardTitle>Enter Verification Code</CardTitle>
        <CardDescription>
          We&apos;ve sent a 6-digit code to {phoneNumber}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...otpForm}>
          <form
            onSubmit={otpForm.handleSubmit(handleVerifyCode)}
            className="space-y-4"
          >
            <FormField
              control={otpForm.control}
              name="otp"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium">
                    Verification Code
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="text"
                      inputMode="numeric"
                      placeholder="Enter 6-digit code"
                      maxLength={6}
                      className="h-12 text-center text-lg tracking-widest"
                      {...field}
                      onChange={(e) => {
                        // Only allow digits
                        const value = e.target.value.replace(/\D/g, "");
                        field.onChange(value);
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                  <p className="text-xs text-muted-foreground mt-1">
                    Enter the 6-digit code sent to your phone
                  </p>
                </FormItem>
              )}
            />
            <div className="space-y-2">
              <Button type="submit" disabled={loading} className="w-full h-12">
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Verifying...
                  </>
                ) : (
                  "Verify Code"
                )}
              </Button>
              <Button
                type="button"
                variant="secondary"
                onClick={handleResendCode}
                disabled={loading}
                className="w-full h-12 text-sm"
              >
                Resend Code
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default OtpVerificationForm;
