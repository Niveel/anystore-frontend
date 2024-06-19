import { Text, TouchableHighlight, StyleSheet } from 'react-native'
import React from 'react'

import { useTheme } from '../utils/ThemeContext'

const AppButton = ({title, color, textStyle, onPress, width = "100%", style, ...otherProps}) => {
    const {theme} = useTheme()
    color = color || theme?.misty
  return (
    <TouchableHighlight onPress={onPress} style={[styles.button, {backgroundColor: color, width: width}, style]} underlayColor={theme?.light} {...otherProps}>
        <Text style={[styles.text, textStyle, {color: theme?.text}]}>{title}</Text>
    </TouchableHighlight>
  )
}

const styles = StyleSheet.create({
    button: {
        width: '100%',
        height: 55,
        borderRadius: 35,
        justifyContent: 'center',
        alignItems: 'center',
    },
    text: {
        fontSize: 18,
        textAlign: 'center',
        fontWeight: 'bold',
        textTransform: 'uppercase'
    }
})
export default AppButton