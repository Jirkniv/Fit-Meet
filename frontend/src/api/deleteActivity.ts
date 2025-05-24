export async function handleDelete(activityId: string, token: string): Promise<void> {
    try {
      const response = await fetch(`http://localhost:3000/activities/${activityId}/delete`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
       
      })
  
      if (!response.ok) {
        throw new Error("Erro ao deltetar a atividade")
      }
  
      alert("Atividade deleteta com sucesso!")
    } catch (error: any) {
      console.error("Erro ao deltetar atividade:", error)
      throw error
    }
  }