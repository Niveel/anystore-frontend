import React from 'react'
import { createStackNavigator } from '@react-navigation/stack'

import LoginScreen from '../screens/LoginScreen'
import SignUpScreen from '../screens/SignUpScreen'
import WelcomeScreen from '../screens/WelcomeScreen'
import ForgotPasswordScreen from '../screens/ForgotPasswordScreen'
import SignupVerifyScreen from '../screens/SignupVerifyScreen'
import PasswordResetVerifyScreen from '../screens/PasswordResetVerifyScreen'
import NewPasswordScreen from '../screens/NewPasswordScreen'
import colors from '../config/colors'

const Stack = createStackNavigator()

const AuthNavigation = () => {
  return (
    <Stack.Navigator>
        <Stack.Screen 
            name='Welcome' 
            component={WelcomeScreen} 
            options={{headerShown: false}}
        />
        <Stack.Screen 
            name='Login' 
            component={LoginScreen}
            options={{headerShown: false}}
        />
        <Stack.Screen 
            name='SignUp' 
            component={SignUpScreen}
            options={{headerShown: false}}
        />
        <Stack.Screen 
            name='SignupVerify' 
            component={SignupVerifyScreen}
            options={{
                headerStyle: {backgroundColor: colors.horizon},
                headerTintColor: colors.amberGlow,
                title: 'Email verification'
            }}
        />
        <Stack.Screen 
            name='ForgotPassword' 
            component={ForgotPasswordScreen}
            options={{
                headerStyle: {backgroundColor: colors.horizon},
                headerTintColor: colors.amberGlow,
                title: 'Password Reset'
            }}
        />
        <Stack.Screen 
            name='PasswordResetVerify' 
            component={PasswordResetVerifyScreen}
            options={{
                headerStyle: {backgroundColor: colors.horizon},
                headerTintColor: colors.amberGlow,
                title: 'Password Reset Verification'
            }}
        />
        <Stack.Screen 
            name='NewPassword' 
            component={NewPasswordScreen}
            options={{
                headerShown: false
            }}
        />
    </Stack.Navigator>
  )
}

export default AuthNavigation