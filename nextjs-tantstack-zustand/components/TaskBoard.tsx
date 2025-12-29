"use client"
import { useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createTask, deleteTask, fetchAllTasks, updateTask } from "@/lib/api/tasksApi";
import { Task, TaskStatus } from "@/lib/types/taskTypes";
import { useTaskUiStore } from "@/stores/useTaskUiStore";

const TASKS_QUERY_KEY = ["tasks"];

export default function TaskBoard() {

  // --- ESTADO GLOBAL CON ZUSTAND ---
  const searchText = useTaskUiStore((state) => state.searchText);
  const selectedStatusFilter = useTaskUiStore((state) => state.selectedStatusFilter);

  const setSearchText = useTaskUiStore((state) => state.setSearchText);
  const setSelectedStatusFilter = useTaskUiStore((state) => state.setSelectedStatusFilter);

  // --- ESTADO LOCAL CON USESTATE ---
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [newTaskDescription, setNewTaskDescription] = useState("");

  // --- TANSTAK QUERY ---
  const queryClient = useQueryClient();

  const tasksQuery = useQuery({
    queryKey: TASKS_QUERY_KEY,
    queryFn: fetchAllTasks
  });
  const isLoadingTasks = tasksQuery.isLoading;
  const tasksLoadErrorMessage = tasksQuery.error instanceof Error ? tasksQuery.error.message : null;

  // CREAR TAREA Y ACTUALIZAR CACHÉ
  const createTaskMutation = useMutation({
    mutationFn: createTask, // Llama a createTask y pasa los parametros recibidos en createTaskMutation.mutate({...})
    onSuccess: (createdTask) => {  // onSuccess ejecuta algo cuando termina mutationFn, recibe como parametro lo que devuelva mutationFn
      // Le pedimos que queryClient.setQueryData actualice el caché local
      queryClient.setQueryData<Task[]>(TASKS_QUERY_KEY, (previousTasks) => {
        const safePreviousTasks = previousTasks ?? [];
        return [createdTask, ...safePreviousTasks]; // Retornamos cache actualizado con copia de datos antiguos + nuevo dato
      });

      // resetear estados
      setNewTaskTitle("");
      setNewTaskDescription("");
    },
  });

  // CAMBIAR STATUS DE TAREA Y ACTUALIZAR CACHÉ
  const updateTaskStatusMutation = useMutation({
    // Recibe el ID y el nuevo status y se lo pasa a updateTask para actualizar el status de ese ID
    mutationFn: ({ taskId, nextStatus }: { taskId: string; nextStatus: TaskStatus }) => {
      return updateTask(taskId, { status: nextStatus });
    },
    onSuccess: (updatedTask) => {
      queryClient.setQueryData<Task[]>(TASKS_QUERY_KEY, (previousTasks) => {
        if (!previousTasks) return previousTasks;

        // Solo se actualiza en el caché la tarea que tiene el ID igual al id que queremos actualizar
        return previousTasks.map((task) => (task.id === updatedTask.id ? updatedTask : task));
      });
    },
  });

  // ELIMINAR TAREA Y ACTUALIZAR CACHÉ
  const deleteTaskMutation = useMutation({
    mutationFn: ({ taskId }: { taskId: string }) => {
      return deleteTask(taskId);
    },
    onSuccess: (deletedTask) => {
      queryClient.setQueryData<Task[]>(TASKS_QUERY_KEY, (previousTasks) => {
        if (!previousTasks) return previousTasks;
        return previousTasks.filter((task) => task.id !== deletedTask.id);
      });
    },
  });

  // FILTRO DE TAREAS
  const filteredTasks = useMemo(() => {
    const allTasksFromServer = tasksQuery.data ?? [];

    const tasksFilteredByStatus = selectedStatusFilter === "all"
      ? allTasksFromServer
      : allTasksFromServer.filter((task) => task.status === selectedStatusFilter);

    const normalizedSearchText = searchText.trim().toLowerCase();
    if (!normalizedSearchText) return tasksFilteredByStatus

    return tasksFilteredByStatus.filter((task) => {
      const searchableText = `${task.title} ${task.description}`.toLowerCase();
      return searchableText.includes(normalizedSearchText);
    })
  }, [tasksQuery.data, selectedStatusFilter, searchText]);


  // HANDLERS
  function handleCreateTask() {
    const title = newTaskTitle.trim();
    const description = newTaskDescription.trim();

    if (!title) return;
    createTaskMutation.mutate({ title, description });
  }

  function handleChangeTaskStatus(taskId: string, nextStatus: TaskStatus) {
    updateTaskStatusMutation.mutate({ taskId, nextStatus });
  }

  function handleDeleteTask(taskId: string) {
    deleteTaskMutation.mutate({ taskId });
  }

  return (
    <div className="mx-auto w-full max-w-4xl p-6">
      <h1 className="text-2xl font-semibold">TaskBoard</h1>
      <p className="mt-2 text-zinc-300">
        TanStack Query (server-state) + Zustand (UI-state) + REST fake en Next.
      </p>

      {/* Filtros UI (Zustand) */}
      <section className="mt-6 grid gap-3 rounded-2xl border border-zinc-800 bg-zinc-900 p-4">
        <div className="grid gap-3 sm:grid-cols-2">
          <label className="grid gap-2">
            <span className="text-sm text-zinc-300">Buscar</span>
            <input
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              className="rounded-xl border border-zinc-800 bg-zinc-950 px-3 py-2 outline-none focus:border-zinc-600"
              placeholder="Buscar por título o descripción..."
            />
          </label>

          <label className="grid gap-2">
            <span className="text-sm text-zinc-300">Filtrar por estado</span>
            <select
              value={selectedStatusFilter}
              onChange={(e) => setSelectedStatusFilter(e.target.value as TaskStatus | "all")}
              className="rounded-xl border border-zinc-800 bg-zinc-950 px-3 py-2 outline-none focus:border-zinc-600"
            >
              <option value="all">Todos</option>
              <option value="pending">Pendiente</option>
              <option value="in_progress">En progreso</option>
              <option value="done">Hecho</option>
            </select>
          </label>
        </div>
      </section>

      {/* Crear tarea (POST) */}
      <section className="mt-6 grid gap-3 rounded-2xl border border-zinc-800 bg-zinc-900 p-4">
        <h2 className="text-lg font-medium">Crear tarea</h2>

        <div className="grid gap-3 sm:grid-cols-2">
          <input
            value={newTaskTitle}
            onChange={(e) => setNewTaskTitle(e.target.value)}
            className="rounded-xl border border-zinc-800 bg-zinc-950 px-3 py-2 outline-none focus:border-zinc-600"
            placeholder="Título..."
          />
          <input
            value={newTaskDescription}
            onChange={(e) => setNewTaskDescription(e.target.value)}
            className="rounded-xl border border-zinc-800 bg-zinc-950 px-3 py-2 outline-none focus:border-zinc-600"
            placeholder="Descripción..."
          />
        </div>

        <button
          onClick={handleCreateTask}
          disabled={createTaskMutation.isPending}
          className="w-fit rounded-xl bg-zinc-100 px-4 py-2 text-zinc-950 disabled:opacity-60"
        >
          {createTaskMutation.isPending ? "Creando..." : "Crear"}
        </button>

        {createTaskMutation.error instanceof Error ? (
          <p className="text-sm text-red-300">Error: {createTaskMutation.error.message}</p>
        ) : null}
      </section>

      {/* Lista tareas (GET) */}
      <section className="mt-6 grid gap-3 rounded-2xl border border-zinc-800 bg-zinc-900 p-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-medium">Tareas</h2>
          <button
            onClick={() => tasksQuery.refetch()}
            className="rounded-xl border border-zinc-700 px-3 py-2 text-sm hover:bg-zinc-800"
          >
            Refetch
          </button>
        </div>

        {isLoadingTasks ? <p className="text-zinc-300">Cargando...</p> : null}
        {tasksLoadErrorMessage ? (
          <p className="text-red-300">Error: {tasksLoadErrorMessage}</p>
        ) : null}

        {!isLoadingTasks && !tasksLoadErrorMessage ? (
          <ul className="grid gap-3">
            {filteredTasks.map((task) => (
              <li key={task.id} className="rounded-2xl border border-zinc-800 bg-zinc-950 p-4">
                <p className="text-base font-semibold">{task.title}</p>
                <p className="text-sm text-zinc-300">{task.description}</p>

                <div className="mt-3 flex flex-wrap gap-2">
                  <button
                    onClick={() => handleChangeTaskStatus(task.id, "pending")}
                    disabled={updateTaskStatusMutation.isPending}
                    className="rounded-xl border border-zinc-700 px-3 py-2 text-sm hover:bg-zinc-900 disabled:opacity-60"
                  >
                    Pendiente
                  </button>

                  <button
                    onClick={() => handleChangeTaskStatus(task.id, "in_progress")}
                    disabled={updateTaskStatusMutation.isPending}
                    className="rounded-xl border border-zinc-700 px-3 py-2 text-sm hover:bg-zinc-900 disabled:opacity-60"
                  >
                    En progreso
                  </button>

                  <button
                    onClick={() => handleChangeTaskStatus(task.id, "done")}
                    disabled={updateTaskStatusMutation.isPending}
                    className="rounded-xl border border-zinc-700 px-3 py-2 text-sm hover:bg-zinc-900 disabled:opacity-60"
                  >
                    Hecho
                  </button>

                  <button
                    onClick={() => handleDeleteTask(task.id)}
                    disabled={deleteTaskMutation.isPending}
                    className="rounded-xl border border-red-700 px-3 py-2 text-sm text-red-200 hover:bg-red-950/40 disabled:opacity-60"
                  >
                    Eliminar
                  </button>
                </div>
              </li>
            ))}

            {filteredTasks.length === 0 ? (
              <li className="text-sm text-zinc-300">No hay tareas con esos filtros.</li>
            ) : null}
          </ul>
        ) : null}
      </section>
    </div>
  );
}