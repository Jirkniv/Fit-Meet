export async function handleCheckIn(activityId: string, token: string, confirmationCode: string): Promise<void> {
    try {
      const response = await fetch(`http://localhost:3000/activities/${activityId}/check-in`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ confirmationCode }), 
      })
  
      if (!response.ok) {
        throw new Error("Erro ao realizar o check-in")
      }
  
      alert("Check-in realizado com sucesso!")
    } catch (error: any) {
      console.error("Erro ao realizar o check-in:", error)
      throw error
    }
  }