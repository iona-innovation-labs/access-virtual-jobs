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
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { IJobListing } from "@/types/jobs";
// import { updateJobPost } from "@/lib/api/jobs";
import { useRouter } from "next/navigation";

const jobFormSchema = z.object({
  title: z.string().min(3, "Title is required"),
  description: z.string().min(10, "Description is required"),
  salaryAmount: z.coerce.number().min(0, "Salary must be positive"),
  salaryCurrency: z.string().length(3, "Currency code required"),
  salaryType: z.enum(["hourly", "monthly", "yearly"]),
  location: z.string().min(2, "Location required"),
  jobType: z.enum(["freelance", "full-time", "part-time", "contract"]),
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
  status: z.enum(["active", "inactive", "closed"]),
  numberOfTalents: z.coerce.number().min(1, "At least 1 talent required"),
  tags: z.string().optional(), // comma separated
});

type JobFormValues = z.infer<typeof jobFormSchema>;

export default function EditJobForm({ job }: { job: IJobListing }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const form = useForm<JobFormValues>({
    resolver: zodResolver(jobFormSchema),
    defaultValues: {
      title: job.title || "",
      description: job.description || "",
      salaryAmount: job.salaryAmount ?? 0,
      salaryCurrency: job.salaryCurrency || "USD",
      salaryType: job.salaryType || "hourly",
      location: job.location || "",
      jobType: (job.jobType?.toLowerCase() as any) || "freelance",
      jobCategory:
        (job.jobCategory?.replace(/ & | /g, "_").toLowerCase() as any) ||
        "office_administration",
      remoteAllowed: job.remoteAllowed ?? false,
      status: job.status || "active",
      numberOfTalents: job.numberOfTalents ?? 1,
      tags: job.tags?.join(", ") || "",
    },
  });

  async function onSubmit(values: JobFormValues) {
    setLoading(true);
    console.log(values);
    setLoading(false);
    router.push(`/admin/app/jobs/v/${job.id}`);
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-6 max-w-2xl mx-auto my-12"
      >
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input {...field} />
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
                <Textarea rows={5} {...field} />
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
                  <Input type="number" step="0.01" {...field} />
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
                <FormControl>
                  <Input maxLength={3} {...field} />
                </FormControl>
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
                  <Input {...field} />
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
                    checked={field.value}
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
                      { value: "freelance", label: "Freelance" },
                      { value: "full-time", label: "Full-time" },
                      { value: "part-time", label: "Part-time" },
                      { value: "contract", label: "Contract" },
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
                      { value: "marketing_sales", label: "Marketing & Sales" },
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
                  <Input type="number" min={1} {...field} />
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
                <Input placeholder="Comma separated" {...field} />
              </FormControl>
              <FormDescription>Comma separated tags</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={loading}>
          {loading ? "Saving..." : "Save Changes"}
        </Button>
      </form>
    </Form>
  );
}
