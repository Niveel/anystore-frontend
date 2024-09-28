import React from 'react'
import { View, SafeAreaView, StyleSheet, StatusBar } from 'react-native'
// import Constants from 'expo-constants'

import { useTheme } from '../utils/ThemeContext'

const Screen = ({children, style}) => {
  const { theme } = useTheme()

  return (
    <SafeAreaView style={[styles.screen, style]}>
        <StatusBar backgroundColor={theme?.misty} />
        <View style={{ flex: 1 }}>
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