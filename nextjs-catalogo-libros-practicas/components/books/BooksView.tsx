"use client"
import React, { useMemo, useState } from 'react'
import { useUiStore } from '@/stores/uiStore'
import { useBooks } from '@/hooks/useBooks'
import { BooksToolbar } from './BooksToolbar'
import { AddBookForm } from './AddBookForm'
import { BooksList } from './BooksList'
import { BookDetailsModal } from './BookDetailsModal'

export function BooksView() {

  const { booksQuery, createBookMutation, toggleReadMutation, deleteBookMutation } = useBooks()

  // UI state (Zustand)
  const query = useUiStore(state => state.query)
  const filter = useUiStore(state => state.filter)

  // Local state
  const [deletingId, setDeletingId] = useState<string | null>(null)

  // Filtrado
  const filteredBooks = useMemo(() => {
    const all = booksQuery.data ?? []
    const q = query.trim().toLowerCase()

    return all.filter((b) => {
      const matchesText =
        !q || b.title.toLowerCase().includes(q) || b.author?.toLowerCase().includes(q)
      const matchesFilter = filter === "all" ? true : filter === "read" ? b.read : !b.read
      return matchesText && matchesFilter
    })
  }, [booksQuery.data, query, filter])

  const createError = createBookMutation.error as any
  const fieldErrors = createError?.fieldErrors ?? null
  const errorMessage = (createBookMutation.error as Error | null)?.message ?? null

  return (
    <section className="rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
      <BooksToolbar />

      <AddBookForm
        onSubmit={({ title, author }) => {
          createBookMutation.mutate({ title, author })
        }}
        isPending={createBookMutation.isPending}
        errorMessage={createBookMutation.isError ? errorMessage : null}
        fieldErrors={fieldErrors}
      />

      <div className="mt-4">
        {booksQuery.isLoading && <p className="text-sm">Cargando…</p>}
        {booksQuery.isError && (
          <p className="text-sm text-red-600">{(booksQuery.error as Error).message}</p>
        )}

        {!booksQuery.isLoading && filteredBooks.length === 0 && (
          <p className="mt-3 text-sm text-zinc-600 dark:text-zinc-400">
            No hay resultados con ese filtro/búsqueda.
          </p>
        )}

        <BooksList
          books={filteredBooks}
          deletingId={deletingId}
          onToggleRead={(id, nextRead) => toggleReadMutation.mutate({ id, read: nextRead })}
          onDelete={(id) => {
            setDeletingId(id)
            deleteBookMutation.mutate(id, {
              onSettled: () => setDeletingId(null),
            })
          }}
        />
      </div>

      <BookDetailsModal books={booksQuery.data ?? []} />
    </section>
  )
}
