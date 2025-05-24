export async function getUserPreferences(token: string): Promise<{ typeId: string }[]> {
    try {
      const response = await fetch(`http://localhost:3000/user/preferences`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      })
  
      if (!response.ok) {
        throw new Error(`Erro ao requisitar preferências`)
      }
  
      const data = await response.json()
      console.log("Preferências requisitadas com sucesso:", data)
  
      // Verifique se `data` é um array
      if (Array.isArray(data)) {
        return data // Retorna o array diretamente
      } else {
        console.warn("Resposta inesperada da API, esperado um array:", data)
        return [] // Retorna um array vazio se `data` não for um array
      }
    } catch (error) {
      console.error("Erro ao requisitar preferências do usuário:", error)
      throw error
    }
  }