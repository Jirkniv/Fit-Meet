import { StyleSheet } from "react-native";
import { THEME } from "../../assets/THEME";

export const styles = StyleSheet.create({
    container: {
         marginTop: 10 
     } ,
      input:{
        width: '100%',
        height: 57,
        justifyContent: 'center',
        backgroundColor: 'white',
        borderWidth: 1,
        borderColor: THEME.COLORS.placeholderGray ,
        borderRadius: 8,
        paddingLeft: 10,
      }
});