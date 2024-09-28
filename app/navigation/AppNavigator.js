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
        screenOptions={({ route }) => ({
          tabBarActiveTintColor: theme?.misty,
          tabBarInactiveTintColor: theme?.horizon,
          tabBarActiveBackgroundColor: theme?.midnightLight,
          tabBarInactiveBackgroundColor: theme?.white,
          tabBarHideOnKeyboard: true,

          tabBarIcon: ({ focused, color, size }) => {
              let iconName
              if (route.name === "Home") {
                  iconName = focused ? "home" : "home-outline"
              } else if (route.name === "Radar") {
                  iconName = focused ? "radar" : "compass-outline"
              } else if (route.name === "Crit") {
                  iconName = focused ? "chat-processing" : "chat-processing-outline"
              } else if (route.name === "Account") {
                  iconName = focused ? "account" : "account-outline"
              }
              return <MaterialCommunityIcons name={iconName} size={focused ? size + 8 : size} color={color} />
          },
          tabBarItemStyle: {
            borderRadius: 
              route.name === "Home"
              ? 0 
              : route.name === "Account"
              ? 0 
              : 0, 
            borderTopRightRadius: route.name === "Home" ? 36 : 16,
            borderTopLeftRadius: route.name === "Account" ? 36 : 16,
          },
          // tabBarShowLabel: false,
          tabBarLabelStyle: {
              fontSize: 10,
          },
          tabBarStyle: {
              height: 50,
              position: "absolute",
              bottom: 12,
              left: 14,
              right: 14,
              borderRadius: 18,
              overflow: "hidden",
              elevation: 5,
          },
      })}
   >
        <Tab.Screen  
            name='Home' 
            component={ProductNavigator} 
            options={{
              headerShown: false,
            }}
        />
        <Tab.Screen 
            name='Radar' 
            component={user ? RadarNavigation : AuthNavigation} 
            options={{
              headerShown: false,
            }}
        />
        <Tab.Screen 
            name='Crit' 
            component={user ? CritNavigation : AuthNavigation} 
            options={{
              headerShown: false,
            }}
        />
        <Tab.Screen 
            name='Account' 
            component={user ? AccountNavigator : AuthNavigation} 
            options={{
              headerShown: false,
            }}
        />
    </Tab.Navigator>
  )
}

export default AppNavigator
