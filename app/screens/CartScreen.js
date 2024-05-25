import { View, StyleSheet } from 'react-native'
import React from 'react'

import Screen from '../components/Screen'
import colors from '../config/colors'
import CartList from '../components/CartList'

const CartScreen = () => {

  return (
    <Screen style={styles.screen}>
        <View style={{paddingBottom: 15, height: "100%"}}>
            <CartList/>
        </View>
    </Screen>
  )
}

const styles = StyleSheet.create({
    
    screen: {
        backgroundColor: colors.midnight,
        padding: 10,
        paddingTop: 10,
    }
})

export default CartScreen