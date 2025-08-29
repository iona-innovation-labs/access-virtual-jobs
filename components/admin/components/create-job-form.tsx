"use client";

import { useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { JobRichTextEditor } from "./job-rich-text-editor";
import { TagsInput } from "./tags-input";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { fetchApi } from "@/services/fetch-api";
import { useToast } from "@/hooks/use-toast";

const jobFormSchema = z.object({
  title: z.string().min(3, "Title is required"),
  description: z.string().min(10, "Description is required"),
  salaryAmount: z.coerce.number().min(0, "Salary must be positive"),
  salaryCurrency: z.enum(["USD", "PHP"]),
  salaryType: z.enum(["hourly", "monthly", "yearly"]),
  location: z.string().min(2, "Location required"),
  jobType: z.enum(["Freelance", "Full-time", "Part-time", "Contract"]),
  jobCategory: z.enum([
    "office_administration",
    "marketing_sales",
    "graphics_multimedia",
    "web_design_development",
    "software_development_programming",
    "customer_service_admin_support",
    "professional_services",
    "writing",
  ]),
  remoteAllowed: z.boolean(),
  numberOfTalents: z.coerce.number().min(1, "At least 1 talent required"),
  tags: z.array(z.string()),
});

type JobFormValues = z.infer<typeof jobFormSchema>;

export default function CreateJobForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const form = useForm<JobFormValues>({
    resolver: zodResolver(jobFormSchema),
    defaultValues: {
      title: undefined,
      description: "",
      salaryAmount: 0,
      salaryCurrency: undefined,
      salaryType: undefined,
      location: undefined,
      jobType: undefined,
      jobCategory: undefined,
      remoteAllowed: undefined,
      numberOfTalents: undefined,
      tags: undefined,
    },
  });

  async function onSubmit(values: JobFormValues, action: "publish" | "draft") {
    setLoading(true);

    try {
      const job = await fetchApi<{ id: number }>("/admin/jobs", {
        method: "POST",
        body: JSON.stringify({
          ...values,
          status: action === "publish" ? "active" : "inactive",
        }),
      });
      console.log("Job response:", job);

      toast({
        title: "Success!",
        description: `Job ${action === "publish" ? "created and published" : "saved as draft"} successfully`,
        variant: "success",
      });

      router.push(`/admin/app/jobs/v/${job.id}`);
    } catch (error: any) {
      console.error("Error creating job:", error);
      toast({
        title: "Error",
        description: `Failed to create job: ${error.message ?? error.publicMessage}`,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }

  function handleCancel() {
    router.push("/admin/app/jobs");
  }

  return (
    <div className="max-w-4xl mx-auto my-12">
      {/* Header with back button */}
      <div className="flex items-center gap-4 mb-8">
        <Link
          href="/admin/app/jobs"
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to All Jobs
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow-sm border p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Create New Job</h1>
          <p className="text-gray-600 mt-2">
            Fill in the details below to create a new job posting.
          </p>
        </div>

        <Form {...form}>
          <form onSubmit={(e) => e.preventDefault()} className="space-y-6">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input {...field} value={field.value || ""} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <JobRichTextEditor
                      value={field.value || ""}
                      onChange={field.onChange}
                      placeholder="Write a detailed job description..."
                      disabled={loading}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-3 gap-4">
              <FormField
                control={form.control}
                name="salaryAmount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Salary Amount</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        step="0.01"
                        min="0"
                        {...field}
                        value={field.value || ""}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="salaryCurrency"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Currency</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      value={field.value || ""}
                      disabled={loading}
                    >
                      <FormControl>
                        <SelectTrigger className="border-border w-full focus:border-brand focus:ring-brand">
                          <SelectValue placeholder="Select Currency" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="USD">USD</SelectItem>
                        <SelectItem value="PHP">PHP</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="salaryType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Salary Type</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      value={field.value || ""}
                      disabled={loading}
                    >
                      <FormControl>
                        <SelectTrigger className="border-border w-full focus:border-brand focus:ring-brand">
                          <SelectValue placeholder="Select Salary Type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {[
                          { value: "hourly", label: "Hourly" },
                          { value: "monthly", label: "Monthly" },
                          { value: "yearly", label: "Yearly" },
                        ].map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="location"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Location</FormLabel>
                    <FormControl>
                      <Input {...field} value={field.value || ""} />
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="remoteAllowed"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Remote Allowed</FormLabel>
                    <FormControl>
                      <Switch
                        checked={field.value || false}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="jobType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Job Type</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      value={field.value || ""}
                      disabled={loading}
                    >
                      <FormControl>
                        <SelectTrigger className="border-border w-full focus:border-brand focus:ring-brand">
                          <SelectValue placeholder="Select Job Type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {[
                          { value: "Freelance", label: "Freelance" },
                          { value: "Full-time", label: "Full-time" },
                          { value: "Part-time", label: "Part-time" },
                          { value: "Contract", label: "Contract" },
                        ].map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="jobCategory"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Job Category</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      value={field.value || ""}
                      disabled={loading}
                    >
                      <FormControl>
                        <SelectTrigger className="border-border w-full focus:border-brand focus:ring-brand">
                          <SelectValue placeholder="Select Job Category" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {[
                          {
                            value: "office_administration",
                            label: "Office & Administration",
                          },
                          {
                            value: "marketing_sales",
                            label: "Marketing & Sales",
                          },
                          {
                            value: "graphics_multimedia",
                            label: "Graphics & Multimedia",
                          },
                          {
                            value: "web_design_development",
                            label: "Web Design & Development",
                          },
                          {
                            value: "software_development_programming",
                            label: "Software Development / Programming",
                          },
                          {
                            value: "customer_service_admin_support",
                            label: "Customer Service & Admin Support",
                          },
                          {
                            value: "professional_services",
                            label: "Professional Services",
                          },
                          { value: "writing", label: "Writing" },
                        ].map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="numberOfTalents"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Number of Talents</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min={1}
                        {...field}
                        value={field.value || ""}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="tags"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tags</FormLabel>
                  <FormControl>
                    <TagsInput
                      value={field.value || []}
                      onChange={field.onChange}
                      placeholder="Add a tag and click + to add..."
                      disabled={loading}
                    />
                  </FormControl>
                  <FormDescription>
                    Add tags to help categorize and search for this job
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Action Buttons */}
            <div className="flex items-center gap-4 pt-6 border-t">
              <Button
                type="button"
                onClick={() =>
                  form.handleSubmit((values) => onSubmit(values, "publish"))()
                }
                disabled={loading}
                className="bg-green-600 hover:bg-green-700"
              >
                Save and Publish
              </Button>

              <Button
                type="button"
                onClick={() =>
                  form.handleSubmit((values) => onSubmit(values, "draft"))()
                }
                disabled={loading}
                variant="outline"
              >
                Save as Draft
              </Button>

              <Button
                type="button"
                onClick={handleCancel}
                disabled={loading}
                variant="ghost"
              >
                Cancel
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}
