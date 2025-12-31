// src/app/api/books/[id]/route.ts
import { NextResponse } from "next/server"
import { booksDb } from "@/lib/fakeDb"
import { patchBookSchema } from "@/lib/schemas"
import { getIdFromParams, type IdParams } from "@/lib/routeContext"

type Ctx = { params: IdParams }

export async function PATCH(req: Request, ctx: RouteContext<"/api/books/[id]">) {
  const { id } = await ctx.params

  // 2) Ahora buscamos el libro
  const idx = booksDb.findIndex((b) => b.id === id)
  if (idx === -1) return NextResponse.json({ error: "No encontrado" }, { status: 404 })

  // 3) Ahora validamos el body
  const body = await req.json()
  const parsed = patchBookSchema.safeParse(body)
  if (!parsed.success) {
    const flat = parsed.error.flatten((issue) => issue.message)
    return NextResponse.json(
      { error: "Datos inválidos", fieldErrors: flat.fieldErrors, formErrors: flat.formErrors },
      { status: 400 }
    )
  }

  // 4) Ahora aplicamos el patch
  booksDb[idx] = { ...booksDb[idx], ...parsed.data }
  return NextResponse.json({ data: booksDb[idx] })
}

export async function DELETE(_req: Request, ctx: Ctx) {
  // 1) Primero resolvemos params
  const id = await getIdFromParams(ctx.params)

  // 2) Ahora borramos
  const idx = booksDb.findIndex((b) => b.id === id)
  if (idx === -1) return NextResponse.json({ error: "No encontrado" }, { status: 404 })

  const [removed] = booksDb.splice(idx, 1)
  return NextResponse.json({ data: removed })
}
