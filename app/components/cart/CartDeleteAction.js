import { StyleSheet, TouchableWithoutFeedback, View } from 'react-native'
import React from 'react'
import {MaterialCommunityIcons} from '@expo/vector-icons'
import colors from '../../config/colors'

const CartDeleteAction = ({onPress}) => {
  return (
    <TouchableWithoutFeedback onPress={onPress} >
        <View style={styles.container}>
            <MaterialCommunityIcons name='trash-can' size={50} color={colors.punch}/>
        </View>
    </TouchableWithoutFeedback>
  )
}

const styles = StyleSheet.create({
    container: {
        width: 100,
        height: "90%",
        backgroundColor: colors.amberGlowLight,
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 5,
    }
})

export default CartDeleteAction