import React from 'react'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { MaterialCommunityIcons } from '@expo/vector-icons'

import AccountNavigator from './AccountNavigator'
import ProductNavigator from './ProductNavigator'
import RadarNavigation from './RadarNavigation'
import CritNavigation from './CritNavigation'
import { useTheme } from '../utils/ThemeContext'

const Tab = createBottomTabNavigator()

const AppNavigator = () => {
  const {theme} = useTheme()

  return (
   <Tab.Navigator
        tabBarOptions={{
            activeTintColor: theme?.amberGlowLight,
            activeBackgroundColor: theme?.midnight,
            inactiveBackgroundColor: theme?.horizon,  
            inactiveTintColor: theme?.misty,
            labelStyle: {
                fontSize: 14,
                fontWeight: 'bold',
            },
        }}
   >
        <Tab.Screen  
            name='Home' 
            component={ProductNavigator} 
            options={{
              headerShown: false,
              tabBarIcon: ({color, size}) => (
                <MaterialCommunityIcons name='home' color={color} size={size}/>
              ),
            }}
        />
        <Tab.Screen 
            name='Radar' 
            component={RadarNavigation} 
            options={{
              headerShown: false,
              tabBarIcon: ({color, size}) => (
                <MaterialCommunityIcons name='radar' color={color} size={size}/>
              ),
            }}
        />
        <Tab.Screen 
            name='Crit' 
            component={CritNavigation} 
            options={{
              headerShown: false,
              tabBarIcon: ({color, size}) => (
                <MaterialCommunityIcons name='chat-processing' color={color} size={size}/>
              ),
            }}
        />
        <Tab.Screen 
            name='Account' 
            component={AccountNavigator} 
            options={{
              headerShown: false,
              tabBarIcon: ({color, size}) => (
                <MaterialCommunityIcons name='account' color={color} size={size}/>
              ),
            }}
        />
    </Tab.Navigator>
  )
}

export default AppNavigator
