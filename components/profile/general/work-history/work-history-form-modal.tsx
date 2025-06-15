import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";

const workHistoryFormSchema = z
  .object({
    company: z.string().min(1, "Company name is required"),
    position: z.string().min(1, "Position is required"),
    startDate: z.date({
      required_error: "Start date is required",
    }),
    endDate: z.date().optional(),
    description: z.string().optional(),
    isCurrentJob: z.boolean(),
    location: z.string().optional(),
    employmentType: z
      .enum(["full-time", "part-time", "contract", "freelance"])
      .optional(),
  })
  .refine(
    (data) => {
      if (data.endDate && data.startDate && data.endDate < data.startDate) {
        return false;
      }
      return true;
    },
    {
      message: "End date cannot be before start date",
      path: ["endDate"],
    }
  );

type WorkHistoryFormData = z.infer<typeof workHistoryFormSchema>;

interface WorkHistoryItem {
  id: number;
  profileId: number;
  company: string;
  position: string;
  startDate: string;
  endDate?: string;
  description?: string;
  isCurrentJob: string;
  location?: string;
  employmentType?: string;
  createdAt: string;
}

interface WorkHistoryFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: WorkHistoryFormData) => Promise<void>;
  editingItem?: WorkHistoryItem | null;
  isLoading?: boolean;
}

export const WorkHistoryFormModal = ({
  isOpen,
  onClose,
  onSave,
  editingItem,
  isLoading = false,
}: WorkHistoryFormModalProps) => {
  const form = useForm<WorkHistoryFormData>({
    resolver: zodResolver(workHistoryFormSchema),
    defaultValues: {
      company: "",
      position: "",
      startDate: undefined,
      endDate: undefined,
      description: "",
      isCurrentJob: false,
      location: "",
      employmentType: undefined,
    },
  });

  const isCurrentJob = form.watch("isCurrentJob");

  // Reset form when modal opens/closes or editing item changes
  React.useEffect(() => {
    if (isOpen) {
      if (editingItem) {
        form.reset({
          company: editingItem.company,
          position: editingItem.position,
          startDate: new Date(editingItem.startDate),
          endDate: editingItem.endDate
            ? new Date(editingItem.endDate)
            : undefined,
          description: editingItem.description || "",
          isCurrentJob: editingItem.isCurrentJob === "yes",
          location: editingItem.location || "",
          employmentType: (editingItem.employmentType as any) || undefined,
        });
      } else {
        form.reset({
          company: "",
          position: "",
          startDate: undefined,
          endDate: undefined,
          description: "",
          isCurrentJob: false,
          location: "",
          employmentType: undefined,
        });
      }
    }
  }, [isOpen, editingItem, form]);

  // Clear end date when current job is checked
  React.useEffect(() => {
    if (isCurrentJob) {
      form.setValue("endDate", undefined);
    }
  }, [isCurrentJob, form]);

  const handleSave = async (data: WorkHistoryFormData) => {
    await onSave(data);
    form.reset();
    onClose();
  };

  const handleClose = () => {
    form.reset();
    onClose();
  };

  // Prevent form submission from bubbling up
  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    e.stopPropagation();
    form.handleSubmit(handleSave)(e);
  };

  const employmentTypeOptions = [
    { value: "full-time", label: "Full-time" },
    { value: "part-time", label: "Part-time" },
    { value: "contract", label: "Contract" },
    { value: "freelance", label: "Freelance" },
  ];

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>
            {editingItem ? "Edit Work Experience" : "Add Work Experience"}
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={handleFormSubmit} className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="company"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Company *</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. Google, Microsoft" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="position"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Position *</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. Software Engineer" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="employmentType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Employment Type</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {employmentTypeOptions.map((option) => (
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
                name="location"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Location</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. San Francisco, CA" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="startDate"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Start Date *</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant="outline"
                            className={cn(
                              "pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value ? (
                              format(field.value, "MMM yyyy")
                            ) : (
                              <span>Pick a date</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          disabled={(date) =>
                            date > new Date() || date < new Date("1900-01-01")
                          }
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="endDate"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>End Date</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant="outline"
                            disabled={isCurrentJob}
                            className={cn(
                              "pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground",
                              isCurrentJob && "opacity-50 cursor-not-allowed"
                            )}
                          >
                            {field.value ? (
                              format(field.value, "MMM yyyy")
                            ) : (
                              <span>Pick a date</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          disabled={(date) =>
                            date > new Date() || date < new Date("1900-01-01")
                          }
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="isCurrentJob"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>I currently work here</FormLabel>
                  </div>
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
                    <Textarea
                      placeholder="Describe your responsibilities, achievements, and key projects..."
                      className="min-h-[100px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  handleClose();
                }}
                disabled={isLoading}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isLoading}
                onClick={(e) => {
                  e.stopPropagation();
                }}
              >
                {isLoading ? "Saving..." : editingItem ? "Update" : "Add"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
