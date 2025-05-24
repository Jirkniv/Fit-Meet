
export async function handleApprove(
  activityId: string,
  token: string,
  updatedData: {
    participantId: string;
    approved: boolean; 
  }
): Promise<void> {
  try {
    const response = await fetch(`http://localhost:3000/activities/${activityId}/approve`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        participantId: updatedData.participantId,
        approved: updatedData.approved, 
      }),
    });

    if (!response.ok) {
      throw new Error("Erro ao aprovar o participante");
    }

    alert("Participante aprovado/rejeitado com sucesso!");
  } catch (error: any) {
    console.error("Erro ao editar atividade:", error);
    throw error;
  }
}
