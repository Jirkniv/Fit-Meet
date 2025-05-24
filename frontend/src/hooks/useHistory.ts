import { useState, useEffect } from "react";
import { FetchAllParticipantActivities } from "@/api/getActivitiesParticipantAll";

export function useHistory() {
  const [history, setHistory] = useState<any[]>([]);
  const [historyPage, setHistoryPage] = useState(1);

  useEffect(() => {
    async function loadHistory() {
      try {
        const data = await FetchAllParticipantActivities();
        setHistory(data);
        setHistoryPage(1);
      } catch (error) {
        console.error("Erro ao buscar histórico de atividades:", error);
      }
    }
    loadHistory();
  }, []);

  const historyDisplayed = history.slice(0, historyPage * 8);
  const hasMoreHistory = history.length > historyDisplayed.length;

  function loadMoreHistory() {
    setHistoryPage((prev) => prev + 1);
  }

  return { historyDisplayed, hasMoreHistory, loadMoreHistory };
}