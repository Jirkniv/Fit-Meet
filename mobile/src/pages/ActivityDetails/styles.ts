import { StyleSheet } from "react-native";
import { THEME } from "../../assets/THEME";
export const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fff',
    },
    backdrop: {
      flex: 1,
      backgroundColor: '#fff', 
    },
    modalContent: {
      flexGrow: 1,
    },
    modalBox: {
      flex: 1,
      backgroundColor: '#fff',
    },
    exitButtonWrapper: {
      position: 'absolute',
      top: 40,
      left: 20,
      zIndex: 1,
    },
    exitButton: {
      height: 30,
      width: 30,
    },
    inputCode:{
      width: '100%',
      fontSize: 16,
      textAlign: 'center',
      fontWeight: 'bold',
    },
    inputInput: {
      height: 44,
      borderWidth: 1,
      borderRadius: 8,
      paddingHorizontal: 10,
      width: '100%',
      marginBottom: 10,
    },
    confirmButton: {
      marginTop: 10,
      padding: 10,
      borderRadius: 8,
      width: '85%',
      alignSelf: 'center',
    },
    content:{
      padding: '5%'
    },
    modalHeader: {
      alignItems: 'center',
    },
  
    image: {
      width: '100%',
      height: 170,
      alignSelf: 'center',
    },
    datas: {
      backgroundColor: '#fff',
      width: '80%',
      justifyContent: 'center',
      borderTopLeftRadius: 10,
      padding:15,
      borderTopRightRadius: 10,
      flexDirection: 'row',
      alignItems: 'center',
      marginTop: -30,
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
      color: THEME.COLORS.mainGreen,
    },
    codeBox:{
      backgroundColor: '#69696910',
      padding: 15,
      borderRadius: 10,
      alignSelf: 'center',
      height: 'auto',
      width:'90%',
      justifyContent:'space-evenly'
    },
    codeTitle: {
     fontWeight: 'semibold',
    },
    codeText: {
      fontSize: 12,
      textAlign: 'center',
      marginTop: 10
    },
    titleContainer:{
      width: '100%',
      justifyContent: 'flex-start',
      gap: 10,
    },
    mapContainer: {
      width: '100%',
      justifyContent: 'center',
      alignSelf: 'center',
      marginTop: 5
    },
    map: {
      width: 275,
      height: 200,  
      alignSelf: 'center',
      
    },
    participantsContainer: {
      width: '100%',
      justifyContent: 'flex-start',
      gap: 10,
      flexDirection: 'row',
    },
    buttons:{
      flexDirection: 'row',
      width: '30%',
      justifyContent: 'space-between',
      marginTop: 5
      },
    button: {
        width: 250,
        margin: 'auto'
    },
    buttonContainer: {
      alignItems: 'center',
      marginTop: 20,
    },
    primaryButton: {
      backgroundColor: '#00BC7D',
      padding: 12,
      borderRadius: 8,
      width: 321,
      alignItems: 'center',
      marginVertical: 8,
    },
    dangerButton: {
      backgroundColor: '#E7000B',
      padding: 12,
      borderRadius: 8,
      width: '80%',
      alignItems: 'center',
      marginVertical: 8,
    },
    infoText: {
      fontSize: 14,
      textAlign: 'center',
      marginBottom: 10,
    },
    input: {
      height: 44,
      borderColor: '#E5E7EB',
      borderWidth: 1,
      borderRadius: 8,
      paddingHorizontal: 10,
      width: '80%',
      marginBottom: 10,
    },
    editButton: {
      width: 30,
      height: 30,
      
    },
    noParticipantsContainer: {
      justifyContent: 'center',
      alignItems: 'center',
      marginTop: 20,
    },
    noParticipantsText: {
      fontSize: 16,
      color: '#888',
    },
  
    
  });
