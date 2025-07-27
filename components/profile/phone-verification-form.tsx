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
import { Badge } from "../ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Phone, CheckCircle, Loader2 } from "lucide-react";
import { isValidPhoneNumber } from "react-phone-number-input";
import OtpVerificationForm from "./otp-verification-form";

// Custom Philippine phone validation function (same as backend)
// const isValidPhilippinePhone = (phoneNumber: string): boolean => {
//   // Remove all non-digit characters
//   const digits = phoneNumber.replace(/\D/g, "");

//   // Handle different Philippine phone number formats
//   let formatted = phoneNumber;
//   if (digits.startsWith("63")) {
//     formatted = `+${digits}`;
//   } else if (digits.startsWith("09")) {
//     formatted = `+63${digits.substring(1)}`;
//   } else if (digits.startsWith("9")) {
//     formatted = `+63${digits}`;
//   }

//   // Philippine mobile numbers should be +63 followed by 9 digits
//   const philippineMobileRegex = /^\+63[9]\d{8}$/;
//   return philippineMobileRegex.test(formatted);
// };

const phoneVerificationSchema = z.object({
  phoneNumber: z
    .string()
    .min(1, "Phone number is required")
    .refine((value) => isValidPhoneNumber(value, "PH"), {
      message:
        "Please enter a valid Philippine phone number (e.g., 09123456789 or +639123456789)",
    }),
});

type PhoneVerificationFormData = z.infer<typeof phoneVerificationSchema>;

interface VerificationStatus {
  isPhoneVerified: boolean;
  phoneNumber: string | null;
  hasExpiredCode: boolean;
}

const PhoneVerificationForm = () => {
  const [step, setStep] = useState<"phone" | "otp" | "success">("phone");
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [verificationStatus, setVerificationStatus] =
    useState<VerificationStatus | null>(null);
  const [phoneNumber, setPhoneNumber] = useState<string>("");
  const { toast } = useToast();

  const phoneForm = useForm<PhoneVerificationFormData>({
    resolver: zodResolver(phoneVerificationSchema),
    defaultValues: {
      phoneNumber: "",
    },
  });

  // Fetch verification status on component mount
  useEffect(() => {
    fetchVerificationStatus();
  }, []);

  const fetchVerificationStatus = async () => {
    try {
      const response = await fetch("/api/verification/status");
      const data = await response.json();

      if (data.success) {
        setVerificationStatus(data.data);
        if (data.data.isPhoneVerified) {
          setStep("success");
        } else if (data.data.phoneNumber && !data.data.hasExpiredCode) {
          // User has a pending verification (phone number exists but not verified and code hasn't expired)
          setPhoneNumber(data.data.phoneNumber);
          setStep("otp");
        }
      }
    } catch {
      console.error("Error fetching verification status");
    } finally {
      setInitialLoading(false);
    }
  };

  const handleSendCode = async (data: PhoneVerificationFormData) => {
    setLoading(true);
    try {
      const response = await fetch("/api/verification/send-code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phoneNumber: data.phoneNumber }),
      });

      const result = await response.json();

      if (result.success) {
        toast({
          title: "Verification code sent!",
          description: "Please check your SMS for the 6-digit code.",
        });
        setPhoneNumber(data.phoneNumber);
        setStep("otp");
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
        description: "Failed to send verification code. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleOtpSuccess = () => {
    setStep("success");
    fetchVerificationStatus();
  };

  const handleBackToPhone = () => {
    setStep("phone");
  };

  // Show loading state while checking verification status
  if (initialLoading) {
    return (
      <Card className="max-w-md mx-auto mt-8">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-brand/10 flex items-center justify-center">
              <Phone className="w-5 h-5 text-brand" />
            </div>
            <div>
              <CardTitle>Phone Verification</CardTitle>
              <CardDescription>Checking verification status...</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
          </div>
        </CardContent>
      </Card>
    );
  }

  if (step === "success") {
    return (
      <Card className="max-w-md mx-auto mt-8">
        <CardHeader className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 bg-green-100 rounded-full flex items-center justify-center">
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
          <CardTitle className="flex items-center justify-center gap-2">
            Phone Verified
            <Badge variant="default" className="bg-green-100 text-green-800">
              Verified
            </Badge>
          </CardTitle>
          <CardDescription>
            Your phone number has been successfully verified. You can now apply
            for jobs.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center space-y-4">
            <p className="text-sm text-muted-foreground">
              Verified phone: {verificationStatus?.phoneNumber}
            </p>
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <p className="text-sm text-green-800">
                ✅ You now have a verified badge that clients can see
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="max-w-md mx-auto mt-8">
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-brand/10 flex items-center justify-center">
            <Phone className="w-5 h-5 text-brand" />
          </div>
          <div>
            <CardTitle className="flex items-center gap-2">
              Phone Verification
              {verificationStatus?.isPhoneVerified && (
                <Badge
                  variant="default"
                  className="bg-green-100 text-green-800"
                >
                  Verified
                </Badge>
              )}
            </CardTitle>
            <CardDescription>
              Verify your phone number to get a verified badge and apply for
              jobs
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {step === "phone" ? (
          <Form {...phoneForm}>
            <form
              onSubmit={phoneForm.handleSubmit(handleSendCode)}
              className="space-y-4"
            >
              <FormField
                control={phoneForm.control}
                name="phoneNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium">
                      Philippine Phone Number
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="tel"
                        placeholder="e.g., 09123456789"
                        className="h-12"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                    <p className="text-xs text-muted-foreground mt-1">
                      Enter your Philippine mobile number (e.g., 09123456789 or
                      +639123456789)
                    </p>
                  </FormItem>
                )}
              />
              <Button type="submit" disabled={loading} className="w-full h-12">
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Sending Code...
                  </>
                ) : (
                  "Send Verification Code"
                )}
              </Button>
            </form>
          </Form>
        ) : (
          <OtpVerificationForm
            phoneNumber={phoneNumber}
            onBack={handleBackToPhone}
            onSuccess={handleOtpSuccess}
          />
        )}
      </CardContent>
    </Card>
  );
};

export default PhoneVerificationForm;
