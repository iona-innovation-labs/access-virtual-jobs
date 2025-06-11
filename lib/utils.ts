import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { format, parseISO, isValid } from "date-fns";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(
  date: string | Date | null | undefined,
  formatString: string = "MMM yyyy"
): string {
  if (!date) {
    return "Invalid Date";
  }

  try {
    let dateObj: Date;

    if (typeof date === "string") {
      // Handle ISO date strings
      dateObj = parseISO(date);
    } else if (date instanceof Date) {
      dateObj = date;
    } else {
      return "Invalid Date";
    }

    if (!isValid(dateObj)) {
      return "Invalid Date";
    }

    return format(dateObj, formatString);
  } catch (error) {
    console.error("Error formatting date:", error);
    return "Invalid Date";
  }
}

export function formatWorkHistoryDate(
  date: string | Date | null | undefined
): string {
  return formatDate(date, "MMM yyyy");
}

export function formatFullDate(date: string | Date | null | undefined): string {
  return formatDate(date, "MMMM d, yyyy");
}

export function formatShortDate(
  date: string | Date | null | undefined
): string {
  return formatDate(date, "MMM d, yyyy");
}

export function formatDateRange(
  startDate: string | Date | null | undefined,
  endDate: string | Date | null | undefined,
  isCurrentJob: boolean = false
): string {
  const formattedStartDate = formatWorkHistoryDate(startDate);

  if (formattedStartDate === "Invalid Date") {
    return "Invalid Date Range";
  }

  if (isCurrentJob || !endDate) {
    return `${formattedStartDate} - Present`;
  }

  const formattedEndDate = formatWorkHistoryDate(endDate);

  if (formattedEndDate === "Invalid Date") {
    return `${formattedStartDate} - Present`;
  }

  return `${formattedStartDate} - ${formattedEndDate}`;
}

export function calculateDuration(
  startDate: string | Date | null | undefined,
  endDate: string | Date | null | undefined = null
): string {
  if (!startDate) {
    return "";
  }

  try {
    let start: Date;
    let end: Date = new Date(); // Default to current date

    if (typeof startDate === "string") {
      start = parseISO(startDate);
    } else if (startDate instanceof Date) {
      start = startDate;
    } else {
      return "";
    }

    if (endDate) {
      if (typeof endDate === "string") {
        end = parseISO(endDate);
      } else if (endDate instanceof Date) {
        end = endDate;
      }
    }

    if (!isValid(start) || !isValid(end)) {
      return "";
    }

    // Calculate difference in months
    const yearDiff = end.getFullYear() - start.getFullYear();
    const monthDiff = end.getMonth() - start.getMonth();
    const totalMonths = yearDiff * 12 + monthDiff;

    if (totalMonths < 0) {
      return "";
    }

    const years = Math.floor(totalMonths / 12);
    const months = totalMonths % 12;

    if (years === 0 && months === 0) {
      return "Less than a month";
    }

    const yearText = years === 1 ? "year" : "years";
    const monthText = months === 1 ? "month" : "months";

    if (years === 0) {
      return `${months} ${monthText}`;
    }

    if (months === 0) {
      return `${years} ${yearText}`;
    }

    return `${years} ${yearText} ${months} ${monthText}`;
  } catch (error) {
    console.error("Error calculating duration:", error);
    return "";
  }
}

export function formatDateForAPI(date: Date | null | undefined): string | null {
  if (!date || !isValid(date)) {
    return null;
  }
  return date.toISOString();
}

/**
 * Parses a date string from API response
 * @param dateString - ISO date string from API
 * @returns Date object or null
 */
export function parseDateFromAPI(
  dateString: string | null | undefined
): Date | null {
  if (!dateString) {
    return null;
  }

  try {
    const date = parseISO(dateString);
    return isValid(date) ? date : null;
  } catch (error) {
    console.error("Error parsing date from API:", error);
    return null;
  }
}
