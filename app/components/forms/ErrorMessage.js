import { View, StyleSheet } from 'react-native'
import React from 'react'

import AppText from '../AppText'
import { useTheme } from '../../utils/ThemeContext'

const ErrorMessage = ({error, visible}) => {
    if(!visible || !error) return null

    const {theme} = useTheme()
  return (
    <View style={[styles.errorBox, {backgroundColor: theme?.amberGlow,}]}>
      <AppText style={styles.error} color={theme?.punch}>{error}</AppText>
    </View>
  )
}

const styles = StyleSheet.create({
    error: {
        fontSize: 14,
        fontWeight: '900',
    },
    errorBox: {
        paddingHorizontal: 10,
        paddingVertical: 5,
        opacity: 1,
        width: '90%',
        alignSelf: "center",
        borderRadius: 5,
        marginBottom: 10,
    },
})

export default ErrorMessage