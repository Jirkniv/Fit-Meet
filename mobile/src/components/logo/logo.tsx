import React from 'react'
import { View, Image, ViewProps } from 'react-native'
import { styles } from './styles.ts';

interface LogoProps extends ViewProps {
  
}

const logo = () => {
  const image = require('../../assets/images/Logo.png');
  return (
    <View style={styles.logo}> 
     <Image
          source={image}
          style={styles.image}
        />
    
     </View>
  )
}

export default logo
