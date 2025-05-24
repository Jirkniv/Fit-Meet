export async function handleUnsubscribe(activityId: string, token: string): Promise<void> {
    try {
      const response = await fetch(`http://localhost:3000/activities/${activityId}/unsubscribe`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
  
      if (!response.ok) {
        throw new Error("Erro ao se desinscrever da atividade")
      }
  
      alert("Desinscrição realizada com sucesso!")
    } catch (error: any) {
      console.error("Erro ao se desinscrever:", error)
      throw error
    }
  }