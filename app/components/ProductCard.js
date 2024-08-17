import { View, StyleSheet, Text, Image, TouchableHighlight, TouchableOpacity } from 'react-native'
import React from 'react'
import {MaterialCommunityIcons} from '@expo/vector-icons'

import AppText from './AppText'
import { useTheme } from '../utils/ThemeContext'

const ProductCard = ({name,image, desc, price, companyName, onPress, addToCart, addToCartOnPress, ...otherPops}) => {
  const {theme} = useTheme()

  return (
    <TouchableHighlight style={[styles.card, {backgroundColor: theme?.horizon, borderColor: theme?.amberGlow,}]} onPress={onPress} underlayColor="rgba(0,0,0,.3)">
        <View style={styles.cardInner}>
          {addToCart &&
          <TouchableOpacity style={[styles.addToCartButton, {backgroundColor: theme?.midnight,}]} onPress={addToCartOnPress}>
             <MaterialCommunityIcons 
                          name="cart-plus" 
                          color={theme?.amberGlow} 
                          size={30} 
              /> 
          </TouchableOpacity>
          }
            <View style={[styles.image, {backgroundColor: theme?.misty,}]}>
              <Image 
                source={{uri: image[0]}} 
                style={{
                  width: "100%", 
                  height: "100%",
                  resizeMode: "contain",
                }}
              />
            </View>
            <View style={styles.details}>
                <Text style={[styles.name, {color: theme?.white,}]} numberOfLines={1}>{name}</Text>
                <AppText numberOfLines={2} style={styles.desc}>{desc}</AppText>
                <View style={{flexDirection: "row", justifyContent: "space-between", gap: 5}}>
                    <AppText style={[styles.price, styles.cardButton, {
                      backgroundColor: theme?.misty,
                      color: theme?.white,
                    }]}>{price || "$N/A"}</AppText>
                    {companyName && <AppText style={[styles.companyName, styles.cardButton, {
                      backgroundColor: theme?.amberGlow,  
                    }]} numberOfLines={1} color={theme?.midnight}>{companyName}</AppText>}
                </View>  
            </View>
        </View> 
    </TouchableHighlight>
  )
}

const styles = StyleSheet.create({
    addToCartButton: {
      position: "absolute",
      top: 5,
      right: 5,
      zIndex: 1,
      padding: 5,
      borderRadius: 5,
    },
    card: {
      marginBottom: 15,
      overflow: 'hidden',
      height: 170,
      borderWidth: 2,
      padding: 10,
      borderRadius: 10,
    },
    cardButton: {
        paddingVertical: 2,
        paddingHorizontal: 10,
        borderRadius: 5,
        justifyContent: "center",
        alignItems: "center",
        textAlign: "center",
        fontWeight: "bold",
        textTransform: "capitalize",
        maxWidth: "50%",
      },
    cardInner: {
        flexDirection: "row",
        height: "100%",
        width: "100%",
    },
    companyName: {
        fontSize: 12,
        flex: 1
    },
    details: {
      padding: 5,
      height: "100%",
      width: "60%",
      gap: 5,
      justifyContent: "space-between",
    },
    desc: {
      fontSize: 16, 
    },
    image: {
      width: '40%',
      height: "100%",
      borderRadius: 15,
      overflow: "hidden",
    },
    name: {
      fontWeight: "bold",
      fontSize: 18,
      textTransform: "capitalize",
    },
    price: {
      fontWeight: "900",
      fontSize: 12,
      flex: 1,
    }
    
})
export default ProductCard