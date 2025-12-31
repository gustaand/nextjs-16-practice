"use client"

import { useState } from "react";

type Props = {
  onSubmit: (input: { title: string; author: string }) => void
  isPending: boolean
  errorMessage?: string | null
  fieldErrors?: Partial<Record<"title" | "author", string[]>> | null
}

export function AddBookForm({ onSubmit, isPending, errorMessage, fieldErrors }: Props) {
  const [title, setTitle] = useState("")
  const [author, setAuthor] = useState("")

  return (
    <div className="mt-4 rounded-2xl border border-zinc-200 p-3 dark:border-zinc-800">
      <h2 className="text-sm font-medium">Añadir libro</h2>

      <form
        className=""
        onSubmit={(e) => {
          e.preventDefault()
          onSubmit({ title, author })
        }}
      >
        <div className="sm:col-span-1">
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Título"
            className="w-full rounded-xl border border-zinc-200 bg-white px-3 py-2 text-sm outline-none 
            focus:ring-2 dark:border-zinc-800 dark:bg-zinc-900"
          />
          {fieldErrors?.title?.[0] && (
            <p className="mt-1 text-xs text-red-600">{fieldErrors.title[0]}</p>
          )}
        </div>

        <div className="sm:col-span-1">
          <input
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
            placeholder="Autor"
            className="w-full rounded-xl border border-zinc-200 bg-white px-3 py-2 text-sm outline-none focus:ring-2 dark:border-zinc-800 dark:bg-zinc-900"
          />
          {fieldErrors?.author?.[0] && (
            <p className="mt-1 text-xs text-red-600">{fieldErrors.author[0]}</p>
          )}
        </div>

        <button
          disabled={isPending}
          className="rounded-xl bg-zinc-900 px-3 py-2 text-sm font-medium text-white disabled:opacity-60 dark:bg-zinc-100 dark:text-zinc-900"
        >
          {isPending ? "Guardando…" : "Añadir"}
        </button>
      </form>

      {errorMessage && <p className="mt-2 text-sm text-red-600">{errorMessage}</p>}
    </div>
  )
}