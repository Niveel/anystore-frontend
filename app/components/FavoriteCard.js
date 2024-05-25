import { View, StyleSheet, TouchableHighlight, Alert } from 'react-native'
import React from 'react'
import {MaterialCommunityIcons} from '@expo/vector-icons'

import AppText from './AppText'
import colors from '../config/colors'
import AppButton from './AppButton'

const ProductCard = ({shopName, onPress, removeFavorite}) => {
    
    const removeAlert = () => {
        Alert.alert(
            "Remove Favorite Store",
            "Are you sure you want to remove this favorite store?",
            [
                { text: "No" },
                { text: "Yes", onPress: removeFavorite },
            ],
            { cancelable: false }
        )
    }

  return (
        <View style={styles.storeContainer}>
            <TouchableHighlight style={styles.card} onPress={onPress} underlayColor="rgba(0,0,0,.3)">
                <View style={styles.cardInner}>
                    <View style={styles.image}>
                        <MaterialCommunityIcons name="store" size={80} color={colors.midnight} />
                    </View>
                    <View style={styles.details}>
                        <AppText style={styles.name} numberOfLines={1}>{shopName}</AppText>
                        <AppButton title="Remove" onPress={removeAlert} color={colors.black} />
                    </View>
                </View>
            </TouchableHighlight>
        </View>
  )
}

const styles = StyleSheet.create({
    storeContainer: {
        width: "50%",
        height: 260, 
        padding: 5,
    },
   card: {
       borderRadius: 15,
       backgroundColor: colors.white,
       overflow: "hidden",
       paddingVertical: 15,
       paddingHorizontal: 10,
       width: "100%",
       height: "100%",
       backgroundColor: "rgba(10,10,10,.4)",
    },
    cardInner: {
        height: "100%",
        width: "100%",
    },
    favWrapper: {
        height: 260,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        width: "100%",
        padding: 5,
        backgroundColor: "red",
    },
    image: {
        width: "100%",
        height: "60%",
        borderRadius: 25,
        backgroundColor: colors.amberGlowLight,
        overflow: "hidden",
        justifyContent: "center",
        alignItems: "center",
    },
    details: {
        width: "100%",
        height: "40%",
        justifyContent: "space-between",
        paddingTop: 5,
    },
    name: {
        fontWeight: "bold",
        color: colors.amberGlow,
        fontSize: 16,
        letterSpacing: 1,
        textAlign: "center",
        textTransform: "uppercase",
    },
    productContainer: {
        width: "50%", 
        padding: 5,
        height: "100%",
    },
})
export default ProductCard