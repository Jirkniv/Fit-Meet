import { useState, useEffect } from "react";
import { FetchAllCreatorActivities } from "@/api/getActivitiesCreatoAllr";

export function useActivities() {
  const [activities, setActivities] = useState<any[]>([]);
  const [page, setPage] = useState(1);
  const [hasMoreActivities, setHasMoreActivities] = useState(true);

  useEffect(() => {
    async function loadInitialActivities() {
      try {
        const data = await FetchAllCreatorActivities(1, 8); // Página inicial com 8 atividades
        setActivities(data.activities || []);
        setHasMoreActivities(data.activities.length === 8); // Verifica se há mais páginas
        setPage(1);
      } catch (error) {
        console.error("Erro ao carregar atividades do criador:", error);
      }
    }
    loadInitialActivities();
  }, []);

  async function loadMoreActivities() {
    try {
      const nextPage = page + 1;
      const data = await FetchAllCreatorActivities(nextPage, 8);

      const newActivities = data.activities.filter(
        (act: any) => !activities.find((a) => a.id === act.id)
      );
      setActivities((prev) => [...prev, ...newActivities]);
      setPage(nextPage);
      setHasMoreActivities(newActivities.length === 8); // Verifica se há mais páginas
    } catch (error) {
      console.error("Erro ao carregar mais atividades do criador:", error);
    }
  }

  return { activities, hasMoreActivities, loadMoreActivities };
}