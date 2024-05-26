import { View, StyleSheet, Text, Image, TouchableHighlight, TouchableOpacity } from 'react-native'
import React from 'react'
import AppText from './AppText'
import colors from '../config/colors'
import {MaterialCommunityIcons} from '@expo/vector-icons'

const ProductCard = ({name,image, desc, price, companyName, onPress, addToCart, addToCartOnPress, ...otherPops}) => {

  return (
    <TouchableHighlight style={styles.card} onPress={onPress} underlayColor="rgba(0,0,0,.3)">
        <View style={styles.cardInner}>
          {addToCart &&
          <TouchableOpacity style={styles.addToCartButton} onPress={addToCartOnPress}>
             <MaterialCommunityIcons 
                          name="cart-plus" 
                          color={colors.amberGlow} 
                          size={30} 
              /> 
          </TouchableOpacity>
          }
            <View style={styles.image}>
              <Image 
                source={{uri: image}} 
                style={{
                  width: "100%", 
                  height: "100%",
                  resizeMode: "contain",
                }}
              />
            </View>
            <View style={styles.details}>
                <Text style={styles.name} numberOfLines={1}>{name}</Text>
                <AppText numberOfLines={2} style={styles.desc}>{desc}</AppText>
                <View style={{flexDirection: "row", justifyContent: "space-between", gap: 5}}>
                    <AppText style={[styles.price, styles.cardButton]}>${price || "N/A"}</AppText>
                    {companyName && <AppText style={[styles.companyName, styles.cardButton]} numberOfLines={1}>{companyName}</AppText>}
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
      backgroundColor: colors.horizon,
      borderRadius: 5,
    },
    card: {
      backgroundColor: colors.midnight,
      marginBottom: 15,
      overflow: 'hidden',
      height: 170,
      borderWidth: 1,
      padding: 10,
      borderRadius: 10,
      borderColor: colors.amberGlow,
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
        backgroundColor: colors.amberGlow,  
        color: colors.midnight,
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
      backgroundColor: colors.horizon,
      overflow: "hidden",
    },
    name: {
      fontWeight: "bold",
      fontSize: 18,
      textTransform: "capitalize",
      color: colors.white,
    },
    price: {
      backgroundColor: colors.horizon,
      color: colors.white,
      fontWeight: "900",
      fontSize: 12,
      flex: 1,
    }
    
})
export default ProductCard