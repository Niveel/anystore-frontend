import React from 'react'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { MaterialCommunityIcons } from '@expo/vector-icons'

import AccountNavigator from './AccountNavigator'
import ProductNavigator from './ProductNavigator'
import RadarNavigation from './RadarNavigation'
import CritNavigation from './CritNavigation'
import AuthNavigation from './AuthNavigation'
import { useTheme } from '../utils/ThemeContext'
import useAuth from '../auth/useAuth'

const Tab = createBottomTabNavigator()

const AppNavigator = () => {
  const {theme} = useTheme() 
  const {user} = useAuth()

  return (
   <Tab.Navigator
        tabBarOptions={{
            activeTintColor: theme?.amberGlow,
            activeBackgroundColor: theme?.midnight,
            inactiveBackgroundColor: theme?.horizon,  
            inactiveTintColor: theme?.misty,
            labelStyle: {
                fontSize: 14,
                fontWeight: 'bold',
            },
            keyboardHidesTabBar: true,
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
            component={user ? RadarNavigation : AuthNavigation} 
            options={{
              headerShown: false,
              tabBarIcon: ({color, size}) => (
                <MaterialCommunityIcons name='radar' color={color} size={size}/>
              ),
            }}
        />
        <Tab.Screen 
            name='Crit' 
            component={user ? CritNavigation : AuthNavigation} 
            options={{
              headerShown: false,
              tabBarIcon: ({color, size}) => (
                <MaterialCommunityIcons name='chat-processing' color={color} size={size}/>
              ),
            }}
        />
        <Tab.Screen 
            name='Account' 
            component={user ? AccountNavigator : AuthNavigation} 
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
