import { createStackNavigator } from '@react-navigation/stack'
import React from 'react'
import { Platform } from 'react-native'

import CartScreen from '../screens/CartScreen'
import ProductsScreen from '../screens/ProductsScreen'
import StoreNavigator from './StoreNavigator'
import { useTheme } from '../utils/ThemeContext'

const Stack = createStackNavigator()

const FavAndCartNavigator = () => {
    const {theme} = useTheme()
  return (
   <Stack.Navigator
        screenOptions={{
            presentation: "modal",
                headerStyle: {
                    backgroundColor: theme?.misty,
                    height: 60,   
                    borderBottomLeftRadius: 25,
                    borderBottomRightRadius: 25,
                },
                headerTitleStyle: {
                    fontSize: 20,
                    fontWeight: 'bold',
                },
                headerTintColor: theme?.white,
        }}
    >
        <Stack.Screen 
            name='Products' 
            component={ProductsScreen}
            options={{headerShown: false}}  
        />
        <Stack.Screen 
            name='Favorites' 
            component={StoreNavigator}
            options={{headerShown: false}} 

        />
        <Stack.Screen 
            name='Cart' 
            component={CartScreen}
        /> 
    </Stack.Navigator>
  )
}

export default FavAndCartNavigator