import { create } from "zustand";
import { TaskStatus } from "@/lib/types/taskTypes";

type TaskUiState = {
  searchText: string;
  selectedStatusFilter: TaskStatus | "all";
  selectedTaskId: string | null;
  isCreateTaskModalOpen: boolean;

  setSearchText: (newSearchText: string) => void
  setSelectedStatusFilter: (newFilter: TaskStatus | "all") => void;
  setSelectedTaskId: (taskId: string | null) => void;
  openCreateTaskModal: () => void;
  closeCreateTaskModal: () => void;
}

export const useTaskUiStore = create<TaskUiState>((set) => ({
  searchText: "",
  selectedStatusFilter: "all",
  selectedTaskId: null,
  isCreateTaskModalOpen: false,

  setSearchText: (newSearchText) => set({ searchText: newSearchText }),
  setSelectedStatusFilter: (newFilter) => set({ selectedStatusFilter: newFilter }),
  setSelectedTaskId: (taskId) => set({ selectedTaskId: taskId }),
  openCreateTaskModal: () => set({ isCreateTaskModalOpen: true }),
  closeCreateTaskModal: () => set({ isCreateTaskModalOpen: false }),

}))