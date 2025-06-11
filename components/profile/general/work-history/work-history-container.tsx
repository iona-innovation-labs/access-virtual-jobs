import React from "react";
import useSWR from "swr";
import { useToast } from "@/hooks/use-toast";
import { fetchApi } from "@/services/fetch-api";
import { AppError } from "@/utils/app-error";
import { IWorkHistoryResponse } from "@/types/profile-overview";

import { WorkHistorySection } from "./work-history";
import { WorkHistoryFormModal } from "./work-history-form-modal";

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

interface WorkHistoryFormData {
  company: string;
  position: string;
  startDate: Date;
  endDate?: Date;
  description?: string;
  isCurrentJob: boolean;
  location?: string;
  employmentType?: string;
}

interface WorkHistoryContainerProps {
  isEditable?: boolean;
}

export const WorkHistoryContainer = ({
  isEditable = false,
}: WorkHistoryContainerProps) => {
  const { toast } = useToast();
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [editingItem, setEditingItem] = React.useState<WorkHistoryItem | null>(
    null
  );
  const [isLoading, setIsLoading] = React.useState(false);

  // Fetch work history data
  const {
    data: workHistoryData,
    error,
    mutate,
  } = useSWR<IWorkHistoryResponse, AppError>(
    "/profile/work-history",
    fetchApi,
    {
      revalidateOnFocus: false,
      dedupingInterval: 60000, // Cache for 1 minute
    }
  );

  const handleAdd = () => {
    setEditingItem(null);
    setIsModalOpen(true);
  };

  const handleEdit = (item: WorkHistoryItem) => {
    setEditingItem(item);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this work experience?")) {
      return;
    }

    try {
      setIsLoading(true);
      const response = (await fetchApi(`/profile/work-history?id=${id}`, {
        method: "DELETE",
      })) as { ok: boolean; internalMessage?: string };

      if (!response.ok) {
        throw new Error(
          response.internalMessage || "Failed to delete work experience"
        );
      }

      toast({
        title: "Success",
        description: "Work experience deleted successfully.",
        variant: "success",
      });

      // Refresh data
      mutate();
    } catch (error: any) {
      console.error("Error deleting work experience:", error);
      toast({
        title: "Error",
        description:
          error.message ||
          "Failed to delete work experience. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async (formData: WorkHistoryFormData) => {
    try {
      setIsLoading(true);

      // Convert form data to API format
      const apiData = {
        ...formData,
        startDate: formData.startDate.toISOString().split("T")[0], // Format as YYYY-MM-DD
        endDate: formData.endDate
          ? formData.endDate.toISOString().split("T")[0]
          : undefined,
        isCurrentJob: formData.isCurrentJob ? "yes" : "no",
        ...(editingItem && { id: editingItem.id }),
      };

      const method = editingItem ? "PUT" : "POST";
      const response = await fetchApi<IWorkHistoryResponse>(
        "/profile/work-history",
        {
          method,
          body: JSON.stringify(apiData),
        }
      );

      if (!response.ok) {
        throw new Error(
          response.message ||
            `Failed to ${editingItem ? "update" : "create"} work experience`
        );
      }

      toast({
        title: "Success",
        description: `Work experience ${editingItem ? "updated" : "added"} successfully.`,
        variant: "success",
      });

      // Refresh data
      mutate();
    } catch (error: any) {
      console.error("Error saving work experience:", error);
      toast({
        title: "Error",
        description:
          error.message ||
          `Failed to ${editingItem ? "update" : "add"} work experience. Please try again.`,
        variant: "destructive",
      });
      throw error; // Re-throw to prevent modal from closing
    } finally {
      setIsLoading(false);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingItem(null);
  };

  // Handle loading and error states
  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-600 mb-2">Error loading work history</p>
        <p className="text-gray-500 text-sm">{error.internalMessage}</p>
      </div>
    );
  }

  if (!workHistoryData) {
    return (
      <div className="animate-pulse">
        <div className="h-48 bg-gray-200 rounded-lg"></div>
      </div>
    );
  }

  return (
    <>
      <WorkHistorySection
        workHistory={workHistoryData.workHistory || []}
        isEditable={isEditable}
        onAdd={handleAdd}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      <WorkHistoryFormModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSave={handleSave}
        editingItem={editingItem}
        isLoading={isLoading}
      />
    </>
  );
};
