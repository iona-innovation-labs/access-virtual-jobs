import * as z from "zod";

export const notificationSchema = z.object({
  jobRecommendation: z.boolean({
    required_error: "Job recommendation notification preference is required",
  }),
  jobSubmission: z.boolean({
    required_error: "Job submission notification preference is required",
  }),
  jobApplication: z.boolean({
    required_error: "Job application notification preference is required",
  }),
  accountUpdatePref: z.boolean({
    required_error: "Account update notification preference is required",
  }),

});

export type NotificationSchema = z.infer<typeof notificationSchema>;
