export async function handleUpdate(userId: string, token: string, updatedData: any): Promise<void> {
  try {
    const response = await fetch(`http://localhost:3000/user/update`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: updatedData.name,
        email: updatedData.email,
        password: updatedData.password || "", 
      }),
    })
    console.log(updatedData.name)
    if (!response.ok) {
      throw new Error("Erro ao editar o usuário")
    }

    const data = await response.json()
    console.log("Usuário atualizado:", data)
    alert("Usuário atualizado com sucesso!")
  } catch (error: any) {
    console.error("Erro ao editar usuário:", error)
    throw error
  }
}