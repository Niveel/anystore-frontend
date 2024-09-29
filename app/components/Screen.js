import React from 'react'
import { View, SafeAreaView, StyleSheet, StatusBar } from 'react-native'
// import Constants from 'expo-constants'

import { useTheme } from '../utils/ThemeContext'

const Screen = ({children, statusColor, style}) => {
  const { theme } = useTheme()
  statusColor = statusColor || theme?.misty

  return (
    <SafeAreaView style={[styles.screen, style]}>
        <StatusBar backgroundColor={statusColor} />
        <View style={{ flex: 1, backgroundColor: theme?.midnight }}>
            {children}
        </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
    screen: {
        flex: 1,
        // paddingTop: Constants.statusBarHeight
    }
})

export default Screen