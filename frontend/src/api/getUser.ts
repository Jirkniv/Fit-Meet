export async function FetchUser() {
  const token = localStorage.getItem("token") || ""

  try {
    const response = await fetch("http://localhost:3000/user", {
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

    console.log("Dados do usuário:", jsonData)
    return {
      id: jsonData.id,
      name: jsonData.name,
      avatar: jsonData.avatar,
      level: jsonData.level,
      xp: jsonData.xp,
      email: jsonData.email,
      cpf: jsonData.cpf,
      achievements: jsonData.achievements || []
    }
    
    
  } catch (error) {
    console.error("Erro na requisição:", error)
    throw error
  }
}