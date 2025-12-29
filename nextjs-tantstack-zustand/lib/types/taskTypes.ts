export type TaskStatus = "pending" | "in_progress" | "done";

export type Task = {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  createdAtIso: string;
};

export type CreateTaskRequestBody = {
  title: string;
  description: string;
};

export type UpdateTaskRequestBody = {
  title?: string;
  description?: string;
  status?: TaskStatus;
};
