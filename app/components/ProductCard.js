import { View, StyleSheet, Text, Image, TouchableHighlight, TouchableOpacity } from 'react-native'
import React from 'react'
import {MaterialCommunityIcons} from '@expo/vector-icons'

import AppText from './AppText'
import { useTheme } from '../utils/ThemeContext'

const ProductCard = ({name,image, desc, price, companyName, onPress, addToCart, addToCartOnPress, rating, ...otherPops}) => {
  const {theme} = useTheme()

  const priceRegex = (price) => {
    return price.replace(/\$/g, '').replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  }

  return (
    <TouchableHighlight 
      style={[styles.card, {backgroundColor: theme?.horizon, borderColor: theme?.amberGlow,}]}  
      onPress={onPress} 
      underlayColor="rgba(0,0,0,.3)"
      {...otherPops}
    >
        <View style={styles.cardInner}>
          {addToCart &&
          <TouchableOpacity 
            style={[styles.addToCartButton, {backgroundColor: theme?.midnight,}]} 
            onPress={addToCartOnPress}
            accessible={true}
            accessibilityLabel="Add to cart"
            accessibilityHint={`Double tap to add ${name} to cart`}
          >
             <MaterialCommunityIcons 
                          name="cart-plus" 
                          color={theme?.amberGlow} 
                          size={20} 
              /> 
          </TouchableOpacity>
          }
            <View style={[styles.image, {backgroundColor: theme?.misty,}]}>
              {/* rating box */}
              <View 
                style={[styles.rating, {backgroundColor: theme?.amberGlow}]}>
                <AppText 
                  style={{fontWeight: "bold", fontSize: 12}}
                  color={theme?.midnight}
                  accessible={true}
                  accessibilityLabel="Rating"
                >{rating || "N/A"}</AppText>
              </View>
              {/* end of rating box */}
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
                <AppText numberOfLines={2} style={styles.desc}>{desc || "Description not available"}</AppText>
                <View style={{flexDirection: "row", justifyContent: "space-between", gap: 5}}>
                    <AppText style={[styles.price, styles.cardButton, {
                      backgroundColor: theme?.misty,
                      color: theme?.white,
                    }]}>${priceRegex(price) || "$N/A"}</AppText>
                    {companyName && <AppText 
                      style={[styles.companyName, styles.cardButton, {
                        backgroundColor: theme?.amberGlow,  
                      }]} 
                      numberOfLines={1} 
                      color={theme?.midnight}
                      accessible={true}
                      accessibilityLabel={`from ${companyName} store`}
                    >{companyName}</AppText>}
                </View>  
            </View>
        </View> 
    </TouchableHighlight>
  )
}

const styles = StyleSheet.create({
    addToCartButton: {
      position: "absolute",
      top: 27,
      right: 2,
      zIndex: 1,
      padding: 4,
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
    },
    rating: {
      position: "absolute",
      bottom: 5,
      left: 4,
      padding: 4,
      borderRadius: 5,
      opacity: 0.9,
      zIndex: 1,
    }
    
})
export default ProductCard