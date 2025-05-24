import React from 'react';
import { Text, View, Image, ScrollView, TouchableOpacity } from 'react-native';
import Activity from '../../components/activity/activity';
import Category from '../../components/category/categoty';
import { styles } from './styles';
import { useTypedNavigation } from '../../hooks/useTypedNavigation';
import { MainStackParamList } from '../../routes/AppRoutes';
import { useRoute, RouteProp } from '@react-navigation/native';
import { fetchActivities, fetchCreatorActivities } from '../../service/service';
import { useState, useEffect } from 'react';
import ActivitySectionList from '../../components/ActivitySectionList/ActivitySectionList';
import Title from '../../components/Title/Title';
import {GoBackArrow} from '../../components/GoBackArrow/GoBackArrow';



type ActivityByTypeRouteProp = RouteProp<MainStackParamList, 'ActivityByType'>;
function ActivityByType(): React.JSX.Element {
  const navigation = useTypedNavigation();
  const route = useRoute<ActivityByTypeRouteProp>();
  const { typeId, name } = route.params; 
  const selectedCategories = [typeId];
  const [activities, setActivities] = useState<any[]>([]);
  const [creatorPage, setCreatorPage] = useState(1);
  const [hasMoreCreatorActivities, setHasMoreCreatorActivities] = useState(true);
  const [creatorActivities, setCreatorActivities] = useState<any[]>([]);
  const [selectedActivityId, setSelectedActivityId] = useState<string | null>(null);
   const [isModalVisible, setModalVisible] = useState(false);
  useEffect(() => {
    setActivities([]); 
    (async () => {
      try {
        const data = await fetchActivities({ typeId });
        setActivities(data);
      } catch (err) {
        console.error(err);
      }
    })();
  }, [typeId]);


  useEffect(() => {

    if (!hasMoreCreatorActivities) return;

    (async () => {
      try {
 
        if (creatorPage === 1) {
          setCreatorActivities([]);
        }

        const data = await fetchCreatorActivities(creatorPage, 999);
        const filtered = data.activities.filter(a => a.type === name);
        setCreatorActivities(prev => creatorPage === 1 
          ? filtered 
          : [...prev, ...filtered]
        );

        setHasMoreCreatorActivities(data.next !== null);
      } catch (err) {
        console.error('Erro ao carregar criadas:', err);
      }
    })();
  }, [typeId, creatorPage]);



  function handleCategoryPress(id: string, newName: string) {
    if (id === typeId) return;
    navigation.navigate('ActivityByType', { typeId: id, name: newName });
    setCreatorPage(1);
    setHasMoreCreatorActivities(true);
  }
  
  const handleActivityPress = (activityId: string) => {
    const selectedActivity = activities.find((activity) => activity.id === activityId);
    navigation.navigate('ActivityDetails', { activityData: selectedActivity, activityId });
  };

  return (
    <ScrollView contentContainerStyle={{ paddingBottom: 20 , padding: '5%'}}>
      <View style={styles.titleContainer}>
        <Title style={styles.title}>{name}</Title>
      </View>

      <Title style={styles.categoryTitle}>CATEGORIAS</Title>
      <View style={styles.categoryContainer}>
      <Category size={61} onPress={handleCategoryPress} selected={selectedCategories} /> 
      </View>

      <View>
       
        <ActivitySectionList
          title="SUAS ATIVIDADES"
          activities={creatorActivities}
          collapsible
          onActivityPress={handleActivityPress}
        />

        <ActivitySectionList
                  title="ATIVIDADES DA COMUNIDADE"
                  activities={activities}
                  onActivityPress={handleActivityPress}
                />
      </View>
      <GoBackArrow/>
    </ScrollView>
  );
}

export default ActivityByType;