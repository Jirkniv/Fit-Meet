import React from 'react';
import { View, Image, TouchableOpacity, ActivityIndicator ,Text} from 'react-native';
import { styles } from './styles';
import { useActivityTypeContext } from '../../context/ActivityTypeContext.tsx';
import CustomText from '../CustomText/CustomText';
import { fixUrl } from '../../api/fixUrl';

interface CategoryProps {
  size: number;
  onPress: (typeId: string, name: string) => void;
  selected?: string[]; 
  pref?: boolean
}

function Category({ size, onPress, selected   = [],  pref }: CategoryProps): React.JSX.Element {
  const { activityTypes, loading , error} = useActivityTypeContext();

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="small" color="#00BC7D" />
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
    <View style={[styles.main, { flexDirection: 'row', ...(pref! && { flexWrap: 'wrap' })}]}>
      {activityTypes.map((category) => {
        const isSelected = selected.includes(category.id);

        return (
          <TouchableOpacity
            key={category.id}
            onPress={() => onPress(category.id, category.name)}
            style={{ width: '32%', alignItems: 'center' , ...(pref! && { width: '50%' }) }}
          >
            <Image
              source={{ uri: fixUrl(category.image) }}
              style={[
                styles.image,
                { width: size, height: size },
                isSelected && { borderWidth: 4, borderColor: '#00BC7D', borderRadius: 57 },
              ]}
            />
            <CustomText style={styles.text}>{category.name}</CustomText>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

export default Category;
