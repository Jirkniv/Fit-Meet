import { StyleSheet } from "react-native";
import { THEME } from "../../assets/THEME";

export const styles = StyleSheet.create({
  default:{
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: 4,
      backgroundColor: THEME.COLORS.mainGreen,
  },
  outline:{
      borderRadius: 4,
      alignItems: 'center',
      justifyContent: 'center',
      borderWidth: 1,
      borderColor: THEME.COLORS.textGray,
      backgroundColor: 'white'
  },
  ghost:{
      borderRadius: 4,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: 'transparent'
  },
  defaultLabel:{
      color: '#FFFFFF',
  },
  outlineLabel:{
      color: THEME.COLORS.textGray,
  },
  ghostLabel:{
      color: THEME.COLORS.textBlack,
  },
  label:{
      fontFamily: THEME.FONTS.DMSans.bold,
      fontSize: 16,
      lineHeight: 24,
  },
});