import { View, StyleSheet, TextInput, Text } from 'react-native'
import React from 'react'
import {MaterialCommunityIcons} from '@expo/vector-icons'

import colors from '../config/colors'
import appStyles from '../config/appStyles'

const AppInput = ({color = colors.amberGlow, icon, size = 30,label,onPress,style, ...otherProps }) => {
  return (

    <View style={styles.inputContainer}>
        {label && <Text style={styles.text}>{label}</Text>}
        <View style={styles.inputBox}>
            <TextInput style={[appStyles.text, styles.input, style]} {...otherProps} />
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
        color: colors.amberGlow,
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
        borderColor: colors.amberGlow,
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
        color: colors.amberGlow,
        fontWeight: 'bold',
        textTransform: 'uppercase',
        width: '90%',
        marginBottom: 5,
        marginHorizontal: "auto",
    }

})
export default AppInput