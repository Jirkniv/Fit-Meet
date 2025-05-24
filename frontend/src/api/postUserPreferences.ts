export async function defineUserPreferences(token: string, preferences: string[]): Promise<any> {
    try {
      const response = await fetch(`http://localhost:3000/user/preferences/define`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`, 
        },
        body: JSON.stringify(preferences),  
      })
  
      if (!response.ok) {

        const errorData = await response.json()
        throw new Error(`Erro ao definir preferências: ${JSON.stringify(errorData)}`)
      }
  
      
    } catch (error) {
      console.error("Erro ao definir preferências do usuário:", error)
      throw error
    }
  }