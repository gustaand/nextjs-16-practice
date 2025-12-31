export type IdParams = Promise<{ id: string }>

export async function getIdFromParams(params: IdParams) {
  const { id } = await params
  return id
}
