import { StyleSheet } from "react-native";
import { THEME } from "../../assets/THEME";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#FFFFFF',
  },
  image: {
    width: '100%',
    height: 200,
    marginVertical: 15,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 10,
    color: '#333333',
  },
  visibilityContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 10,
  },
  visibilityButton: {
    flex: 1,
    padding: 10,
    marginHorizontal: 5,
    borderWidth: 1,
    borderColor: '#CCCCCC',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',backgroundColor: THEME.COLORS.backGrayButton,
  
  },
  selectedButton: {
     backgroundColor: THEME.COLORS.textBlack,

  },
  mapContainer: {
    gap: 10,
    marginVertical: 10,
  },
footerButtons:{
    marginTop: 16,
    marginBottom: 18,
    width: '80%',
    height: 44,
    alignSelf: 'center',
  },
 

});