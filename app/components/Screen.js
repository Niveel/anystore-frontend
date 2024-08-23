import React from 'react'
import { View, SafeAreaView, StyleSheet, StatusBar } from 'react-native'
// import Constants from 'expo-constants'

const Screen = ({children, style}) => {

  return (
    <SafeAreaView style={[styles.screen, style]}>
        <StatusBar barStyle="light-content" />
        <View>
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