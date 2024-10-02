import { View, StyleSheet, TouchableHighlight, Alert, TouchableOpacity } from 'react-native'
import React from 'react'
import {MaterialCommunityIcons} from '@expo/vector-icons'

import AppText from './AppText'
import { useTheme } from '../utils/ThemeContext'
import AppButton from './AppButton'

const ProductCard = ({shopName, onPress, removeFavorite}) => {
    const {theme} = useTheme()
    
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
        <TouchableHighlight 
            style={styles.card}
            underlayColor={theme?.blackLight}
            onPress={onPress}
            accessible={true}
            accessibilityLabel="Double tap to enter store."
        >
            <View style={styles.cardWrapper}>
                <TouchableOpacity
                    style={styles.remove}
                    onPress={removeAlert}
                    accessible={true}
                    accessibilityLabel="Double tap to remove store."
                >
                    <MaterialCommunityIcons name="minus-circle" size={30} color={theme?.punch} />
                </TouchableOpacity>
                <View style={[styles.image, {backgroundColor: theme?.blackLight}]}>
                   <MaterialCommunityIcons name="store" size={80} color={theme?.horizon} />
                </View>
                <View style={styles.storeCta}>
                    <AppText style={styles.name} color={theme?.horizon} numberOfLines={1}>{shopName}</AppText>
                    <AppButton 
                        title="Visit store" 
                        onPress={onPress} 
                        color={theme?.horizon} 
                        height={35}
                        width='75%'
                        textStyle={{fontSize: 14}}
                        textColor={theme?.white}
                        underlayColor={theme?.amberGlow}
                    />
                </View>
                <View style={{flex: 1}}/>
            </View>
        </TouchableHighlight>
  )
}

const styles = StyleSheet.create({
    card: {
        width: "100%",
        height: 110,
        borderRadius: 15,
    },
    cardWrapper: {
        flexDirection: "row",
        width: "100%",
        height: "100%",
        borderRadius: 15,
        overflow: "hidden",
        borderWidth: 2,
    },
    image: {
        flex: 2,
        justifyContent: "center",
        alignItems: "center",
        borderWidth: 1,
        borderRadius: 10,
    },
    storeCta: {
        flex: 3,
        padding: 5,
        paddingBottom: 10,
        justifyContent: "center",
        alignItems: "center",
    },
    name: {
        fontSize: 20,
        fontWeight: 'bold',
        textTransform: 'capitalize',
        marginBottom: 10,
    },
    remove: {
        position: "absolute",
        top: 5,
        right: 5,
        zIndex: 1,
        padding: 5,
        borderRadius: 35,
    }
})
export default ProductCard