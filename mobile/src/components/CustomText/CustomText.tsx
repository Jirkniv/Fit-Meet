import {  TextProps, Text } from 'react-native';
import { styles } from './styles';

interface CustomTextProps extends TextProps {
    fontSize?: number;
    lineHeight?: number;
}

export default function CustomText({ children, fontSize, lineHeight, style, ...props }: CustomTextProps) {
    return (
        <Text
            {...props}
            style={[
                styles.text,
                fontSize ? { fontSize: fontSize } : { fontSize: 16 },
                lineHeight ? { lineHeight: lineHeight } : { lineHeight: 24 },
                style
            ]}
        >
            {children}
        </Text>
    );
}

