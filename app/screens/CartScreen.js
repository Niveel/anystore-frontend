import { View, StyleSheet } from 'react-native'
import React from 'react'

import Screen from '../components/Screen'
import CartList from '../components/CartList'
import { useTheme } from '../utils/ThemeContext'

const CartScreen = () => {

  const {theme} = useTheme()

  return (
    <Screen style={[styles.screen, {backgroundColor: theme?.midnight,}]}>
        <View style={{paddingBottom: 15, height: "100%"}}>
            <CartList/>
        </View>
    </Screen>
  )

}

const styles = StyleSheet.create({
    screen: {
        padding: 10,
        paddingTop: 10,
    }
})

export default CartScreen