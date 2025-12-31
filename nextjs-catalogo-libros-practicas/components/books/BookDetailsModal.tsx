"use client"
import type { Book } from "@/lib/fakeDb"
import { useUiStore } from "@/stores/uiStore"

export function BookDetailsModal({ books }: { books: Book[] }) {
  const isOpen = useUiStore(state => state.isDetailsOpen)
  const id = useUiStore(state => state.selectedBookId)
  const close = useUiStore(state => state.closeDetails)

  const book = books.find(b => b.id === id)

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/40 p-4">
      <div className="w-full max-w-md rounded-2xl border border-zinc-200 bg-white p-4 shadow-lg dark:border-zinc-800 
      dark:bg-zinc-950">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h3 className="text-lg font-semibold">{book?.title ?? "—"}</h3>
            <p className="text-sm text-zinc-600 dark:text-zinc-400">{book?.author ?? ""}</p>
          </div>
          <button
            onClick={close}
            className="rounded-xl border border-zinc-200 px-3 py-2 text-sm dark:border-zinc-800"
          >
            Cerrar
          </button>
        </div>

        <div className="mt-3 text-sm">
          <p>
            <span className="text-zinc-600 dark:text-zinc-400">Estado:</span>{" "}
            {book?.read ? "Leído" : "Pendiente"}
          </p>
          <p className="mt-1">
            <span className="text-zinc-600 dark:text-zinc-400">Creado:</span>{" "}
            {book?.createdAt ? new Date(book.createdAt).toLocaleString("es-ES") : "—"}
          </p>
        </div>
      </div>
    </div>
  )
}