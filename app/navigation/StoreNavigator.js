import React from 'react'
import { createStackNavigator } from '@react-navigation/stack'

import FavoriteStoreScreen from '../screens/FavoriteStoreScreen'
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
    </Stack.Navigator>

  )
}

export default StoreNavigator