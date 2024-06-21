import { View, StyleSheet, TextInput, Text } from 'react-native'
import React from 'react'
import {MaterialCommunityIcons} from '@expo/vector-icons'

import appStyles from '../config/appStyles'
import { useTheme } from '../utils/ThemeContext'

const AppInput = ({color, icon, size = 30,label,onPress,style, ...otherProps }) => {
    const {theme} = useTheme()
    color = color || theme?.amberGlow
  return (

    <View style={styles.inputContainer}>
        {label && <Text style={[styles.text, {color: theme?.text}]}>{label}</Text>}
        <View style={[styles.inputBox, {borderColor: theme?.amberGlow}]}>
            <TextInput style={[appStyles.text, styles.input, style, {color: theme?.amberGlow}]} {...otherProps} />
            {icon && <MaterialCommunityIcons name={icon} size={size} color={color} onPress={onPress} />}
        </View>
    </View>

  )
}

const styles = StyleSheet.create({
    input: {
        width: '100%',
        height: "100%",
        fontSize: 16,
        fontWeight: 'bold',
        textTransform: 'uppercase',
        flex: 1,

    },
    inputBox: {
        backgroundColor: "transparent",
        flexDirection: 'row',
        alignItems: 'center',
        width: '100%',
        marginBottom: 5,
        paddingHorizontal: 15,
        gap: 5,
        width: '90%',
        height: 50,
        marginHorizontal: "auto",
        borderRadius: 5,
        borderWidth: 1,

    },
    inputContainer: {
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center',
        paddingBottom: 5,
    },
    text: {
        fontSize: 14,
        textAlign: 'left',
        fontWeight: 'bold',
        textTransform: 'uppercase',
        width: '90%',
        marginBottom: 5,
        marginHorizontal: "auto",
    }

})
export default AppInput