import { View, StyleSheet } from 'react-native'
import React from 'react'

import FavoriteStoreList from '../components/FavoriteStoreList'
import Screen from '../components/Screen'
import { useTheme } from '../utils/ThemeContext'

const FavoriteStoreScreen = () => { 
    const {theme} = useTheme();
  return (
    <Screen style={[styles.screen, {backgroundColor: theme?.midnight,}]}>
        <View style={{paddingBottom: 15,paddingTop: 15, height: "100%",}}>
            <FavoriteStoreList />
        </View>
    </Screen>
  )
}

const styles = StyleSheet.create({
    
    screen: {
        paddingTop: 10,
    }
})

export default FavoriteStoreScreen