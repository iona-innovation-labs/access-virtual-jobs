"use client";

import { useState } from "react";
import useSWR from "swr";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { motion, AnimatePresence } from "framer-motion";
import { fetchApi } from "@/services/fetch-api";
import { CheckCircle, Search, Send, BarChart3 } from "lucide-react";

interface UserResponse {
  isNewUser: boolean;
  ok: boolean;
}

const onboardingSteps = [
  {
    id: 1,
    icon: CheckCircle,
    title: "Update Profile",
    description: "Update your profile to improve job matches.",
  },
  {
    id: 2,
    icon: Search,
    title: "Search Jobs",
    description: "Search for jobs that match your skills.",
  },
  {
    id: 3,
    icon: Send,
    title: "Apply Easily",
    description: "Apply to jobs with one click.",
  },
  {
    id: 4,
    icon: BarChart3,
    title: "Track Progress",
    description: "Monitor your applications and get hired!",
  },
];

export const OnboardingModal = () => {
  const { data, mutate } = useSWR<UserResponse>(
    "/user/update-new-user",
    fetchApi
  );
  const [activeStep, setActiveStep] = useState(1);
  const [open, setOpen] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const isNewUser = data?.isNewUser ?? false;
  const currentStep = onboardingSteps.find((step) => step.id === activeStep);

  const handleNext = () => {
    if (activeStep < onboardingSteps.length) {
      setActiveStep(activeStep + 1);
    }
  };

  const handleBack = () => {
    if (activeStep > 1) {
      setActiveStep(activeStep - 1);
    }
  };

  const handleGetStarted = async () => {
    setIsLoading(true);
    try {
      const response = await fetchApi<UserResponse>("/user/update-new-user", {
        method: "POST",
      });

      if (response.ok) {
        mutate({ isNewUser: false, ok: true }, false);
        setOpen(false);
      }
    } catch (error) {
      console.error("Error updating user status:", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isNewUser || !open) return null;

  return (
    <Dialog
      open={open}
      onOpenChange={(newOpen) => {
        // Prevent closing via escape or backdrop click
        if (!newOpen) return;
        setOpen(newOpen);
      }}
    >
      <DialogContent
        className="max-w-md mx-auto p-0 bg-gradient-to-br from-blue-50 to-indigo-50 border-0 shadow-2xl [&>button]:hidden"
        onPointerDownOutside={(e) => e.preventDefault()}
        onEscapeKeyDown={(e) => e.preventDefault()}
      >
        <div className="p-6">
          {/* Header */}
          <div className="text-center mb-6">
            <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl text-white font-bold">AVJ</span>
            </div>
            <h2 className="text-2xl font-bold text-zinc-800 mb-2">
              Welcome to Access Virtual Jobs!
            </h2>
            <p className="text-sm text-zinc-600">
              Let&apos;s get you started in just a few steps
            </p>
          </div>

          {/* Step Indicators */}
          <div className="flex justify-center space-x-2 mb-8">
            {onboardingSteps.map((step) => (
              <Badge
                key={step.id}
                variant={activeStep === step.id ? "default" : "secondary"}
                className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300 ${
                  activeStep === step.id
                    ? "bg-blue-600 text-white scale-110 shadow-lg"
                    : activeStep > step.id
                      ? "bg-green-500 text-white"
                      : "bg-gray-200 text-zinc-500"
                }`}
              >
                {activeStep > step.id ? "✓" : step.id}
              </Badge>
            ))}
          </div>

          {/* Step Content */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeStep}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <Card className="border-0 shadow-lg bg-white/70 backface-visibility-hidden">
                <CardContent className="p-6 text-center">
                  {currentStep && (
                    <>
                      <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <currentStep.icon className="w-6 h-6 text-blue-600" />
                      </div>
                      <h3 className="text-lg font-semibold text-zinc-800 mb-2">
                        {currentStep.title}
                      </h3>
                      <p className="text-zinc-600">{currentStep.description}</p>
                    </>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          </AnimatePresence>

          {/* Navigation Buttons */}
          <div className="flex justify-between items-center mt-8">
            {activeStep > 1 ? (
              <Button
                variant="outline"
                onClick={handleBack}
                className="px-6 hover:bg-gray-50 transition-all duration-200"
                disabled={isLoading}
              >
                Back
              </Button>
            ) : (
              <div /> // Spacer
            )}

            {activeStep < onboardingSteps.length ? (
              <Button
                onClick={handleNext}
                className="px-6 bg-blue-600 hover:bg-blue-700 transition-all duration-200 shadow-md hover:shadow-lg"
                disabled={isLoading}
              >
                Next
              </Button>
            ) : (
              <Button
                onClick={handleGetStarted}
                className="px-6 bg-green-600 hover:bg-green-700 transition-all duration-200 shadow-md hover:shadow-lg"
                disabled={isLoading}
              >
                {isLoading ? "Getting Started..." : "Get Started"}
              </Button>
            )}
          </div>

          {/* Progress Bar */}
          <div className="mt-6">
            <div className="w-full bg-gray-200 rounded-full h-2">
              <motion.div
                className="bg-blue-600 h-2 rounded-full transition-all duration-500"
                initial={{ width: "25%" }}
                animate={{
                  width: `${(activeStep / onboardingSteps.length) * 100}%`,
                }}
              />
            </div>
            <p className="text-xs text-zinc-500 text-center mt-2">
              Step {activeStep} of {onboardingSteps.length}
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
