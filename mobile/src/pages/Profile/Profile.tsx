// filepath: [Profile.tsx](http://_vscodecontentref_/4)
import React, { useEffect, useState } from 'react';
import { View, Image, TouchableOpacity, Text, Dimensions, ActivityIndicator, FlatList, ScrollView } from 'react-native';
import useAppContext from '../../hooks/useAppContext';
import ActivitySectionList from '../../components/ActivitySectionList/ActivitySectionList.tsx';
import { styles } from './styles';
import { useTypedNavigation } from '../../hooks/useTypedNavigation';
import { fetchCreatorActivities, fetchParticipantActivities } from '../../service/service.ts';
import Title from '../../components/Title/Title.tsx';
import {GoBackArrow} from '../../components/GoBackArrow/GoBackArrow.tsx';
import {  NotePencil, SignOut, MedalMilitary } from 'phosphor-react-native';
import { fixUrl } from '../../api/fixUrl.ts';

const Profile = () => {
  const navigation = useTypedNavigation();
  const { auth: { user, logout }, getUser } = useAppContext();
  const [loading, setLoading] = useState(true);
  const { width: SCREEN_WIDTH } = Dimensions.get('window');
  const [creatorActivities, setCreatorActivities] = useState<any[]>([]);
  const [participantActivities, setParticipantActivities] = useState<any[]>([]);
  const [creatorPage, setCreatorPage] = useState(1);
  const [participantPage, setParticipantPage] = useState(1);[]
  const progress = Math.min(user.xp / 1000, 1);
  const fillWidth = `${progress * 100}%`;
  
  const loadCreatorActivities = async () => {
    try {
      const data = await fetchCreatorActivities(creatorPage, 999);
      setCreatorActivities((prev) => {
        const uniqueActivities = [...prev, ...data.activities].filter(
          (activity, index, self) =>
            index === self.findIndex((a) => a.id === activity.id)
        );
        return uniqueActivities;
      });
    } catch (error) {
      console.error('Erro ao carregar atividades criadas:', error);
    }
  };

  const loadParticipantActivities = async () => {
    try {
      const data = await fetchParticipantActivities(participantPage, 999);
      setParticipantActivities((prev) => {
        const uniqueActivities = [...prev, ...data.activities].filter(
          (activity, index, self) =>
            index === self.findIndex((a) => a.id === activity.id)
        );
        return uniqueActivities;
      });
    } catch (error) {
      console.error('Erro ao carregar atividades inscritas:', error);
    }
  };

  useEffect(() => {
    loadCreatorActivities();
  }, [creatorPage]);

  useEffect(() => {
    loadParticipantActivities();
  }, [participantPage]);

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

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#00BC7D" />
      </View>
    );
  }

  const handleActivityPress = (activityId: string) => {
    const selectedActivity =
      creatorActivities.find((activity) => activity.id === activityId) ||
      participantActivities.find((activity) => activity.id === activityId);

    if (selectedActivity) {
      navigation.navigate('ActivityDetails', {
        activityData: selectedActivity,
        activityId,
      });
    }
  };

  
  const groupAchievements = () => {
    const achievements = user?.achievements || [];
    const grouped = [];
    for (let i = 0; i < achievements.length; i += 2) {
      grouped.push(achievements.slice(i, i + 2));
    }
    return grouped;
  };

  const renderPage = ({ item, index }: { item: any; index: number }) => {
    if (index === 0) {
      return (
        <View style={[styles.page, { width: SCREEN_WIDTH*0.90 }]}>
          <View style={styles.rowSpace}>
            <View>
              <MedalMilitary style={styles.iconSmall} />
              <Text style={styles.label}>Seu nível é</Text>
              <Text style={styles.value}>{user?.level}</Text>
            </View>
            <Image style={styles.iconLarge} source={require('../../assets/images/trophies.png')} />
          </View>

          <View style={styles.xpBarContainer}>
  <Text style={[styles.label, { marginBottom: 8 }]}>
    Pontos para o próximo nível{' '}
    <Text style={{ fontWeight: 'bold' }}>
      {user?.xp}/1000 pts
    </Text>
  </Text>

  <View style={styles.xpBarTrack}>
  <View style={[styles.xpBarFill, { width: parseInt(fillWidth) / 100 }]} />  </View>
</View>
        </View>
      );
    }

  
    return (
      <View style={[styles.page, { width: SCREEN_WIDTH }]}>
        <View style={styles.rowSpace}>
          {item.map((achievement: any, idx: number) => (
            <View key={idx} style={styles.medalBox}>
              <Image style={styles.iconBig} source={require('../../assets/images/medal.png')} />
              <Text style={styles.medalText} numberOfLines={2} ellipsizeMode="tail">
                {achievement.name}
              </Text>
            </View>
          ))}
        </View>
      </View>
    );
  };

  return (
    <View style={styles.main}>
      <ScrollView>
        <View style={styles.header}>
          <View style={styles.container}>
            <Title style={styles.title}>PERFIL</Title>
            <View style={styles.headerIcons}>
              <TouchableOpacity onPress={() => navigation.navigate('EditProfile')}>
                <NotePencil style={styles.icon}  />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => { logout && logout(), navigation.navigate('Login'); }}>
                <SignOut style={styles.icon} />
              </TouchableOpacity>
            </View>
          </View>
          <Image source={{ uri: fixUrl(user.avatar) }} style={[styles.image]} />
          <Title style={styles.subTitle}>{user?.name}</Title>
        </View>
        <FlatList
          data={[{}, ...groupAchievements()]} 
          keyExtractor={(_, index) => `page-${index}`}
          renderItem={renderPage}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          style={styles.scroll}
        />
        <View style={styles.safe}>
          <ActivitySectionList
            title="SUAS ATIVIDADES"
            activities={creatorActivities}
            collapsible
            onActivityPress={handleActivityPress}
          />
          <ActivitySectionList
            title="HISTÓRICO DE ATIVIDADES"
            activities={participantActivities}
            onActivityPress={handleActivityPress}
          />
        </View>
        <GoBackArrow/>
      </ScrollView>
    </View>
  );
};

export default Profile;