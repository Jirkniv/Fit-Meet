interface ParticipantProps {
    id: string
    userId: string
    name: string
    avatar: string
    userSubscriptionStatus: string
    confirmedAt: Date | null
  }
  
  export async function fetchParticipants(activityId: string, token: string): Promise<ParticipantProps[]> {
    try {
      const response = await fetch(`http://localhost:3000/activities/${activityId}/participants`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
  
      if (!response.ok) {
        throw new Error("Erro ao carregar participantes")
      }
  
      const data: ParticipantProps[] = await response.json()
      return data
    } catch (error: any) {
      console.error("Erro ao buscar participantes:", error)
      throw error
    }
  }