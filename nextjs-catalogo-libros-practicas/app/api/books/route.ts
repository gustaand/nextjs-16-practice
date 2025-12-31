import { NextResponse } from "next/server";
import { booksDb, newId } from "@/lib/fakeDb";
import { createBookSchema } from "@/lib/schemas";

export async function GET() {
  const data = [...booksDb].sort((a, b) => b.createdAt.localeCompare(a.createdAt))
  return NextResponse.json({ data })
}

export async function POST(req: Request) {
  const body = await req.json()
  const parsed = createBookSchema.safeParse(body)

  if (!parsed.success) {
    const flat = parsed.error.flatten((issue) => issue.message)

    return NextResponse.json(
      {
        error: "Datos inválidos",
        fieldErrors: flat.fieldErrors, // { title?: string[]; author?: string[] }
        formErrors: flat.formErrors,   // string[]
      },
      { status: 400 }
    )
  }

  const book = {
    id: newId(),
    title: parsed.data.title,
    author: parsed.data.author ?? '',
    read: false,
    createdAt: new Date().toISOString(),
  }

  booksDb.push(book)
  return NextResponse.json({ data: book }, { status: 201 })
}