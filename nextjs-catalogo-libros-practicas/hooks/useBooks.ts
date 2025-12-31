"use client"

import { createBook, deleteBook, fetchBooks, patchBook } from "@/lib/api"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"

export function useBooks() {
  const queryClient = useQueryClient()

  // 1) Query: listar de libros
  const booksQuery = useQuery({
    queryKey: ["books"],
    queryFn: fetchBooks,
  })

  // 2) Mutación: crear
  const createBookMutation = useMutation({
    mutationFn: createBook,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["books"] }),
  })

  // 3) Mutación: marcar como leído
  const toggleReadMutation = useMutation({
    mutationFn: ({ id, read }: { id: string; read: boolean }) => patchBook(id, { read }),
    onMutate: async ({ id, read }) => {
      await queryClient.cancelQueries({ queryKey: ["books"] })
      const prev = queryClient.getQueryData<any>(["books"])

      queryClient.setQueryData(["books"], (old: any) => {
        Array.isArray(old) ? old.map((b) => (b.id === id ? { ...b, read } : b)) : old
      })
      return { prev }
    },
    onError: (_err, _vars, ctx) => {
      if (ctx?.prev) queryClient.setQueryData(["books"], ctx.prev)
    },
    onSettled: () => queryClient.invalidateQueries({ queryKey: ["books"] }),
  })

  // 4) Mutación: Eliminar
  const deleteBookMutation = useMutation({
    mutationFn: deleteBook,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["books"] }),
  })

  return {
    booksQuery,
    createBookMutation,
    toggleReadMutation,
    deleteBookMutation,
  }
}