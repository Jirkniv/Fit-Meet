import React, { createContext, useContext, useState, useEffect } from 'react';
import { FetchActivitiesTypes } from '../service/service';

interface ActivityType {
  id: string;
  name: string;
  image: string;
  description: string;
}

interface ActivityTypeContextProps {
  activityTypes: ActivityType[];
  loading: boolean;
  error: string | null;
}

const ActivityTypeContext = createContext<ActivityTypeContextProps | undefined>(undefined);

export const ActivityTypeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activityTypes, setActivityTypes] = useState<ActivityType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadActivityTypes = async () => {
      try {
        const data = await FetchActivitiesTypes();
        console.log(data);
        setActivityTypes(data);
      } catch (err: any) {
        setError('Erro ao carregar tipos de atividades');
        console.error('Erro ao buscar tipos de atividades:', err.message);
      } finally {
        setLoading(false);
      }
    };

    loadActivityTypes();
  }, []);

  return (
    <ActivityTypeContext.Provider value={{ activityTypes, loading, error }}>
      {children}
    </ActivityTypeContext.Provider>
  );
};

export const useActivityTypeContext = () => {
  const context = useContext(ActivityTypeContext);
  if (!context) {
    throw new Error('useActivityTypeContext deve ser usado dentro de ActivityTypeProvider');
  }
  return context;
};