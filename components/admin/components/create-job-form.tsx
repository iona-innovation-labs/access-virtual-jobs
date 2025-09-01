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
import {
  PUBLIC_JOB_CATEGORIES,
  PUBLIC_JOB_TYPES,
  PUBLIC_CURRENCY,
  PUBLIC_SALARY_TYPES,
} from "@/lib/constants";

const jobFormSchema = z.object({
  title: z.string().min(3, "Please enter a job title (at least 3 characters)"),
  description: z
    .string()
    .min(
      10,
      "Please provide a detailed job description (at least 10 characters)"
    ),
  salaryAmount: z.coerce.number().min(0, "Please enter a valid salary amount"),
  salaryCurrency: z.enum(PUBLIC_CURRENCY, {
    required_error: "Please select a currency",
    invalid_type_error: "Please select either USD or PHP",
  }),
  salaryType: z.enum(PUBLIC_SALARY_TYPES, {
    required_error: "Please select how the salary is paid",
    invalid_type_error: "Please select hourly, monthly, or yearly",
  }),
  location: z
    .string()
    .min(2, "Please enter a location (at least 2 characters)"),
  jobType: z.string().min(1, "Please select a job type"),
  jobCategory: z.string().min(1, "Please select a job category"),
  remoteAllowed: z.boolean(),
  numberOfTalents: z.coerce
    .number()
    .min(1, "Please specify how many people you need for this role"),
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
      salaryCurrency: "USD",
      salaryType: undefined,
      location: "Remote",
      jobType: undefined,
      jobCategory: undefined,
      remoteAllowed: true,
      numberOfTalents: 1,
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
                        {PUBLIC_CURRENCY.map((currency, idx) => (
                          <SelectItem key={idx} value={currency}>
                            {currency}
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
                        {PUBLIC_SALARY_TYPES.map((salaryType, idx) => (
                          <SelectItem key={idx} value={salaryType}>
                            {salaryType}
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
                        {PUBLIC_JOB_TYPES.map((option, idx) => (
                          <SelectItem key={idx} value={option.label}>
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
                        {PUBLIC_JOB_CATEGORIES.map((option, idx) => (
                          <SelectItem key={idx} value={option.label}>
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
