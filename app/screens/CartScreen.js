import { View, StyleSheet } from 'react-native'
import React from 'react'

import Screen from '../components/Screen'
import CartList from '../components/CartList'
import { useTheme } from '../utils/ThemeContext'
import useAuth from '../auth/useAuth'
import ItemEmpty from '../components/ItemEmpty'

const CartScreen = () => {

  const {theme} = useTheme()
  const {user} = useAuth()

  return (
    <Screen style={[styles.screen, {backgroundColor: theme?.midnight,}]}>
        <View style={{paddingBottom: 15, paddingTop: 10, height: "100%"}}>
            {/* <CartList/> */}
            {user ? <CartList/> : <ItemEmpty 
                                      icon="account-cancel"
                                      text="Not Logged In"
                                      subText="Please login to view products in your cart."
                                  />}
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