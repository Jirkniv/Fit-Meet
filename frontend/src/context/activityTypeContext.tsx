import React, { createContext, useContext, useState, useEffect } from "react"
import { FetchActivitiesTypes } from "@/api/getActivityType"

interface ActivityTypesProps {
  id: string
  name: string
  image: string
  description: string

}

interface ActivityTypesContextProps {
  activityTypes: ActivityTypesProps[]
  loading: boolean
  error: string | null
}

const ActivityTypesContext = createContext<ActivityTypesContextProps | undefined>(undefined)

export const ActivityTypesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activityTypes, setActivityTypes] = useState<ActivityTypesProps[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function loadActivityTypes() {
      try {
        const data = await FetchActivitiesTypes()
        setActivityTypes(data)
      } catch (err: any) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    loadActivityTypes()
  }, [])

  return (
    <ActivityTypesContext.Provider value={{ activityTypes, loading, error }}>
      {children}
    </ActivityTypesContext.Provider>
  )
}

export const useActivityTypesContext = () => {
  const context = useContext(ActivityTypesContext)
  if (!context) {
    throw new Error("useActivityTypesContext deve ser usado dentro de ActivityTypesProvider")
  }
  return context
}