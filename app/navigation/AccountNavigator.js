import React from 'react'
import { createStackNavigator } from '@react-navigation/stack';

import AccountSettingsScreen from '../screens/AccountSettingsScreen';
import PasswordResetScreen from '../screens/PasswordResetScreen';
import EmailResetScreen from '../screens/EmailResetScreen';
import NameResetScreen from '../screens/NameResetScreen';
import OtherSettingsScreen from '../screens/OtherSettingsScreen';
import routes from './routes';
import { useTheme } from '../utils/ThemeContext';

const Stack = createStackNavigator();

const AccountNavigator = () => {
    const {theme} = useTheme()
  return (
    <Stack.Navigator
        screenOptions={{
            presentation: "modal",
            headerStyle: {
                backgroundColor: theme?.horizon,
            },
            headerTintColor: theme?.amberGlow,
            headerTitleStyle: {
                fontWeight: "bold",
            },
        }}
    >
        <Stack.Screen 
            name="AccountSettings" 
            component={AccountSettingsScreen} 
            options={()=>({
                headerShown: false,
            })}
        />
        <Stack.Screen
            name="NameReset"
            component={NameResetScreen}
            options={{
                title: "Reset Name",
                headerShown: true,
            }}
        />
        <Stack.Screen 
            name="PasswordReset" 
            component={PasswordResetScreen} 
            options={{
                title: "Change Password",
            }}

        />
        <Stack.Screen 
            name="EmailReset" 
            component={EmailResetScreen} 
            options={{
                title: "Email Reset",
            }}
        />
        <Stack.Screen 
            name={routes.OTHER_SETTINGS} 
            component={OtherSettingsScreen} 
            options={{
                title: "Other Settings",
            }}
        />
    </Stack.Navigator>
  )
}

export default AccountNavigator