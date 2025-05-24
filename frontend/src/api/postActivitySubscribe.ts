export async function postSubscription(activityId: string, token: string, isPrivate: boolean): Promise<void> {
  try {
    const userSubscriptionStatus = isPrivate ? "WAITING" : "APPROVED"

    const response = await fetch(`http://localhost:3000/activities/${activityId}/subscribe`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ userSubscriptionStatus }),
    })

    if (!response.ok) {
      throw new Error("Erro ao se inscrever na atividade")
    }

    alert(
      isPrivate
        ? "Inscrição enviada para aprovação!"
        : "Inscrição realizada com sucesso!"
    )
  } catch (error: any) {
    console.error("Erro ao se inscrever:", error)
    throw error
  }
}