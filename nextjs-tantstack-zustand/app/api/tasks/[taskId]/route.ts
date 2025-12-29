import { NextResponse } from "next/server";
import type { UpdateTaskRequestBody } from "@/lib/types/taskTypes";
import { getTasksDatabase, isValidTaskStatus } from "../../tasks/tasksInMemoryDatabase";

// En Next 15+/16, params es Promise en rutas dinámicas
type RouteContext = { params: Promise<{ taskId: string }> };

export async function GET(_: Request, routeContext: RouteContext) {
  const tasksDatabase = getTasksDatabase();
  const { taskId } = await routeContext.params;

  const foundTask = tasksDatabase.tasks.find((task) => task.id === taskId);

  if (!foundTask) {
    return NextResponse.json({ message: "Task not found" }, { status: 404 });
  }

  return NextResponse.json(foundTask);
}

export async function PUT(request: Request, routeContext: RouteContext) {
  const tasksDatabase = getTasksDatabase();
  const { taskId } = await routeContext.params;

  const foundTaskIndex = tasksDatabase.tasks.findIndex((task) => task.id === taskId);

  if (foundTaskIndex === -1) {
    return NextResponse.json({ message: "Task not found" }, { status: 404 });
  }

  const requestBody = (await request.json()) as UpdateTaskRequestBody;

  if (requestBody.status !== undefined && !isValidTaskStatus(requestBody.status)) {
    return NextResponse.json({ message: "Invalid status" }, { status: 400 });
  }

  const existingTask = tasksDatabase.tasks[foundTaskIndex];

  const updatedTask = {
    ...existingTask,
    title: requestBody.title ?? existingTask.title,
    description: requestBody.description ?? existingTask.description,
    status: requestBody.status ?? existingTask.status,
  };

  tasksDatabase.tasks[foundTaskIndex] = updatedTask;

  return NextResponse.json(updatedTask);
}

export async function DELETE(_: Request, routeContext: RouteContext) {
  const tasksDatabase = getTasksDatabase();
  const { taskId } = await routeContext.params;

  const foundTaskIndex = tasksDatabase.tasks.findIndex((task) => task.id === taskId);

  if (foundTaskIndex === -1) {
    return NextResponse.json({ message: "Task not found" }, { status: 404 });
  }

  const deletedTask = tasksDatabase.tasks.splice(foundTaskIndex, 1)[0];
  return NextResponse.json(deletedTask);
}
