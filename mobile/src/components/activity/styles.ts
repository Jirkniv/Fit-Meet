import { StyleSheet } from "react-native";
import { THEME } from "../../assets/THEME";
const safePadding = '5%';
export const styles = StyleSheet.create({
    main: {
        padding: safePadding,
        justifyContent: 'center',
        width: '100%',
    },
    image:{
        width: 300,
        height: 160 ,
        alignSelf: 'center',
        borderRadius: 10,
    },
    title: {
        marginTop: 16,
        fontFamily: THEME.FONTS.DMSans.semiBold,
        fontSize: 16,
        marginBottom: 14,
    },
    lockContainer:{
        position: 'absolute',
        top: 10,
        left: 10 ,
        width: 34,
        height: 28,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: THEME.COLORS.mainGreen,
        borderRadius: '50%',
    },
    lock: {
      color: 'white',
    },
    container: {
      flexDirection: 'row',      
      alignItems: 'center',      
    },
    text: {
      fontSize: 12,
    },
    separator: {
      width: 1,                  
      height: 12,                
      backgroundColor: '#000',   
      marginHorizontal: 10,      
    },
    icon: {
        width: 20,
        height: 20,
        marginRight: 10,
        color: THEME.COLORS.mainGreen
      },
    
  })
