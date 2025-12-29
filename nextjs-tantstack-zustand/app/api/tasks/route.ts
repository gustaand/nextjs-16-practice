import { NextResponse } from "next/server";
import { CreateTaskRequestBody } from "@/lib/types/taskTypes";
import { generateTaskId, getTasksDatabase } from "./tasksInMemoryDatabase";

export async function GET() {
  const tasksDatabase = getTasksDatabase();

  const tasksSortedByNewest = [...tasksDatabase.tasks].sort((a, b) =>
    b.createdAtIso.localeCompare(a.createdAtIso)
  );

  return NextResponse.json(tasksSortedByNewest);
}

export async function POST(request: Request) {
  const tasksDatabase = getTasksDatabase();
  const requestBody = (await request.json()) as CreateTaskRequestBody;

  const title = requestBody.title?.trim();
  const description = requestBody.description?.trim();

  if (!title) {
    return NextResponse.json(
      { message: "Title is required" },
      { status: 400 }
    );
  }

  const newTask = {
    id: generateTaskId(),
    title,
    description: description ?? "",
    status: "pending" as const,
    createdAtIso: new Date().toISOString(),
  };

  tasksDatabase.tasks.push(newTask);

  return NextResponse.json(newTask, { status: 201 });
}
