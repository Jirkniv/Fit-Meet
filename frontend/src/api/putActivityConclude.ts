export async function handleConclude(activityId: string, token: string,): Promise<void> {
    try {
      const response = await fetch(`http://localhost:3000/activities/${activityId}/conclude`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      })
  
      if (!response.ok) {
        throw new Error("Erro ao encerrar a atividade")
      }
  
      alert("Atividade encerrada com sucesso!")
    } catch (error: any) {
      console.error("Erro ao encerrar a atividade:", error)
      throw error
    }
  }