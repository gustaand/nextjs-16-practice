import { BooksView } from "@/components/books/BooksView"

export default function HomePage() {
  return (
    <main className="mx-auto max-w-3xl px-4 py-8">
      <h1 className="text-2xl font-semibold">Catálogo de libros</h1>
      <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
        Demo con Next.js 16 + TanStack Query + Zustand (fake backend incluido).
      </p>

      <div className="mt-6">
        <BooksView />
      </div>
    </main>
  )
}
