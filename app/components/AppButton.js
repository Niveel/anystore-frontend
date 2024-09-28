import { Text, TouchableHighlight, StyleSheet } from 'react-native'
import React from 'react'

import { useTheme } from '../utils/ThemeContext'

const AppButton = ({title="button", textColor, color, textStyle, onPress, width = "100%",height=55, style, ...otherProps}) => {
    const {theme} = useTheme()
    color = color || theme?.horizon
    textColor = textColor || theme?.text
  return (
    <TouchableHighlight onPress={onPress} style={[styles.button, {backgroundColor: color, width: width, height: height}, style]} underlayColor={theme?.light} {...otherProps}>
        <Text style={[styles.text, textStyle, {color: textColor}]}>{title}</Text>
    </TouchableHighlight>
  )
}

const styles = StyleSheet.create({
    button: {
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
    },
    text: {
        fontSize: 16,
        textAlign: 'center',
        fontWeight: 'bold',
        textTransform: 'uppercase'
    }
})
export default AppButton