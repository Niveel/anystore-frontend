import { View, StyleSheet } from 'react-native'
import React from 'react'

import AppText from '../AppText'
import { useTheme } from '../../utils/ThemeContext'

const ErrorMessage = ({error, visible}) => {
    if(!visible || !error) return null

    const {theme} = useTheme()
  return (
    <View style={[styles.errorBox, {backgroundColor: theme?.misty,}]}>
      <AppText style={styles.error} color={theme?.amberGlow}>{error}</AppText>
    </View>
  )
}

const styles = StyleSheet.create({
    error: {
        fontSize: 12,
        fontWeight: '900',
    },
    errorBox: {
        paddingHorizontal: 10,
        paddingVertical: 2,
        opacity: 1,
        width: '90%',
        alignSelf: "center",
        borderRadius: 5,
        marginBottom: 10,
    },
})

export default ErrorMessage