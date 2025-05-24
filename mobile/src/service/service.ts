import api from '../api/api';

export async function fetchActivities(params?: {
  page?: number;
  pageSize?: number;
  typeId?: string;
  orderBy?: string;
  order?: 'asc' | 'desc';
}): Promise<any[]> {
  const queryParams: string[] = [];

  if (params?.page !== undefined) queryParams.push(`page=${params.page}`);
  if (params?.pageSize !== undefined) queryParams.push(`pageSize=${params.pageSize}`);
  if (params?.typeId) queryParams.push(`typeId=${encodeURIComponent(params.typeId)}`);
  if (params?.orderBy) queryParams.push(`orderBy=${encodeURIComponent(params.orderBy)}`);
  if (params?.order) queryParams.push(`order=${params.order}`);

  const queryString = queryParams.length > 0 ? `?${queryParams.join('&')}` : '';
  const url = `/activities${queryString}`;

  try {
    const response = await api.get(url);
    return response.data.activities;
  } catch (error: any) {
    console.error('Erro na requisição:', error.message);
    throw new Error(`Erro ao buscar atividades: ${error.response?.status || 'Desconhecido'}`);
  }
}


export async function FetchActivitiesTypes() {
  const url = `/activities/types`;
  try {
    const response = await api.get(url);
    console.log(response.data)
    return response.data;
  } catch (error: any) {
    console.error('Erro na requisição:', error.message);
    throw new Error(`Erro ao buscar atividades: ${error.response?.status || 'Desconhecido'}`);
  }
}

interface ActivityData {
  image: any; 
  title: string;
  description: string;
  typeId: string;
  private: boolean;
  address: {
    latitude: number;
    longitude: number;
  };
  scheduledDate: string;
}

