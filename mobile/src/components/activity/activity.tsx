import React from 'react';
import { View, Image } from 'react-native';
import { styles } from './styles';
import CustomText from '../CustomText/CustomText';
import {  UsersThree, CalendarDots,LockSimple} from 'phosphor-react-native';
import { fixUrl } from '../../api/fixUrl';


interface ActivityProps {
  id: string;
  title: string;
  image: string;
  type: string;
  private: boolean;
  participantCount: number;
  scheduledDate: string;
}

const Activity = ({ title, image, private: isPrivate, participantCount, scheduledDate }: ActivityProps) => {
  return (
    <View style={styles.main}>
      <View style={{ position: 'relative' }}>
        <Image style={styles.image} source={{ uri: fixUrl(image) }} />
        {isPrivate &&<View style={styles.lockContainer}> <LockSimple color={'#fff'}  /></View>}
      </View>
      <CustomText style={styles.title}>{title}</CustomText>
      <View style={styles.container}>
        <CalendarDots style={styles.icon}  />
        <CustomText style={styles.text}>
          {new Date(scheduledDate).toLocaleDateString('pt-BR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
          })}
        </CustomText>
        <View style={styles.separator} />
        <UsersThree style={styles.icon} />
        <CustomText style={styles.text}>{participantCount}</CustomText>
      </View>
    </View>
  );
};

export default Activity;