import { View, StyleSheet } from 'react-native'
import React from 'react'

import FavoriteStoreList from '../components/FavoriteStoreList'
import Screen from '../components/Screen'
import { useTheme } from '../utils/ThemeContext'
import useAuth from '../auth/useAuth'
import ItemEmpty from '../components/ItemEmpty'

const FavoriteStoreScreen = () => { 
    const {theme} = useTheme();
    const {user} = useAuth();
  return (
    <Screen style={[styles.screen, {backgroundColor: theme?.midnight,}]}>
        <View style={{paddingBottom: 15,paddingTop: 15, height: "100%",}}>
            {user ? <FavoriteStoreList/> : <ItemEmpty 
                                                icon="account-cancel"
                                                text="Not Logged In"
                                                subText="Please login to view favorite stores."
                                            />}
        </View>
    </Screen>
  )
}

const styles = StyleSheet.create({
    screen: {
        paddingTop: 0,
    }
})

export default FavoriteStoreScreen