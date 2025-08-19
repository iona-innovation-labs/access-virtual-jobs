import { getJobPostFromPodio } from "@/lib/api/podio-jobs";
import { db } from "@/database";
import { jobs } from "@/database/schema";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const body = await req.text();
  // Parse URL-encoded body
  const params = new URLSearchParams(body);
  const type = params.get("type");

  console.log("[Webhook] Raw body:", body);
  console.log("[Webhook] Parsed params:", { type });

  switch (type) {
    case "hook.verify": {
      const hook_id = params.get("hook_id");
      const code = params.get("code");
      console.log("[Webhook] Parsed params:", { hook_id, code });
      if (!hook_id || !code) {
        console.error("[Webhook] Missing hook_id or code", { hook_id, code });
        return NextResponse.json(
          { success: false, message: "Missing hook_id or code" },
          { status: 400 }
        );
      }
      try {
        const podioUrl = `https://api.podio.com/hook/${hook_id}/verify/validate`;
        const podioHeaders = {
          "Content-Type": "application/json",
        };
        const podioBody = JSON.stringify({ code });
        console.log("[Webhook] Sending request to Podio:", {
          url: podioUrl,
          method: "POST",
          headers: podioHeaders,
          body: podioBody,
        });
        // Call the Podio verification endpoint
        const podioRes = await fetch(podioUrl, {
          method: "POST",
          headers: podioHeaders,
          body: podioBody,
        });
        const podioText = await podioRes.text();
        let podioData;
        try {
          podioData = JSON.parse(podioText);
        } catch {
          podioData = podioText;
        }
        console.log("[Webhook] Podio response status:", podioRes.status);
        console.log("[Webhook] Podio response body:", podioData);
        if (!podioRes.ok) {
          console.error("[Webhook] Podio verification failed", podioData);
          return NextResponse.json(
            { success: false, message: "Podio verification failed", podioData },
            { status: podioRes.status }
          );
        }
        return NextResponse.json({
          success: true,
          message: "Podio hook verified",
          podioData,
        });
      } catch (error) {
        console.error(
          "[Webhook] Error verifying Podio hook",
          error instanceof Error ? error.stack : error
        );
        return NextResponse.json(
          {
            success: false,
            message: "Error verifying Podio hook",
            error: error instanceof Error ? error.stack : String(error),
          },
          { status: 500 }
        );
      }
    }
    case "item.create": {
      const item_id = params.get("item_id") ?? "";
      console.log("[Webhook] Parsed params:", { item_id });
      const result = await getJobPostFromPodio(item_id);
      console.log("[Webhook] JOB FROM PODIO:", result);
      if (!result?.success || !result.item) {
        return NextResponse.json(
          {
            success: false,
            message: "Failed to fetch job from Podio",
          },
          { status: 500 }
        );
      }
      const podioJob = result.item;
      // Map Podio job to DB schema
      const newJob = {
        title: podioJob.title,
        description: podioJob.description,
        salaryAmount: null, // Could parse from podioJob.pay if structured
        salaryCurrency: "USD", // Default, or parse if available
        salaryType: "hourly" as const, // Use correct literal type
        location: null,
        jobType: null,
        jobCategory: null,
        remoteAllowed: true,
        status: "inactive" as const,
        slug: podioJob.title
          .toLowerCase()
          .replace(/ /g, "-")
          .replace(/[^a-z0-9\-]/g, "")
          .slice(0, 290),
        postedById: "",
        createdAt: podioJob.createdAt
          ? new Date(podioJob.createdAt)
          : new Date(),
        updatedAt: new Date(),
        numberOfTalents: 1,
        tags: [] as string[],
        alsoPostedOn: [] as string[],
      };
      const inserted = await db.insert(jobs).values(newJob).returning();
      console.log("[Webhook] Inserted job:", inserted[0]);
      return NextResponse.json({
        success: true,
        message: "Job created",
        job: inserted[0],
      });
    }
    default:
      console.log("[Webhook] Default case, returning received body");
      return NextResponse.json({
        success: true,
        message: "Job webhook received",
        body,
      });
  }
}
