import React, { ReactNode } from "react";
import {  Text, TouchableOpacity, TouchableOpacityProps } from "react-native";
import {styles} from "./styles";

interface ButtonRootProps extends TouchableOpacityProps {
    children: React.ReactElement<ButtonLabelProps> | React.ReactElement<ButtonLabelProps>[];
    type?: 'default' | 'outline' | 'ghost';

}

function ButtonRoot({ type = 'default', children, style, ...props }: ButtonRootProps) {

    const typeStyles = {
        default: styles.default,
        outline: styles.outline,
        ghost: styles.ghost,
    }

    return (
        <TouchableOpacity
            {...props}
            style={[
                typeStyles[type],
                style,
            ]}
        >

            {
                React.Children.map(children, (child) => {
                    if (React.isValidElement(child)) {
                        return React.cloneElement(child, { type })
                    }
                    return child;
                })
            }
        </TouchableOpacity>
    )
}


interface ButtonLabelProps {
    children: ReactNode;
    type?: 'default' | 'outline' | 'ghost';
}

function ButtonLabel({ children, type = 'default' }: ButtonLabelProps) {
    const typeStyles = {
        default: styles.defaultLabel,
        outline: styles.outlineLabel,
        ghost: styles.ghostLabel,
    }
    return (
        <Text
            style={[styles.label, typeStyles[type]]}
        >
            {children}
        </Text>
    )
}


export const Button = {
    Root: ButtonRoot,
    Label: ButtonLabel,
}

