import { Task, CreateTaskRequestBody, UpdateTaskRequestBody } from "@/lib/types/taskTypes";

async function parseJsonOrThrow(response: Response) {
  if (!response.ok) {
    const errorBody = await response.json().catch(() => null);
    const errorMessage =
      errorBody?.message ?? `Request failed with status ${response.status}`;
    throw new Error(errorMessage);
  }
  return response.json();
}

export async function fetchAllTasks(): Promise<Task[]> {
  const response = await fetch("/api/tasks", { method: "GET" });
  return parseJsonOrThrow(response);
}

export async function createTask(requestBody: CreateTaskRequestBody): Promise<Task> {
  const response = await fetch("/api/tasks", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(requestBody),
  });
  return parseJsonOrThrow(response);
}

export async function updateTask(taskId: string, requestBody: UpdateTaskRequestBody): Promise<Task> {
  const response = await fetch(`/api/tasks/${taskId}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(requestBody),
  });
  return parseJsonOrThrow(response);
}

export async function deleteTask(taskId: string): Promise<Task> {
  const response = await fetch(`/api/tasks/${taskId}`, { method: "DELETE" });
  return parseJsonOrThrow(response);
}
