"use client"

import type { Book } from "@/lib/fakeDb"
import { BookRow } from "./BookRow"

type Props = {
  books: Book[]
  onToggleRead: (id: string, nextRead: boolean) => void
  onDelete: (id: string) => void
  deletingId?: string | null
}

export function BooksList({ books, onToggleRead, onDelete, deletingId }: Props) {
  return (
    <ul className="mt-2 space-y-2">
      {books.map((b) => (
        <BookRow
          key={b.id}
          book={b}
          onToggleRead={onToggleRead}
          onDelete={onDelete}
          isDeleting={deletingId === b.id}
        />
      ))}
    </ul>
  )
}
