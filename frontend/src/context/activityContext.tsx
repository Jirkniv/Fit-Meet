import React, { createContext, useContext, useState, useEffect } from "react"
import { fetchActivities } from "../api/getActitvities"


interface ActivityProps {
  id: string
  title: string
  image: string
  type: string
  description: string
  private: boolean
  participantCount: number
  scheduledDate: string
  address: {
    latitude: number
    longitude: number
  }
  deletedAt: string | null
  createdAt: string
  completedAt: string | null
  confirmationCode: string
  creator:{
    id: string
    name: string
    avatar: string
  }
  userSubscriptionStatus: string
}

interface ActivityContextProps {
  activities: ActivityProps[]
  loading: boolean
  error: string | null
}

const ActivityContext = createContext<ActivityContextProps | undefined>(undefined)

export const ActivityProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activities, setActivities] = useState<ActivityProps[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function loadActivities() {
      try {
        const data = await fetchActivities()
        setActivities(data.activities)
      } catch (err: any) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    loadActivities()
  }, [])

  return (
    <ActivityContext.Provider value={{ activities, loading, error }}>
      {children}
    </ActivityContext.Provider>
  )
}

export const useActivityContext = () => {
  const context = useContext(ActivityContext)
  if (!context) {
    throw new Error("useActivityContext deve ser usado dentro de ActivityProvider")
  }
  return context
}