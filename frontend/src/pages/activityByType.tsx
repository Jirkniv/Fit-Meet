import  { useState, useEffect } from "react"
import { useLocation } from "react-router-dom"
import { fetchActivities } from "../api/getActitvities"
import Activity from "@/components/ui/activity"
import ActivitySmall from "@/components/ui/activitySmall"
import { Button } from "@/components/ui/button"
import ActivityModal from "../components/ui/activityModal"
import { useActivityTypesContext } from "@/context/activityTypeContext"
import { useNavigate } from "react-router"
import Category from "@/components/ui/category"
import Header from '../components/ui/header'

const ActivityByTypes = () => {
  const location = useLocation()
  const { typeId , name } = location.state || {} 
    const { activityTypes } = useActivityTypesContext()
    const navigate = useNavigate()
  const [activities, setActivities] = useState<any[]>([])
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)
  const [selectedActivityId, setSelectedActivityId] = useState<string | null>(null)
  useEffect(() => {
    
    async function loadInitialActivities() {
      try {
        const data = await fetchActivities({
          pageSize: 8,
          page: 1,
          orderBy: "createdAt", 
          order: "desc", 
          typeId, 
        })
        setActivities(data.activities)
        setHasMore(data.activities.length === 8) 
      } catch (error) {
        console.error("Erro ao carregar atividades:", error)
      }
    }

    loadInitialActivities()
  }, [typeId])

 
  async function loadMoreActivities() {
    try {
      const nextPage = page + 1
      const data = await fetchActivities({
        pageSize: 8,
        page: nextPage,
        orderBy: "createdAt", 
        order: "desc", 
        typeId, 
      })

      setActivities((prev) => [...prev, ...data.activities])
      setPage(nextPage)
      setHasMore(data.activities.length === 8) 
    } catch (error) {
      console.error("Erro ao carregar mais atividades:", error)
    }
  }

  return (
    <div className="flex flex-col gap-3">
      <Header />

      {/* Atividades Populares */}
      <div className="flex flex-row justify-between">
        <h1 className="text-subTitle font-semibold">POPULAR EM {name.toUpperCase()}</h1>
      </div>
      <div className="grid max-sm:justify-items-center lg:grid-cols-4 gap-3 md:grid-cols-2">
        {activities.slice(0, 8).map((activity) => (
          <div key={activity.id} onClick={() => setSelectedActivityId(activity.id)}>
            <Activity {...activity} />
          </div>
        ))}
      </div>

      {/* Todas as Atividades */}
      <div className="flex flex-row justify-between mt-5">
        <h1 className="text-subTitle font-semibold">ATIVIDADES</h1>
      </div>
      <div className="grid max-sm:justify-items-center lg:grid-cols-4 gap-3 md:grid-cols-2">
        {activities.map((activity) => (
          <div key={activity.id} onClick={() => setSelectedActivityId(activity.id)}>
            <ActivitySmall {...activity} />
          </div>
        ))}
      </div>
      {hasMore && (
        <div className="flex justify-center mt-4">
          <Button variant="outline" onClick={loadMoreActivities}>
            Ver mais
          </Button>
        </div>
      )}

      {/* Outros Tipos de Atividades */}
      <div className="flex flex-row justify-between mt-5">
        <h1 className="text-subTitle font-semibold">OUTROS TIPOS DE ATIVIDADES</h1>
      </div>
      <div className="grid max-sm:justify-items-center lg:grid-cols-4 gap-3 md:grid-cols-2">
        {activityTypes.map((activityType) =>
          activityType.id !== typeId ? (
            <div
              key={activityType.id}
              onClick={() =>
                navigate(`/activityByType`, {
                  state: { typeId: activityType.id, name: activityType.name },
                })
              }
              className="cursor-pointer"
            >
              <Category {...activityType} />
            </div>
          ) : null
        )}
      </div>

      {/* Modal de Atividade */}
      {selectedActivityId && (
        <ActivityModal
          activityId={selectedActivityId}
          onClose={() => setSelectedActivityId(null)}
          activityData={activities.find((activity) => activity.id === selectedActivityId)}
        />
      )}
    </div>
  )
}

export default ActivityByTypes