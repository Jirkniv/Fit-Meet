import { StyleSheet } from "react-native";
import { THEME } from "../../assets/THEME";
const safePadding = '5%';
export const styles = StyleSheet.create({
    main: {
        justifyContent: 'center',
        width: '100%',
    },
    image:{
        width: 104,
        height: 104 ,
        alignSelf: 'center',
        borderRadius: 50
    },
    title: {
        marginTop: 16,
        fontWeight: 'bold',
        fontSize: 20,
        marginBottom: 14,
        marginRight: 0,
        alignSelf: 'center',
    },
    subTitle: {
      marginTop: 16,
      fontWeight: 'bold',
      alignSelf: 'center',
      fontSize: 18,
      marginBottom: 14,
  },
    container: {
      flexDirection: 'row',      
      alignItems: 'center', 
      justifyContent: 'center',     
      padding: safePadding,
      paddingTop: 0,
    },
    headerIcons: {
    flexDirection: 'row',
    position: 'absolute',
    top: 24,
    left: 160, 
    },
    safe: {
      padding: safePadding
    },
    header: {
      backgroundColor: THEME.COLORS.mainGreen,  
      borderBottomRightRadius: 20,
      borderBottomLeftRadius: 20,  
      alignItems: 'center',    
    },
    text: {
      fontSize: 12,
    },
    icon: {
        width: 20,
        height: 20,
        marginRight: 10},
    scroll: {
      backgroundColor: '#D9D9D9',
      marginTop: 20,
      borderRadius: 10,
      height: 200,
      overflow: 'hidden',
      alignSelf: 'center',
      width:'90%',
    },
    page: {
      justifyContent: 'center',
      alignItems: 'center',
      padding: 20,
    },
    historiço:{ 
      flexDirection:'row',
      alignItems: 'center' ,
      justifyContent: 'space-between',
      marginTop: 20},
    rowSpace: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      width: '90%',
    },
    iconSmall: {
      width: 20,
      height: 25,
      marginRight: 20
    },
    iconBig: {
      width: 110,
      height: 110,
    },
    iconLarge: {
      width: 152,
      height: 82,
    },
    label: {
      marginTop: 21,
      fontSize: 12,
    },
    value: {
      fontSize: 16,
      fontWeight: 'bold',
    },
    xpBarContainer: { 
      marginTop: 21,
      width: '80%',
    },
    xpBarTrack: {
      width: '100%',
      height: 8,
      backgroundColor: '#D9D9D9',
      borderRadius: 4,
      overflow: 'hidden',
      borderWidth: 1,
    },
    xpBarFill: {
      height: '100%',
      backgroundColor: '#4A90E2',
    },
    medalBox: {
      flex: 1,
      flexDirection: 'column',
      alignItems: 'center',
      marginHorizontal: 5,
    },
    medalText: {
      marginTop: 4,
      fontSize: 12,
      textAlign: 'center',
      flexWrap: 'wrap',
    },
    
  });