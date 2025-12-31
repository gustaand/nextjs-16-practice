"use client"

import { useUiStore } from "@/stores/uiStore"

export function BooksToolbar() {
  const query = useUiStore(state => state.query)
  const filter = useUiStore(state => state.filter)
  const setQuery = useUiStore(state => state.setQuery)
  const setFilter = useUiStore(state => state.setFilter)
  const toggleTheme = useUiStore(state => state.toggleTheme)

  return (
    <header className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex gap-2">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Buscar por título o autor…"
          className="w-full rounded-xl border border-zinc-200 bg-white px-3 py-2 text-sm outline-none focus:ring-2 dark:border-zinc-800 dark:bg-zinc-900"
        />
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value as any)}
          className="rounded-xl border border-zinc-200 bg-white px-3 py-2 text-sm dark:border-zinc-800 dark:bg-zinc-900"
        >
          <option value="all">Todos</option>
          <option value="read">Leídos</option>
          <option value="unread">Pendientes</option>
        </select>
      </div>

      <button
        onClick={toggleTheme}
        className="rounded-xl border border-zinc-200 px-3 py-2 text-sm hover:bg-zinc-50 dark:border-zinc-800 dark:hover:bg-zinc-900"
      >
        Cambiar tema
      </button>
    </header>
  )
}