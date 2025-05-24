import React, { useState } from 'react';
import { View, Text, TouchableOpacity, FlatList ,} from 'react-native';
import { styles } from './styles'; 
import Activity from '../activity/activity';
import { useTypedNavigation } from '../../hooks/useTypedNavigation';
import Title from '../Title/Title';
 import { CaretLeft, CaretDown} from 'phosphor-react-native';


interface ActivitySectionListProps {
  title: string;
  activities: any[];
  showSeeMore?: boolean;
  collapsible?: boolean;
  categoryPressData?: { typeId: string; name: string };
  onActivityPress: (activityId: string) => void;
}

export default function ActivitySectionList({
  title,
  activities,
  showSeeMore = false,
  collapsible = false,
  categoryPressData,
  onActivityPress,
}: ActivitySectionListProps) {
  const [collapsed, setCollapsed] = useState(collapsible);
  const navigation = useTypedNavigation();

  const renderActivityPair = ({ item }: { item: any[] }) => (
    <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 10 }}>
      {item.map((activity) => (
        <TouchableOpacity key={activity.id} onPress={() => onActivityPress(activity.id)} style={{ flex: 1, paddingHorizontal: 5 }}>
          <Activity {...activity} />
        </TouchableOpacity>
      ))}
    </View>
  );

  
  const NoActivitiesMessage = () => (
    <View style={styles.noMessageContainer}>
      <Text style={styles.noMessage}>
        Nenhuma atividade encontrada.
      </Text>
    </View>
  );

  // Agrupa atividades de 2 em 2
  const groupActivities = () => {
    if (activities.length === 0) return [];

    const grouped = [];
    for (let i = 0; i < activities.length + 1; i += 1) {
      grouped.push(activities.slice(i, i + 1));
    }
    return grouped;
  };
  const getSectionHeight = () => {
    if (collapsed) return 53;
    if (activities.length === 0) return 100;
    if (activities.length === 1) return 310;
    return 605;
  };
  

  
  return (
    <View style={[styles.sectionContainer, { height: getSectionHeight() }]}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
        <Title style={styles.sectionTitle}>{title}</Title>
        {showSeeMore && categoryPressData && (
         <TouchableOpacity
         onPress={() => {
           if (categoryPressData) {
             const { typeId, name } = categoryPressData;
             navigation.navigate('ActivityByType', { typeId, name });
           } else {
            
             navigation.navigate('ActivityByType', { typeId: 'default', name: 'Atividades' });
           }
         }}
       >
         <Text style={styles.sectionSeeMore}>Ver mais</Text>
       </TouchableOpacity>
        )}
        {collapsible && (
          <TouchableOpacity onPress={() => setCollapsed(!collapsed)}>

{collapsed ? <CaretLeft style={styles.arrow}  size={24} weight="bold"/> :  <CaretDown size={24} weight="bold" style={styles.arrow}/>}
         
          </TouchableOpacity>
        )}
      </View>
      {!collapsed && (
        <FlatList
          data={groupActivities()}
          keyExtractor={(_, index) => `activity-group-${index}`}
          renderItem={renderActivityPair}
          showsVerticalScrollIndicator={false}
          nestedScrollEnabled
          pagingEnabled
          ListEmptyComponent={<NoActivitiesMessage/>}
        />
      )}
      
    </View>
  );
}
