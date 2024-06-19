import React from 'react'
import { createStackNavigator } from '@react-navigation/stack'

import RadarScreen from '../screens/RadarScreen'
import RadarList from '../components/RadarList'
import ProductDetails from '../screens/ProductDetailsScreen'
import RadarPriceCheckScreen from '../components/RadarPriceCheckScreen'
import { useTheme } from '../utils/ThemeContext'

const Stack = createStackNavigator()

const RadarNavigation = () => {
    const {theme} = useTheme()
  return (
    <Stack.Navigator
        screenOptions={{
            presentation: "modal",
            headerStyle: {
                backgroundColor: theme?.horizon,
                height: 80,   
            },
            headerTitleStyle: {
                fontSize: 20,
                fontWeight: 'bold',
            },
            headerTintColor: theme?.amberGlow,
        }}
    >
        <Stack.Screen 
            name='RadarScreen' 
            component={RadarScreen}
            options={{headerShown: false}}
        />
        <Stack.Screen
            name='RadarList'
            component={RadarList}
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
        <Stack.Screen
            name='RadarPriceCheck'
            component={RadarPriceCheckScreen}
            options={{
                headerShown: true,
                headerTitle: 'Price Check',
                
            }}
        />
    </Stack.Navigator>
  )
}

export default RadarNavigation