import Activity from "@/components/ui/activity"
import { useActivityContext } from "../context/activityContext"
import { useActivityTypesContext } from "../context/activityTypeContext"
import Category from "@/components/ui/category"
import ActivitySmall from "@/components/ui/activitySmall"
import { Link } from "react-router-dom"
import { useState } from "react"
import ActivityModal from "../components/ui/activityModal"
import { Preferences } from "../components/ui/preferences"
import { useNavigate } from "react-router"
import Header from "../components/ui/header"




const Home = () => {

  const navigate = useNavigate() 

  const { activities, loading, error } = useActivityContext()
  const { activityTypes } = useActivityTypesContext()
  const [selectedActivityId, setSelectedActivityId] = useState<string | null>(null)

  if (loading) {
    return <p>Carregando atividades...</p>
  }

  if (error) {
    return <p>Erro ao carregar atividades: {error}</p>
  }

  // Agrupar atividades por tipo
  const groupedActivities = activityTypes.map((type) => ({
    type,
    activities: activities.filter((activity) => activity.type === type.name),
  }))

  return (
    <div className="flex flex-col gap-3">
<Preferences/>

     <Header/>

      {/* Recomendado */}
      <div className="flex flex-row justify-between">
        <h1 className="text-subTitle font-semibold">RECOMENDADO PARA VOCÊ</h1>
        
      </div>
      <div className="grid max-sm:justify-items-center lg:grid-cols-4 gap-3 md:grid-cols-2  ">
        {activities.map((activity) => (
          <div key={activity.id} onClick={() => setSelectedActivityId(activity.id)}>
            <Activity {...activity} />
          </div>
        ))}
      </div>

      {/* Tipos de Atividades */}
      <div className="flex flex-row justify-between mt-5">
        <h1 className="text-subTitle font-semibold">TIPOS DE ATIVIDADES</h1>
      </div>
      <div className="grid grid-cols-4 gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {activityTypes.map((activityType) => (
           <div
           key={activityType.id}
           onClick={() => navigate(`/activityByType`, { state: { typeId: activityType.id, name: activityType.name } })} 
           className="cursor-pointer"
         >
           <Category {...activityType} />
         </div>
        ))}
      </div>

      {/* Atividades */}
      <div className="grid grid-cols-1  max-sm:justify-items-center  md:grid-cols-2 gap-8">
        {groupedActivities.slice(0, 2).map(({ type, activities }) => (
          <div key={type.id} className="flex flex-col gap-4">
            <div className="flex justify-between items-center">
              <h1 className="text-subTitle font-semibold">{type.name.toUpperCase()}</h1>
              <Link to={`/activityByType`} state={{ typeId: type.id }}>
                <p className="text-gray-700 font-bold hover:text-gray-900 hover:underline hover:cursor-pointer">
                  Ver mais
                </p>
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {activities.slice(0, 6).map((activity) => (
                <div key={activity.id} onClick={() => setSelectedActivityId(activity.id)}>
                <ActivitySmall key={activity.id} {...activity} />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1  max-sm:justify-items-center md:grid-cols-2 gap-8">
        {groupedActivities.slice(2, 4).map(({ type, activities }) => (
          <div key={type.id} className="flex flex-col gap-4">
            <div className="flex justify-between items-center">
              <h1 className="text-subTitle font-semibold">{type.name.toUpperCase()}</h1>
              <Link to={`/activityByType`} state={{ typeId: type.id, name: type.name }}>
                <p className="text-gray-700 font-bold hover:text-gray-900 hover:underline hover:cursor-pointer">
                  Ver mais
                </p>
              </Link>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">

              {activities.slice(0, 6).map((activity) => (
                <div key={activity.id} onClick={() => setSelectedActivityId(activity.id)}>
                <ActivitySmall key={activity.id} {...activity} />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
      {/* Modal de Atividade */}
      {selectedActivityId && (
              <ActivityModal
                activityId={selectedActivityId}
                onClose={() => setSelectedActivityId(null)}
                activityData={activities.find(activity => activity.id === selectedActivityId)!}
              />
            )}
          
      
    </div>
  )
}

export default Home