import React, { useState, useEffect } from 'react';
import { View, Text, Alert, ActivityIndicator } from 'react-native';
import { Input } from '../CustomImput/CustomImput';
import { Button } from '../CustomButton/CustomButton';
import Category from '../category/categoty';
import { styles } from './styles';
import DatePicker from '../DatePicker/DatePicker.tsx';
import ImagePicker from '../ImagePicker/ImagePicker.tsx';
import Map from '../map/Map.tsx';
import { postActivity, handleUpdadeActivity, fetchActivities, handleDeleteActivity } from '../../service/service';
import Toast from 'react-native-toast-message';
import { showErrorToast, showSuccessToast } from '../Toast/Toast';

interface ActivityFormProps {
  onSuccess?: () => void;
  activityId?: string; 
}

interface Activity {
  id: string;
  title: string;
  description: string;
  scheduledDate: string;
  address: string;
  private: boolean;
  image: string;
  typeId: string;
}

interface FetchActivitiesResponse {
  activities: Activity[];
}
const ActivityForm = ({ onSuccess, activityId }: ActivityFormProps) => {
  const [loading, setLoading] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [eventDate, setEventDate] = useState('');
  const [meetingPoint, setMeetingPoint] = useState<{ latitude: number; longitude: number } | null>(
    null
  );

  // const [meetingPoint, setMeetingPoint] = useState({
  //   latitude: -19.82853362565354, 
  //   longitude: -43.087692260742195,
  // });
  const [visibility, setVisibility] = useState('public');
  const [image, setImage] = useState<any>(null);
  const [selectedTypeId, setSelectedTypeId] = useState<string | null>(null);
  const [titleError, setTitleError] = useState(false);
  const [descriptionError, setDescriptionError] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

  useEffect(() => {
    if (activityId) {
      loadActivityData();
    }
  }, [activityId]);

  const loadActivityData = async () => {
    try {
      console.log(activityId);
      setLoading(true);
      const data = await fetchActivities();
      const activity = data.find((act: any) => act.id === activityId);
      setTitle(activity.title);
      setDescription(activity.description);
      setEventDate(activity.scheduledDate);
      setMeetingPoint(activity.address);
      setVisibility(activity.private ? 'private' : 'public');
      setImage(activity.image);
      setSelectedTypeId(activity.typeId);
      setSelectedCategories([activity.typeId]);
    } catch (error) {
      Alert.alert('Erro', 'Erro ao carregar os dados da atividade.');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!title) {
      setTitleError(true);
      showErrorToast('Erro', 'Título obrigatório');
      return;
    }
  
    if (!description) {
      setDescriptionError(true);
      showErrorToast('Erro', 'Descrição obrigatória');
      return;
    }
  
    if (!selectedTypeId) {
      Toast.show({
        type: 'error',
        text1: 'Selecione uma categoria',
      });
      return;
    }
  
    
    const isValidImage = image && ['image/png', 'image/jpg', 'image/jpeg'].includes(image.type);
    if (!isValidImage) {
      showErrorToast('Erro', 'Imagem inválida, por favor, escolha uma imagem PNG, JPG ou JPEG.');
      return;
    }
  
    
    const isDateInPast = new Date(eventDate) < new Date();
    if (isDateInPast) {
      showErrorToast('Erro', 'Data inválida, por favor, escolha uma data futura.');
      return;
    }
  
    try {
      setLoading(true);
      if (activityId) {
        await handleUpdadeActivity(activityId, {
          image,
          title,
          description,
          typeId: selectedTypeId,
          private: visibility === 'private',
          address: meetingPoint,
          scheduledDate: eventDate,
        });
        showSuccessToast('Sucesso', 'Atividade atualizada com sucesso!');
      } else {
        await postActivity({
          image,
          title,
          description,
          typeId: selectedTypeId,
          private: visibility === 'private',
          address: meetingPoint!,
          scheduledDate: eventDate,
        });
        showSuccessToast('Sucesso', 'Atividade criada com sucesso!');
      }
      onSuccess?.();
    } catch (error) {
      showErrorToast('Erro', 'Erro ao salvar atividade. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  function handleToggleCategory(id: string) {
    setSelectedCategories((prevSelected) =>
      prevSelected.includes(id) ? prevSelected.filter((item) => item !== id) : [id]
    );
    setSelectedTypeId(id);
  }
  function handleDeleteActivityClick(activityId: string) {
    try {
      setLoading(true);
      handleDeleteActivity(activityId);
      showSuccessToast('Sucesso', 'Atividade deletada com sucesso!');
    } catch (error) {
      showErrorToast('Erro', 'Erro ao deletar atividade. Tente novamente.');
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#00BC7D" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ImagePicker onImageSelected={(img) => setImage(img)}  />

      <Input.Root isError={titleError}>
        <Input.Label required>Título</Input.Label>
        <Input.Input
          value={title}
          onChangeText={(text) => {
            setTitle(text);
            setTitleError(false);
          }}
          placeholder="Ex.: Título da atividade"
        />
      </Input.Root>

      <Input.Root isError={descriptionError}>
        <Input.Label required>Descrição</Input.Label>
        <Input.Input
          value={description}
          onChangeText={(text) => {
            setDescription(text);
            setDescriptionError(false);
          }}
          placeholder="Ex.: Descrição da atividade"
        />
      </Input.Root>

      <DatePicker
        label="Data do evento"
        onChange={(date) => setEventDate(date.toISOString())}
      />
     <View style={styles.mapContainer}>
       <Text style={styles.label}>Ponto de Encontro</Text>
       <Map
          onLocationChange={(latitude, longitude) => setMeetingPoint({ latitude, longitude })}
          initialPosition={meetingPoint || undefined}
        />
     </View>

      <Text style={styles.label}>Visibilidade</Text>
      <View style={styles.visibilityContainer}>
        <Button.Root
          style={[styles.visibilityButton, visibility === 'private' && styles.selectedButton]}
          onPress={() => setVisibility('private')}
        >
          <Button.Label>Privado</Button.Label>
        </Button.Root>
        <Button.Root
          style={[styles.visibilityButton, visibility === 'public' && styles.selectedButton]}
          onPress={() => setVisibility('public')}
        >
          <Button.Label>Público</Button.Label>
        </Button.Root>
      </View>

      <Text style={styles.label}>Categorias</Text>
      <Category
        selected={selectedCategories}
        size={61}
        onPress={(typeId) => handleToggleCategory(typeId)}
      />

      <Button.Root
        style={styles.footerButtons}
        onPress={handleSave}
      >
        <Button.Label>Salvar</Button.Label>
      </Button.Root>

      {activityId && (
        <Button.Root
              type='ghost'
              style={styles.footerButtons}
              onPress={() => handleDeleteActivityClick(activityId)}
            >
              <Button.Label type='ghost'>Cancelar Atividade</Button.Label>
            </Button.Root>
      )}

    </View>
  );
};

export default ActivityForm;