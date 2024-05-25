import { View, StyleSheet } from 'react-native'
import React from 'react'

import AppText from '../AppText'
import colors from '../../config/colors'

const ErrorMessage = ({error, visible}) => {
    if(!visible || !error) return null
  return (
    <View style={styles.errorBox}>
      <AppText style={styles.error}>{error}</AppText>
    </View>
  )
}

const styles = StyleSheet.create({
    error: {
        color: colors.punch,
        fontSize: 14,
        fontWeight: '900',
    },
    errorBox: {
        paddingHorizontal: 10,
        paddingVertical: 5,
        opacity: 1,
        backgroundColor: colors.amberGlow,
        width: '90%',
        alignSelf: "center",
        borderRadius: 5,
        marginBottom: 10,
    },
})

export default ErrorMessage