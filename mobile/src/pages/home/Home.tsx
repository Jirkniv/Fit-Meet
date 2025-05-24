import React, { useState, useEffect } from 'react';
import { Text, View, Image, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';

import Category from '../../components/category/categoty';
import { styles } from './styles';
import useAppContext from '../../hooks/useAppContext';
import { useTypedNavigation } from '../../hooks/useTypedNavigation';
import { fetchActivities } from '../../service/service';
import { getUserPreferences } from '../../service/service';
import PreferencesModal from '../Preferences/Preferences';
import ActivitySectionList from '../../components/ActivitySectionList/ActivitySectionList';
import { Plus} from 'phosphor-react-native';
import Title from '../../components/Title/Title';
import { fixUrl } from '../../api/fixUrl';


function Home(): React.JSX.Element {
  const [activities, setActivities] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigation = useTypedNavigation();
  const star = require('../../assets/images/star.png');
  const { auth: { user },  getUser } = useAppContext();
  const [preferences, setPreferences] = useState<string[]>([]);
  const [showPreferences, setShowPreferences] = useState(false);
  const { auth } = useAppContext();

  useEffect(() => {
    const checkPreferences = async () => {
      try {
        const preferences = await getUserPreferences();
        if (!preferences.length) {
          setShowPreferences(true);
        } else {
          setPreferences(preferences);
        }
      } catch (error) {
        console.error('Erro ao verificar preferências:', error);
      }
    };

    checkPreferences();
  }, []);


  useEffect(() => {
    const loadActivities = async () => {
      try {
        const activitiesArray =
        preferences.length > 0
          ? await fetchActivities({ typeId: preferences[0] })
          : await fetchActivities();
        setActivities(activitiesArray);   
        console.log(activitiesArray)     
      } catch (err: any) {
        setError('Erro ao carregar atividades');
        console.error('Erro ao buscar atividades:', err.message);
      } finally {
        setLoading(false);
      }
    };
  
    loadActivities();
  }, []);
  

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        await getUser();
      } catch (error) {
        console.error('Erro ao carregar dados do usuário:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [getUser]);
 
 
  const handleActivityPress = (activityId: string) => {
    const selectedActivity = activities.find((activity) => activity.id === activityId);
    navigation.navigate('ActivityDetails', { activityData: selectedActivity, activityId });
  };


  const handleCategoryPress = (typeId: string, name: string) => {
    navigation.navigate('ActivityByType', { typeId, name });
  };

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#00BC7D" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>{error}</Text>
      </View>
    );
  }


  return (
    <View>
     {!loading && !auth.hasSkippedPreferences && (
  <PreferencesModal
    visible={showPreferences}
    onClose={() => setShowPreferences(false)}
    canSkip={true}
    onPreferencesChange={setPreferences}
  />
)}
      <ScrollView contentContainerStyle={{ paddingBottom: 20 }}>
        <View style={styles.header}>
          <View>
            <Text style={styles.headerText}> Olá, Seja Bem-Vindo </Text>
            
            <Text style={styles.headerTitle}>{user.name} !</Text>
          </View>
          <View style={styles.headerRight}>
            <View style={styles.scoreContainer}>
              <Image style={styles.scoreIcon} source={star} />
              <Text style={styles.headerText}>{user.level}</Text>
            </View>
            <TouchableOpacity onPress={() => navigation.navigate('Profile')}>
              <Image style={styles.avatar} source={{ uri:fixUrl(user.avatar) }} />
            </TouchableOpacity>
          </View>
        </View>
        
        <View style={styles.sectionContainer}>
        <ActivitySectionList
  title="SUAS RECOMENDAÇÕES"
  activities={activities}
  showSeeMore
  categoryPressData={
    (() => {
      if (preferences.length && activities.length) {
        const preferredTypeId = preferences.find((prefId) =>
          activities.some((a) => a.type?.id === prefId)
        );
        const matchedActivity = activities.find(
          (a) => a.type?.id === preferredTypeId
        );
        if (matchedActivity?.type) {
          return {
            typeId: matchedActivity.type.id,
            name: matchedActivity.type.name,
          };
        }
      }
     
      if (activities.length && activities[0].type) {
        return {
          typeId: activities[0].type.id,
          name: activities[0].type.name,
        };
      }
      
      return { typeId: 'default', name: 'Atividades' };
    })()
  }
  onActivityPress={handleActivityPress}
/>

            <View style={styles.categoryContainer}>
              <Title style={styles.sectionTitle}>CATEGORIAS</Title>
              <Category onPress={handleCategoryPress} size={61} />
          </View>
        </View>
      </ScrollView>

      <TouchableOpacity
        style={styles.createActivity}
        onPress={() => navigation.navigate('NewActivity')}
      >
        <Plus
          size={30}
          style={styles.createActivityImage}
        />
      </TouchableOpacity>
    </View>
  );
}

export default Home;