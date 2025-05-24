export async function FetchAllParticipantActivities() {
    const token = localStorage.getItem("token") || ""
  
    try {
      const response = await fetch("http://localhost:3000/activities/user/participant/all", {
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