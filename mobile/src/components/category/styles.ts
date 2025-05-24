import { StyleSheet } from "react-native";
import { THEME } from "../../assets/THEME";
const safePadding = '5%';
export const styles = StyleSheet.create({
  main: {
    padding: safePadding,
    justifyContent: 'center',
    width: '100%',
    marginRight: -25
 
  },
  image: {
    width: '100%',
    alignSelf: 'center',
    borderRadius: 57,
  },
  text: {
    fontSize: 16,
    fontFamily: THEME.FONTS.DMSans.semiBold,
    marginTop: 9,
    alignSelf: 'center',
  },
});