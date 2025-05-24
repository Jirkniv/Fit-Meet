import { StyleSheet, TextComponent } from "react-native";
import { THEME } from "../../assets/THEME";

export const styles = StyleSheet.create({
    label: {
        fontFamily: 'DMSans-SemiBold',
        fontSize: 16,
        color: '#404040',
        lineHeight: 20
    },
    required: {
        color: '#E7000B'
    },
    input: {
        marginTop: 6,
        width: '100%',
        height: 56,
        justifyContent: 'center',
        fontFamily: 'DMSans-Regular',
        fontSize: 16,
        lineHeight: 24,
        borderRadius: 8,
        color: THEME.COLORS.textBlack,
        paddingLeft: 20,
        marginBottom: 13,
        borderWidth: 1,
        borderColor: THEME.COLORS.placeholderGray,  
    },
    error: {
        color: THEME.COLORS.danger,
    }
})