import React, { Children, ReactNode, useState } from "react";
import {  Text, TextInputProps, View, ViewProps, TextInput, StyleProp, ViewStyle } from "react-native";
import {styles} from "./styles";

interface InputRootProps extends ViewProps {
      children: React.ReactNode;

    isError?: boolean;
}


function InputRoot({ children, isError, style, ...props }: InputRootProps) {

    return (
        <View
            {...props}
            style={style }
            
        >
            {
                React.Children.map(children, (child) => {
                    if (React.isValidElement(child)) {
                        return React.cloneElement(child, { ...props });                    }
                    return child;
                })
            }
        </View>
    )
}

interface InputLabelProps {
    children: ReactNode | null;
    required?: boolean;
    style?: any;
    isError?: boolean;
    
}

function InputLabel({ children, style, required = false, isError }: InputLabelProps) {
    return (
        <Text
            style={[
                styles.label,
                isError && { color: '#E7000B' },
                style
            ]}
        >
            {children} {required && <Text style={[styles.label, styles.required]}>*</Text>}
        </Text>
    )
}

interface InputProps extends TextInputProps {
    isError?: boolean;
}

function CustomInput({ style, isError, ...props }: InputProps) {

    const [isFocused, setIsFocused] = useState(false);

    return (
        <TextInput
            {...props}
            placeholderTextColor={isError ? '#E7000B' : "#A1A1A1"}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            style={[
                styles.input,
                isFocused && { borderColor: '#D4D4D4' },
                isError && { borderColor: '#E7000B' },
                style
            ]}
        />
    )
}

interface InputErrorMessageProps {
    children: ReactNode ;
    style?: StyleProp<ViewStyle>;
    isError?: boolean;
}

function InputErrorMessage({ children, style, isError }: InputErrorMessageProps) {
    return (
        <View
            style={style}
        >
            {
                isError && (
                    <Text style={[styles.label, styles.error]}>
                        {children}
                    </Text>
                )
            }
        </View>
    )
}


export const Input = {
    Root: InputRoot,
    Label: InputLabel,
    Input: CustomInput,
    ErrorMessage: InputErrorMessage
}

