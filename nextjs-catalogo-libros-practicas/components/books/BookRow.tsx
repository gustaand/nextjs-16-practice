"use client"

import type { Book } from "@/lib/fakeDb"
import { useUiStore } from "@/stores/uiStore"

type Props = {
  book: Book
  onToggleRead: (id: string, nextRead: boolean) => void
  onDelete: (id: string) => void
  isDeleting?: boolean
}

export function BookRow({ book, onToggleRead, onDelete, isDeleting }: Props) {
  const openDetails = useUiStore(state => state.openDetails)

  return (
    <li className="flex items-center justify-between gap-3 rounded-2xl border border-zinc-200 p-3 dark:border-zinc-800">
      <button
        className="text-left"
        title="Ver detalles"
        onClick={() => openDetails(book.id)}
      >
        <div className="flex items-center gap-2">
          <span>
            <span className="font-medium">{book.title}</span>
            <span className="text-xs text-zinc-500 dark:text-zinc-400">— {book.author}</span>
          </span>
        </div>
        <div className="mt-1 text-xs text-zinc-600 dark:text-zinc-400">
          Estado: {book.read ? "Leído" : "Pendiente"}
        </div>
      </button>

      <div className="flex items-center gap-2">
        <button
          onClick={() => onToggleRead(book.id, !book.read)}
          className="rounded-xl border border-zinc-200 px-3 py-2 text-xs hover:bg-zinc-50 dark:border-zinc-800 
          dark:hover:bg-zinc-900"
        >
          {book.read ? "Marcar pendiente" : "Marcar leído"}
        </button>

        <button
          onClick={() => onDelete(book.id)}
          disabled={isDeleting}
          className="rounded-xl border border-zinc-200 px-3 py-2 text-xs 
          hover:bg-zinc-50 disabled:opacity-60 dark:border-zinc-800 dark:hover:bg-zinc-900"
        >
          {isDeleting ? "Borrando…" : "Borrar"}
        </button>
      </div>

    </li>
  )
}