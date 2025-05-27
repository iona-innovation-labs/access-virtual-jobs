// lib/job-api.ts - Real API implementation using getJobs
import { JobFilters } from "@/components/jobs/job-filter";
import { getJobs } from "@/lib/api/jobs"; // Import your existing getJobs function

export interface IJobListing {
  id: string;
  url: string;
  title: string;
  pay?: string;
  description?: string;
  createdAt: string;
  postedBy: string;
}

// Simple fetch function using your existing getJobs - matches your implementation
export async function fetchJobs(
  filters: JobFilters = {
    searchText: "",
    location: "",
    jobType: "",
    experience: "",
    salary: "",
    postedBy: "",
  },
  page: number = 1,
  limit: number = 10
): Promise<{
  jobs: IJobListing[];
  total: number;
  hasMore: boolean;
}> {
  try {
    const offset = (page - 1) * limit;

    // Use your exact getJobs implementation pattern
    const result = await getJobs(
      {
        offset,
        sort_by: "created_on",
        sort_desc: true,
        limit,
        filters: {
          "job-posting-status": 3,
        },
      },
      filters.searchText || undefined, // Search parameter
      true // Third parameter from your implementation
    );

    if (!result) {
      throw new Error('Failed to fetch jobs');
    }

    if (!result.success) {
      throw new Error('Failed to fetch jobs');
    }

    const total = result.total || 0;
    const hasMore = (offset + result.items.length) < total;

    return {
      jobs: result.items,
      total,
      hasMore,
    };
  } catch (error) {
    console.error('Error fetching jobs:', error);
    throw error;
  }
}

// Function to check if user has applied to jobs
export async function checkApplicationStatus(userId: string, jobIds: string[]): Promise<Record<string, boolean>> {
  try {
    const response = await fetch('/api/jobs/application-status', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ jobIds }),
    });

    if (!response.ok) {
      throw new Error('Failed to check application status');
    }

    const result = await response.json();
    return result.applicationStatus || {};
  } catch (error) {
    console.error('Error checking application status:', error);
    return {};
  }
}

// Function to apply to a job - uses your existing API
export async function applyToJob(jobId: string): Promise<{ success: boolean; message: string }> {
  try {
    const response = await fetch('/api/submissions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ jobId }),
    });

    const result = await response.json();

    return {
      success: result.ok,
      message: result.message || (result.ok ? 'Application submitted successfully!' : 'Failed to submit application'),
    };
  } catch (error) {
    console.error('Error applying to job:', error);
    return {
      success: false,
      message: 'Network error. Please try again.',
    };
  }
}