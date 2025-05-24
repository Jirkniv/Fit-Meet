import React, { useState,  } from 'react';
import {  View, ScrollView, ActivityIndicator } from 'react-native';
import Title from '../../components/Title/Title';
import ActivityForm from '../../components/ActivityForm/activityForm';
import { styles } from './styles';
import { useTypedNavigation } from '../../hooks/useTypedNavigation';
import { MainStackParamList } from '../../routes/AppRoutes';
import { useRoute, RouteProp } from '@react-navigation/native';
import { GoBackArrow } from '../../components/GoBackArrow/GoBackArrow';
interface Props {
  activityId: string;
  
}
interface ActivityDetailsRouteProp extends RouteProp<MainStackParamList, 'ActivityDetails'> {}
export default function EditActivity() {
   const route = useRoute<ActivityDetailsRouteProp>();
   const {  activityId } = route.params;
  const [loading, setLoading] = useState(false);
  const navigation = useTypedNavigation();
  console.log(activityId, "activityId Edit" );
  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#00BC7D" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
        <View style={styles.backdrop}>
          <ScrollView contentContainerStyle={styles.modalContent}>
            <View style={styles.modalBox}>
              <View style={styles.modalHeader}>
                <Title>EDITAR ATIVIDADE</Title>
              </View>
              <ActivityForm
                activityId={activityId}
                 onSuccess={() => { 
                  navigation.goBack()
                }}
              />
            </View> 
            <GoBackArrow/>
          </ScrollView>
        </View>
       
    </View>
  );
}
