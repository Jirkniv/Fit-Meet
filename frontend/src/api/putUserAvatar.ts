export async function handleUpdateAvatar(userId: string, token: string, imageFile: File): Promise<string> {
    try {
      const formData = new FormData();
      formData.append("avatar", imageFile);
  
      const response = await fetch(`http://localhost:3000/user/avatar`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
         
        },
        body: formData,
      });
  
      if (!response.ok) {
        throw new Error("Erro ao atualizar o avatar do usuário");
      }
  
      const data = await response.json();
      console.log("Avatar atualizado com sucesso:", data);
  
      return data.avatar; 
    } catch (error: any) {
      throw new Error(error.message || "Erro desconhecido");
    }
  }
  