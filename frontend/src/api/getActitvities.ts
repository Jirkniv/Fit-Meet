
export async function fetchActivities(params?: {
  page?: number
  pageSize?: number
  typeId?: string
  orderBy?: string
  order?: "asc" | "desc"
}): Promise<any> {
  const token = localStorage.getItem("token") || ""

  const query = new URLSearchParams()

  if (params?.page !== undefined) {
    query.set("page", params.page.toString())
  }
  if (params?.pageSize !== undefined) {
    query.set("pageSize", params.pageSize.toString())
  }
  if (params?.typeId) {
    query.set("typeId", params.typeId)
  }
  if (params?.orderBy) {
    query.set("orderBy", params.orderBy)
  }
  if (params?.order) {
    query.set("order", params.order)
  }

  const url = `http://localhost:3000/activities?${query.toString()}`

  try {
    const response = await fetch(url, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    })

    if (!response.ok) {
      throw new Error(`Erro de autorização: ${response.status}`)
    }

    const jsonData = await response.json()
    return jsonData
  } catch (error) {
    console.error("Erro na requisição:", error)
    throw error
  }
}
