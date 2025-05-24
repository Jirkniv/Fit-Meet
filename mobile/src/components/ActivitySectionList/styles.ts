import { StyleSheet } from 'react-native';
import { THEME } from '../../assets/THEME';
export const styles = StyleSheet.create({
  sectionContainer: {
   
  },
  sectionTitle: {

    fontSize: 28,
    marginBottom: 14,
    marginRight: 10,
  },
  sectionSeeMore:{
    marginRight: 15,
    color: THEME.COLORS.textBlack,
    fontFamily: THEME.FONTS.Bebas.regular
  },
  arrow: {
    width: 20,
    height: 20,
  },
  noMessage: { fontSize: 18, color: THEME.COLORS.danger },
  noMessageContainer:{ justifyContent: 'center', alignItems: 'center', }
  
});