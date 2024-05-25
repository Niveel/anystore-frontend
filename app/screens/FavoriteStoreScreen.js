import { View, StyleSheet } from 'react-native'
import React from 'react'

import FavoriteStoreList from '../components/FavoriteStoreList'
import Screen from '../components/Screen'
import colors from '../config/colors'

const FavoriteStoreScreen = () => { 
  return (
    <Screen style={styles.screen}>
        <View style={{paddingBottom: 15,paddingTop: 15, height: "100%",}}>
            <FavoriteStoreList />
        </View>
    </Screen>
  )
}

const styles = StyleSheet.create({
    
    screen: {
        backgroundColor: colors.midnight,
        paddingTop: 10,
    }
})

export default FavoriteStoreScreen