import { useActivities } from "@/hooks/useActivities";
import { useHistory } from "@/hooks/useHistory";
import { useUserProfile } from "@/hooks/useUserProfilel";
import { useUser } from "@/hooks/useUser";
import { Link } from "react-router-dom";
import ActivityModal from "../components/ui/activityModal";
import Header from "../components/ui/header";
import Activity from "@/components/ui/activitySmall";
import { Button } from "@/components/ui/button";
import { Pencil, ChevronDown } from "lucide-react";
import Trofeus from "../assets/images/trophies.png";
import Medalha from "../assets/images/medal.png";
import { Progress } from "@/components/ui/progress";
import {
  Carousel,
  CarouselItem,
  CarouselContent,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { useState } from "react";

const Profile = () => {
  const user = useUser();
  const perfil = useUserProfile();
  const { activities, hasMoreActivities, loadMoreActivities } = useActivities();
  const { historyDisplayed, hasMoreHistory, loadMoreHistory } = useHistory();

  const [selectedActivityId, setSelectedActivityId] = useState<string | null>(null);

  return (
    <div className="h-screen ">
      <Header />

      {/* Perfil do Usuário */}
      <div className="bg-gray-100 " >
        <div className="flex justify-end m-4">
          <Link to={"/profile/update"}>
            <Button variant={"ghost"} className="border-2 text-gray-300 hover:text-gray-500">
              <Pencil />
              Editar Perfil
            </Button>
          </Link>
        </div>
        <div className="w-[192px] h-[244px] m-auto">
          <div className="">
            <img className="rounded-full w-[192px] h-[192px] mb-4" src={user.avatar!} alt="Avatar do usuário" />
          </div>
          <h1 className="text-title text-center">{user.name}</h1>
        </div>
        <div className="flex flex-col lg:flex-row  lg:h-[208px] w-full lg:w-[800px] justify-between items-center rounded-lg m-auto mt-4 gap-4">
          <div className="bg-gray-200 flex flex-col shadow-md p-8 justify-center items-center ">
            <div className="flex justify-between w-[400px] m-auto">
              <div>
                <p className="text-label font-bold">Seu nível é</p>
                <h2 className="text-title">{perfil.level}</h2>
              </div>
              <div>
                <img src={Trofeus} alt="Imagem de Troféus" />
              </div>
            </div>
            <div className="w-[400px] m-auto text-left font-light pt-8 flex flex-wrap justify-between">
              <p className="text-label mb-2">Pontos para o próximo nível</p>
              <p className="text-default font-bold">{perfil.xp} / 1000 pts</p>
              <Progress value={perfil.xp/10} className="h-2 bg-[var(--primary-color-500)]" />
            </div>
          </div>
          <div className="bg-gray-200 ">
            {/* Carousel de conquistas */}
            <Carousel className="w-full h-[208px]">
            <CarouselContent>
              {perfil.achievements?.length > 0 ? (
                perfil.achievements.map((achievement: any, index: number) => (
                  <CarouselItem key={index}>
                    <div className="p-4 flex flex-col items-center">
                      <img src={Medalha} alt="Medalha" className="w-16 h-16" />
                      <p className="text-center text-sm mt-2">{achievement.name}</p>
                    </div>
                  </CarouselItem>
                ))
              ) : (
                <CarouselItem>
                  <div className="p-4 flex flex-col items-center">
                    <img src={Medalha} alt="Medalha" className="w-16 h-16 opacity-50" />
                    <p className="text-center text-sm mt-2 text-gray-500">Nenhuma conquista ainda</p>
                  </div>
                </CarouselItem>
              )}
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
          </Carousel>

          </div>
        </div>
      </div>

      {/* Minhas Atividades */}
      <div className="mt-10">
        <h2 className="text-title mb-4">Minhas Atividades</h2>
        <div className="grid lg:grid-cols-3 md:grid-cols-2 xl:grid-cols-4 gap-4">
          {activities.map((activity) => (
            <div key={activity.id} onClick={() => setSelectedActivityId(activity.id)}>
              <Activity key={activity.id} {...activity} />
            </div>
          ))}
        </div>
        {hasMoreActivities && (
          <div className="flex justify-center mt-4">
            <Button variant="default" onClick={loadMoreActivities}>
              Ver mais <ChevronDown />
            </Button>
          </div>
        )}
      </div>

      {/* Histórico de Atividades */}
      <div className="mt-10">
        <h2 className="text-title mb-4">Histórico de Atividades</h2>
        <div className="grid lg:grid-cols-3 md:grid-cols-2 xl:grid-cols-4 gap-4">
          {historyDisplayed.map((activity) => (
            <div key={activity.id} onClick={() => setSelectedActivityId(activity.id)}>
              <Activity key={activity.id} {...activity} />
            </div>
          ))}
        </div>
        {hasMoreHistory && (
          <div className="flex justify-center mt-4">
            <Button variant="default" onClick={loadMoreHistory}>
              Ver mais <ChevronDown />
            </Button>
          </div>
        )}
      </div>

      {/* Modal de Atividade */}
      {selectedActivityId && (
        <ActivityModal
          activityId={selectedActivityId}
          onClose={() => setSelectedActivityId(null)}
          activityData={
            activities.find((activity) => activity.id === selectedActivityId) ||
            historyDisplayed.find((activity) => activity.id === selectedActivityId)
          }
        />
      )}
    </div>
  );
};

export default Profile;