export async function postActivity(data: ActivityData): Promise<void> {
  const formData = new FormData();


  formData.append('title', data.title);
  formData.append('description', data.description);
  formData.append('typeId', data.typeId);
  formData.append('private', String(data.private));
  formData.append('address', JSON.stringify(data.address));
  formData.append('scheduledDate', data.scheduledDate);


  if (data.image) {
    formData.append('image', {
      uri: data.image.uri,
      type: data.image.type || 'image/jpeg', 
      name: data.image.fileName || 'image.jpg', 
      
    });
  }

  try {
    const response = await api.post('/activities/new', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    console.log('Atividade criada com sucesso:', response.data);
  } catch (error: any) {
    console.error('Erro ao criar atividade:', error.response?.data || error.message);
    throw new Error('Erro ao criar atividade');
  }
}

export async function handleUpdateAvatar(userId: string, imageFile: File): Promise<string> {
  try {
    const formData = new FormData();
    formData.append('avatar', {
      uri: (imageFile as any).uri,
      type: imageFile.type || 'image/jpeg',
      name: imageFile.name || 'image.jpg',
    } as any); 

    const response = await api.put('/user/avatar', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    console.log('Avatar atualizado com sucesso:', response.data);
    return response.data.avatar; 
  } catch (error: any) {
    console.error('Erro ao atualizar o avatar:', error.response?.data || error.message);
    throw new Error(error.message || 'Erro ao atualizar o avatar');
  }
}
export async function handleUpdateProfile(userId: string, updatedData: any): Promise<void> {
  try {
    const response = await api.put(`/user/update`, {
      name: updatedData.name,
      email: updatedData.email,
      password: updatedData.password || "", 
    }, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    console.log("Usuário atualizado:", response.data);
  } catch (error: any) {
    console.error("Erro ao editar usuário:", error.response?.data || error.message);
    throw new Error(error.message || "Erro ao atualizar o perfil");
  }
}


export async function getUserPreferences(): Promise<any[]> {
  try {
    const response = await api.get('/user/preferences');
    return response.data; 
  } catch (error: any) {
    console.error('Erro ao buscar preferências do usuário:', error.message);
    throw new Error('Erro ao buscar preferências do usuário');
  }
}


export async function defineUserPreferences(preferences: string[]): Promise<void> {
  try {
    const response = await api.post('/user/preferences/define', preferences, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    console.log('Preferências definidas com sucesso:', response.data);
  } catch (error: any) {
    console.error('Erro ao definir preferências do usuário:', error.message);
    throw new Error('Erro ao definir preferências do usuário');
  }
}
export async function postRegister(data: {
  name: string;
  cpf: string;
  email: string;
  password: string;
}): Promise<void> {
  try {
    const response = await api.post('/auth/register', data, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    console.log('Usuário registrado com sucesso:', response.data);
  } catch (error: any) {
    console.error('Erro ao registrar usuário:', error.response?.data || error.message);
    throw new Error(error.response?.data?.message || 'Erro ao registrar usuário');
  }
}
export async function fetchCreatorActivities(
  page: number,
  pageSize: number
): Promise<{
  activities: any[];
  next: string | null;
  previous: string | null;
  totalPages: number;
  totalActivities: number;
}> {
  try {
    const response = await api.get(`/activities/user/creator?page=${page}&pageSize=${pageSize}`);
    return response.data;
  } catch (error: any) {
    console.error('Erro ao buscar atividades criadas:', error.message);
    throw new Error('Erro ao buscar atividades criadas');
  }
}

interface ParticipantProps {
  id: string
  userId: string
  name: string
  avatar: string
  userSubscriptionStatus: string
  confirmedAt: Date | null
}

export async function  fetchParticipants(activityId: string): Promise<ParticipantProps[]> {
  try {
    const response = await api.get<ParticipantProps[]>(
      `/activities/${activityId}/participants`)

    return response.data;
  } catch (error: any) {
  console.error('Erro ao buscar participantes:', error.message);
  throw new Error('Erro ao buscar participantes');
  }
}


export async function fetchParticipantActivities(page: number, pageSize: number): Promise<any> {
  try {
    const response = await api.get(`/activities/user/participant?page=${page}&pageSize=${pageSize}`);
    return response.data; 
  } catch (error: any) {
    console.error('Erro ao buscar atividades inscritas:', error.message);
    throw new Error('Erro ao buscar atividades inscritas');
  }
}

export async function postSubscription(activityId: string, isPrivate: boolean): Promise<void> {
  try {
    const response = await api.post(`/activities/${activityId}/subscribe`, { private: isPrivate });
    console.log(response.data)
  } catch (error: any) {
    console.error('Erro ao se inscrever:', error.message);
    throw error;
  }
}


export async function handleUnsubscribe(activityId: string): Promise<void> {
  try {
    const response = await api.delete(`/activities/${activityId}/unsubscribe`);
    console.log(response.data)
  } catch (error: any) {
    console.error('Erro ao se desinscrever:', error.message);
    throw error;
  }
}


export async function handleApprove(activityId: string, participantId: string, approved: boolean): Promise<void> {
  try {
    const response = await api.put(`/activities/${activityId}/approve`, {
      participantId,
      approved
    });
    console.log(response.data);
  } catch (error: any) {
    console.error('Erro ao aprovar/rejeitar participante:', error.message);
    throw error;
  }
}



export async function handleCheckIn(activityId: string, confirmationCode: string): Promise<void> {
  try {
    const response = await api.put(`/activities/${activityId}/check-in`, { confirmationCode });
    console.log(response.data)
  } catch (error: any) {
    console.error('Erro ao realizar check-in:', error.message);
    throw error;
  }
}


export async function handleConclude(activityId: string): Promise<void> {
  try {
    const response = await api.put(`/activities/${activityId}/conclude`);
    console.log(response.data)
  } catch (error: any) {
    console.error('Erro ao encerrar atividade:', error.message);
    throw error;
  }
}
export async function handleDeleteActivity(activityId: string): Promise<void> {
  try {
    const response = await api.delete(`/activities/${activityId}/delete`);
    console.log(response.data)
  } catch (error: any) {
    console.error('Erro ao excluir atividade:', error.message);
    throw error;
  }
}
export async function handleUpdadeActivity(activityId: string, data: any): Promise<void> {
  try {
    const formData = new FormData();

    formData.append('title', data.title);
    formData.append('description', data.description);
    formData.append('typeId', data.typeId);
    formData.append('private', String(data.private));
    formData.append('address', JSON.stringify(data.address));
    formData.append('scheduledDate', data.scheduledDate);

    if (data.image) {
      formData.append('image', {
        uri: data.image.uri,
        type: data.image.type || 'image/jpeg',
        name: data.image.fileName || 'image.jpg',
      });
    }

    const response = await api.put(`/activities/${activityId}/update`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    console.log('Atividade atualizada com sucesso:', response.data);
  } catch (error: any) {
    console.error('Erro ao editar atividade:', error.response?.data || error.message);
    throw Error('Erro ao editar atividade');
  }
}

export async function handleDeleteUser(): Promise<void> {
  try {
    const response = await api.delete(`/user/deactivate`);
    console.log(response.data)
    
  } catch (error: any) {
    console.error('Erro ao excluir usuário:', error.message);
    throw error;
  }
}