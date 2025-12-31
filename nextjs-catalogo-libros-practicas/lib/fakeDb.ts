
export type Book = {
  id: string
  title: string
  author?: string
  read: boolean
  createdAt: string
}

const globalForDb = globalThis as unknown as { _books?: Book[] }

const seed: Book[] = [
  {
    id: "b1",
    title: "Clean Code",
    author: "Robert C. Martin",
    read: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: "b2",
    title: "The Pragmatic Programmer",
    author: "Andrew Hunt / David Thomas",
    read: false,
    createdAt: new Date().toISOString(),
  },
]

export const booksDb: Book[] = (globalForDb._books ??= seed)

export function newId() {
  return "b_" + Math.random().toString(16).slice(2)
}