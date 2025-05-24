import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
    container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    backdrop: {
      flex: 1,
      backgroundColor: 'rgba(0,0,0,0.5)',
      justifyContent: 'center',
      alignItems: 'center',
    },
    modalContent: {
      flexGrow: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    modalBox: {
      width: '100%',
      height: '100%',
      padding: 20,
      backgroundColor: '#fff',
      borderRadius: 8,
      
    },
    modalHeader: {
      alignItems: 'flex-start',
      justifyContent: 'center',
      marginTop: 10,
      flexDirection: 'row',
    },
    exitButton: {
      position: 'absolute',
      top: 8,
      left: -80,
      height: 20,
      width: 15,
    },
    imageInput: {
      backgroundColor: '#D9D9D9',
      width: 305,
      height: 205,
      borderRadius: 20,
      justifyContent: 'center',
      alignItems: 'center',
    },
    editButton: {
      width: 30,
      height: 30,
     
    }
  });
  