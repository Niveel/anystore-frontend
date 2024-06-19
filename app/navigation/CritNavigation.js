import React from 'react'
import { createStackNavigator } from '@react-navigation/stack'

import FriendlyScreen from '../screens/FriendlyScreen'
import ChatroomScreen from '../screens/ChatroomScreen'
import { useTheme } from '../utils/ThemeContext'

const Stack = createStackNavigator()

const CritNavigation = () => {
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
                name='CritScreen' 
                component={FriendlyScreen}
                options={{
                    headerShown: false
                }}
            />
            <Stack.Screen 
                name='Chatroom' 
                component={ChatroomScreen}
                options={{
                    headerShown: false
                }}
            />
        </Stack.Navigator>
    )
}

export default CritNavigation