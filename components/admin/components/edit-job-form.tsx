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
import { IJobListing } from "@/types/jobs";
import { JobRichTextEditor } from "./job-rich-text-editor";
import { TagsInput } from "./tags-input";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { fetchApi } from "@/services/fetch-api";
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
  status: z.enum(["active", "inactive", "closed"]),
  numberOfTalents: z.coerce
    .number()
    .min(1, "Please specify how many people you need for this role"),
  tags: z.array(z.string()),
});

type JobFormValues = z.infer<typeof jobFormSchema>;

export default function EditJobForm({ job }: { job: IJobListing }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const form = useForm<JobFormValues>({
    resolver: zodResolver(jobFormSchema),
    defaultValues: {
      title: job.title || "",
      description: job.description || "",
      salaryAmount: job.salaryAmount ?? 0,
      salaryCurrency: (job.salaryCurrency as "USD" | "PHP") || "USD",
      salaryType: job.salaryType || "hourly",
      location: job.location || "Remote",
      jobType: job.jobType || PUBLIC_JOB_TYPES[0].label,
      jobCategory: job.jobCategory || PUBLIC_JOB_CATEGORIES[0].label,
      remoteAllowed: job.remoteAllowed ?? true,
      status: job.status || "active",
      numberOfTalents: job.numberOfTalents ?? 1,
      tags: job.tags || [],
    },
  });

  async function onSubmit(values: JobFormValues) {
    setLoading(true);
    console.log("Form submitted with values:", values);
    console.log("Job ID:", job.id);

    try {
      const updatedJob = await fetchApi(`/admin/jobs/${job.id}`, {
        method: "PUT",
        body: JSON.stringify(values),
      });

      console.log("Job updated successfully:", updatedJob);

      toast({
        title: "Success!",
        description: "Job updated successfully",
        variant: "success",
      });

      // Redirect to the job view page
      router.push(`/admin/app/jobs/v/${job.id}`);
    } catch (error) {
      console.error("Error updating job:", error);
      toast({
        title: "Error",
        description: `Failed to update job: ${error instanceof Error ? error.message : "Unknown error"}`,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
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
          <h1 className="text-3xl font-bold text-gray-900">Edit Job</h1>
          <p className="text-gray-600 mt-2">Update the job details below.</p>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
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
                          <SelectItem key={idx} value={option.key}>
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
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Status</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      value={field.value || ""}
                      disabled={loading}
                    >
                      <FormControl>
                        <SelectTrigger className="border-border w-full focus:border-brand focus:ring-brand">
                          <SelectValue placeholder="Select Status" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {[
                          { value: "active", label: "Active" },
                          { value: "inactive", label: "Inactive" },
                          { value: "closed", label: "Closed" },
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

            <Button type="submit" disabled={loading}>
              Save Changes
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
}
