import React,{useEffect, useState} from 'react'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { MaterialCommunityIcons } from '@expo/vector-icons'

import AccountNavigator from './AccountNavigator'
import colors from '../config/colors'
import ProductNavigator from './ProductNavigator'
import RadarNavigation from './RadarNavigation'
import FriendlyScreen from '../screens/FriendlyScreen'
import CritNavigation from './CritNavigation'

const Tab = createBottomTabNavigator()

const AppNavigator = () => {

  return (
   <Tab.Navigator
        tabBarOptions={{
            activeTintColor: colors.amberGlowLight,
            activeBackgroundColor: colors.midnight,
            inactiveBackgroundColor: colors.horizon, 
            inactiveTintColor: colors.misty,
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
