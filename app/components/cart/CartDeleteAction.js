import { StyleSheet, TouchableWithoutFeedback, View } from 'react-native'
import React from 'react'
import {MaterialCommunityIcons} from '@expo/vector-icons'
import { useTheme } from '../../utils/ThemeContext'

const CartDeleteAction = ({onPress}) => {
  const {theme} = useTheme()
  return (
    <TouchableWithoutFeedback 
      onPress={onPress} 
      accessible={true}
      accessibilityLabel="Delete item from cart"
    >
        <View style={[styles.container, {backgroundColor: theme?.amberGlow}]}>
            <MaterialCommunityIcons name='trash-can' size={50} color={theme?.punch}/>
        </View>
    </TouchableWithoutFeedback>
  )
}

const styles = StyleSheet.create({
    container: {
        width: 100,
        height: "90%",
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 5,
    }
})

export default CartDeleteAction