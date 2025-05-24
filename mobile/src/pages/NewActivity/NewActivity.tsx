import React from 'react';
import { View, ScrollView } from 'react-native';
import Title from '../../components/Title/Title.tsx';
import ActivityForm from '../../components/ActivityForm/activityForm.tsx';
import { styles } from './styles.ts';
import { useTypedNavigation } from '../../hooks/useTypedNavigation.ts';
import { GoBackArrow } from '../../components/GoBackArrow/GoBackArrow.tsx';
export default function NewActivity() {
  const navigation = useTypedNavigation(); 

  return (
    <View style={styles.container}>

     
        <View style={styles.backdrop}>
          <ScrollView contentContainerStyle={styles.modalContent}>
          <GoBackArrow/> 
            <View style={styles.modalBox}>
               <View style={styles.header}>   
                <Title>CADASTRAR ATIVIDADE</Title>
              </View>
                <ActivityForm
                onSuccess={() => {
              
                  navigation.navigate('Home', {params: { reload: true } }as any); }}  />
            </View>
          </ScrollView>
        </View>
    
    </View>
  );
}