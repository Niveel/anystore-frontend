import React from 'react';
import { View, StyleSheet, Image, TouchableOpacity } from 'react-native';
import {MaterialCommunityIcons} from '@expo/vector-icons'
import { useNavigation } from '@react-navigation/native';

import AppText from './AppText';
import { useTheme } from '../utils/ThemeContext';
import logo from '../assets/shopwit_logo.jpg';
import routes from '../navigation/routes';

const CustomHeader = ({showIcons, title="header",}) => {
    const { theme } = useTheme();
    const navigation = useNavigation();

    const handleFavorite = () => {
        navigation.navigate(routes.FAVORITES)
    }

    const handleCart = () => {
        navigation.navigate(routes.CART)
    }

    const handleNotification = () => {
        console.log('Notification route')
    }

  return (
    <View 
        style={[styles.container, {backgroundColor: theme?.misty}]} 
        accessible={true}
        accessibilityLabel="ShopWit logo"
    >
        <Image source={logo} style={styles.logo} />

        <AppText style={styles.text} color={theme.white}>{title}</AppText>

        {showIcons && 
            <View style={styles.buttonsWrapper}>
                <TouchableOpacity
                    onPress={handleFavorite}
                    accessible={true}
                    accessibilityLabel='Favorite stores'
                    style={[styles.icon, {backgroundColor: theme?.white}]}
                >
                    <MaterialCommunityIcons name="heart" size={20} color={theme?.punch} />
                </TouchableOpacity>
                <TouchableOpacity
                    onPress={handleNotification}
                    accessible={true}
                    accessibilityLabel='Favorite stores'
                    style={[styles.icon, {backgroundColor: theme?.white}]}
                >
                    <MaterialCommunityIcons name="bell" size={20} color={theme?.horizon} />
                </TouchableOpacity>
                <TouchableOpacity
                    onPress={handleCart}
                    accessible={true}
                    accessibilityLabel='Cart'
                    style={[styles.icon, {backgroundColor: theme?.white}]}
                >
                    <MaterialCommunityIcons name="cart" size={20} color={theme?.amberGlow} />
                </TouchableOpacity>
            </View>
        }
    </View>
  );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingVertical: 8,
        borderBottomEndRadius: 25,
        borderBottomStartRadius: 25,
    },
  logo: {
    width: 40,
    height: 40,
    borderRadius: 25,
  },
    text: {
        fontSize: 18,
        textTransform: 'uppercase',
        textAlign: 'center',
    },
    buttonsWrapper: {
        flexDirection: 'row',
        gap: 8,
    },
    icon: {
        height: 32,
        width: 32,
        borderRadius: 25,
        alignItems: 'center',
        justifyContent: 'center',
    }
});

export default CustomHeader;