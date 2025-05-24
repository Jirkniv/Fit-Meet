import { THEME } from '../../assets/THEME';
import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    text: {
        fontSize: 12,
        lineHeight: 16,
        color: THEME.COLORS.textGray,
        fontFamily: THEME.FONTS.DMSans.regular,

    },
    boldText: {
        fontFamily: 'DMSans-Bold',
        color: THEME.COLORS.textBlack
    },
});