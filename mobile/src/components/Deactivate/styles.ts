import { StyleSheet } from "react-native";
export const styles = StyleSheet.create({
    triggerButton: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: 12,
      borderRadius: 8,
      backgroundColor: '#fff',
      alignSelf: 'center',
      width: 250,
      justifyContent: 'center',
    },
    modalContent: {
      backgroundColor: '#fff',
      padding: 20,
      borderRadius: 12,
      height: 320,
      width: 300,
      borderWidth: 1,
      borderColor: '#333',
      alignItems: 'center',
      alignSelf: 'center',
      marginTop: 100,
    },
    title: {
      textAlign: 'center',
      fontWeight: 'bold',
      fontSize: 16,
      marginBottom: 10,
    },
    paragraph: {
      marginBottom: 6,
      textAlign: 'left',
      fontSize: 14,
    },
    bold: {
      fontWeight: 'bold',
    },
    buttonRow: {
      flexDirection: 'row',
      justifyContent: 'flex-end',
      marginTop: 20,
      gap: 10,
    },
    cancelButton: {
      padding: 10,
      borderColor: '#000',
      borderWidth: 1,
      borderRadius: 8,
      
    },
    cancelText: {
      color: '#fff',
    },
    confirmButton: {
      backgroundColor: '#d11a2a',
      padding: 10,
      borderRadius: 8,
    },
    confirmText: {
      color: '#fff',
      fontWeight: 'bold',
    },
  });
  