// src/lib/api.ts
import type { Book } from "@/lib/fakeDb"

async function jsonOrThrow(res: Response) {
  const data = await res.json().catch(() => ({}))
  if (!res.ok) throw new Error(data?.error ?? "Error de red")
  return data
}

export async function fetchBooks(): Promise<Book[]> {
  const res = await fetch("/api/books")
  const json = await jsonOrThrow(res)
  return json.data
}

export async function createBook(input: { title: string; author: string }): Promise<Book> {
  const res = await fetch("/api/books", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  })
  const json = await jsonOrThrow(res)
  return json.data
}

export async function patchBook(
  id: string,
  input: Partial<{ title: string; author: string; read: boolean }>
): Promise<Book> {
  const res = await fetch(`/api/books/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  })
  const json = await jsonOrThrow(res)
  return json.data
}

export async function deleteBook(id: string): Promise<Book> {
  const res = await fetch(`/api/books/${id}`, { method: "DELETE" })
  const json = await jsonOrThrow(res)
  return json.data
}
