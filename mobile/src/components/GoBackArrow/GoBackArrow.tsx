 
 import React from 'react'
 import {  TouchableOpacity } from 'react-native'
 import { useTypedNavigation } from '../../hooks/useTypedNavigation'
 import { styles } from './styles'
 import { CaretLeft} from 'phosphor-react-native';
 export const GoBackArrow = () => {
   const navigation = useTypedNavigation()
   return (
     <TouchableOpacity style={styles.imageContainer} onPress={() => navigation.goBack()}>
       <CaretLeft style={styles.image}  size={40} weight="bold" />
     </TouchableOpacity>
   )
 }
 