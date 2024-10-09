import React from 'react'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { MaterialCommunityIcons } from '@expo/vector-icons'
import {getFocusedRouteNameFromRoute} from '@react-navigation/native'
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Dimensions, Platform } from 'react-native';

import AccountNavigator from './AccountNavigator'
import ProductNavigator from './ProductNavigator'
import RadarNavigation from './RadarNavigation'
import CritNavigation from './CritNavigation'
import AuthNavigation from './AuthNavigation'
import { useTheme } from '../utils/ThemeContext'
import routes from './routes'
import useAuth from '../auth/useAuth'

const Tab = createBottomTabNavigator()

const getRouteName = (route) => {
  const routeName = getFocusedRouteNameFromRoute(route)
  
  if(routeName?.includes("Welcome") || routeName?.includes("Login") || routeName?.includes("SignUp") || routeName?.includes("CafaAiScreen") || routeName?.includes("ProductDetails") || routeName?.includes("ShareScreen") || routeName?.includes(routes.CAMERA_SEARCH_SCREEN) || routeName?.includes("Favorites")) {
    return "none"
  }
}

const {width, height} = Dimensions.get('window')

const AppNavigator = () => {
  const {theme} = useTheme() 
  const {user} = useAuth()
  const insets = useSafeAreaInsets();
  const isLargeScreen = height > 768
  const isIos = Platform.OS === 'ios'

  // const tabBarHeight = isIos && isLargeScreen ? 50 : 50;

  const tabBarStyle = {
    height: 50 + insets.bottom,
    position: "absolute",
    bottom: 12,
    left: 14,
    right: 14,
    borderRadius: 18,
    overflow: "hidden",
    elevation: 5,
    backgroundColor: theme?.white,
    borderTopWidth: 0,
  }

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
              const iconSize = isLargeScreen && isIos ? size + 15 : size + 8
              return <MaterialCommunityIcons 
                      name={iconName} 
                      size={focused ? iconSize : size} 
                      color={color} 
                      style={{ marginBottom: -4 }}
                    />
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
          tabBarStyle: tabBarStyle,
      })}
   >
        <Tab.Screen  
            name='Home' 
            component={ProductNavigator} 
            options={({route}) => ({
              tabBarStyle: [
                tabBarStyle, 
                {display: getRouteName(route)}
              ],
              headerShown: false,
            })}
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
              tabBarStyle: {
                display: 'none',
              }
            }}
        />
        <Tab.Screen 
            name='Account' 
            component={user ? AccountNavigator : AuthNavigation} 
            options={({route}) => ({
              tabBarStyle: [
                tabBarStyle, 
                {display: getRouteName(route)}
              ],
              headerShown: false,
            })}
        />
    </Tab.Navigator>
  )
}

export default AppNavigator
