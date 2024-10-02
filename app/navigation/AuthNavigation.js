import React from 'react'
import { createStackNavigator } from '@react-navigation/stack'

import LoginScreen from '../screens/LoginScreen'
import SignUpScreen from '../screens/SignUpScreen'
import WelcomeScreen from '../screens/WelcomeScreen'
import ForgotPasswordScreen from '../screens/ForgotPasswordScreen'
import SignupVerifyScreen from '../screens/SignupVerifyScreen'
import PasswordResetVerifyScreen from '../screens/PasswordResetVerifyScreen'
import NewPasswordScreen from '../screens/NewPasswordScreen'
import { useTheme } from '../utils/ThemeContext'

const Stack = createStackNavigator()

const AuthNavigation = () => {
    const {theme} = useTheme()
  return (
    <Stack.Navigator
        screenOptions={{headerShown: false}}
    >
        <Stack.Screen 
            name='Welcome' 
            component={WelcomeScreen} 
        />
        <Stack.Screen 
            name='Login' 
            component={LoginScreen}
        />
        <Stack.Screen 
            name='SignUp' 
            component={SignUpScreen}
        />
        <Stack.Screen 
            name='SignupVerify' 
            component={SignupVerifyScreen}
        />
        <Stack.Screen 
            name='ForgotPassword' 
            component={ForgotPasswordScreen}
        />
        <Stack.Screen 
            name='PasswordResetVerify' 
            component={PasswordResetVerifyScreen}
        />
        <Stack.Screen 
            name='NewPassword' 
            component={NewPasswordScreen}
        />
    </Stack.Navigator>
  )
}

export default AuthNavigation