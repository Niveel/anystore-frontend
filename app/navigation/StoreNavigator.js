import React from 'react'
import { createStackNavigator } from '@react-navigation/stack'
import { Platform } from 'react-native'

import FavoriteStoreScreen from '../screens/FavoriteStoreScreen'
import ProductDetails from '../screens/ProductDetailsScreen'
import StoreScreen from '../screens/StoreScreen'
import { useTheme } from '../utils/ThemeContext'

const Stack = createStackNavigator()

const StoreNavigator = () => {
    const {theme} = useTheme()
  return (
    <Stack.Navigator
        screenOptions={{
            presentation: "modal",
            headerStyle: {
                backgroundColor: theme?.horizon,
                height: Platform.OS === 'ios' ? 100 : 60,   
            },
            headerTitleStyle: {
                fontSize: 20,
                fontWeight: 'bold',
            },
            headerTintColor: theme?.amberGlow,
        }}
    >
        <Stack.Screen 
            name='FavoriteStore' 
            component={FavoriteStoreScreen}
            options={{title: 'Favorite Stores'}}
        />
        <Stack.Screen
            name='Store'
            component={StoreScreen}
            options={{ 
                headerShown: true,
             }}
        />
        <Stack.Screen
            name='ProductDetails'
            component={ProductDetails}
            options={{ 
                headerShown: true,
             }}
        />
    </Stack.Navigator>

  )
}

export default StoreNavigator