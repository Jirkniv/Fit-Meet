

export async function deleteUser(token: string): Promise<void> {
    try {
      const response = await fetch("http://localhost:3000/user/deactivate", {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
  
      if (!response.ok) {
        throw new Error("Erro ao deletar o usuário")
      }
  
      alert("Usuário deletado com sucesso!")
      localStorage.clear() 
      window.location.href = "/"
    } catch (error: any) {
      console.error("Erro ao deletar o usuário:", error)
      throw error
    }
  }