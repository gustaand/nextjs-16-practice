import { Task, TaskStatus } from "@/lib/types/taskTypes";

type TasksDatabase = {
  tasks: Task[];
};

function createInitialDatabase(): TasksDatabase {
  const initialTasks: Task[] = [
    {
      id: "task_1",
      title: "Aprender TanStack Query",
      description: "Practicar useQuery + useMutation + invalidation",
      status: "pending",
      createdAtIso: new Date().toISOString(),
    },
    {
      id: "task_2",
      title: "Aprender Zustand",
      description: "Practicar estado UI (filtros, modales, selección)",
      status: "in_progress",
      createdAtIso: new Date().toISOString(),
    },
  ];

  return { tasks: initialTasks };
}

declare global {
  // eslint-disable-next-line no-var
  var tasksDatabase: TasksDatabase | undefined;
}

export function getTasksDatabase(): TasksDatabase {
  if (!globalThis.tasksDatabase) {
    globalThis.tasksDatabase = createInitialDatabase();
  }
  return globalThis.tasksDatabase;
}

export function generateTaskId(): string {
  return `task_${Math.random().toString(16).slice(2)}_${Date.now()}`;
}

export function isValidTaskStatus(status: unknown): status is TaskStatus {
  return status === "pending" || status === "in_progress" || status === "done";
}
