import React from 'react'
import { createStackNavigator } from '@react-navigation/stack'

import FriendlyScreen from '../screens/FriendlyScreen'
import ChatroomScreen from '../screens/ChatroomScreen'
import colors from '../config/colors'

const Stack = createStackNavigator()

const CritNavigation = () => {
    return (
        <Stack.Navigator
            screenOptions={{
                presentation: "modal",
                headerStyle: {
                    backgroundColor: colors.horizon,
                    height: 80,   
                },
                headerTitleStyle: {
                    fontSize: 20,
                    fontWeight: 'bold',
                },
                headerTintColor: colors.amberGlow,
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