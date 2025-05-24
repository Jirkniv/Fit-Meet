import React from 'react'
import { View, Text , Image} from 'react-native'
import { styles } from './styles.ts';
import { fixUrl } from '../../api/fixUrl.ts';
interface AvatarProps {
  name: string,
  avatar: string,
  id: string,
  organizer?: boolean
}

const avatar = ({name,avatar,id,organizer} : AvatarProps ) => {


  return (
    <View style={styles.container}>
      <Image style={styles.avatar} source={{ uri: fixUrl(avatar) }}/>
      <View>
          <Text style={styles.name}>{name}</Text>
              {organizer &&  <Text style={styles.organizador}>Organizador</Text>}
      </View>
    </View>
  )
}

export default avatar
