import React, { useEffect, useState } from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import AsyncStorage from '@react-native-async-storage/async-storage';

import FriendlyScreen from '../screens/FriendlyScreen';
import ChatroomScreen from '../screens/ChatroomScreen';
import { useTheme } from '../utils/ThemeContext';
import BarcodePolicyScreen from '../screens/BarcodePolicyScreen';
import { useBarcodePolicy } from '../config/BarcodeContext';
import CritTabLoader from '../components/loaders/CritTabLoader';

const Stack = createStackNavigator();

const CritNavigation = () => {
    const { theme } = useTheme();
    const { barcodeCameraAllow, setBarcodeCameraAllow } = useBarcodePolicy();
    const [loading, setLoading] = useState(true); 

    useEffect(() => {
        const checkPolicy = async () => {
            try {
                const storedValue = await AsyncStorage.getItem('policyAccepted');
                if (storedValue === 'true') {
                    setBarcodeCameraAllow(true);
                } else {
                    setBarcodeCameraAllow(false);
                }
            } catch (error) {
                console.error('Error checking barcode policy:', error);
            } finally {
                setLoading(false); 
            }
        };
        checkPolicy();
    }, [setBarcodeCameraAllow]); 

    if (loading) {
        return <CritTabLoader />;
    }

    return (
        <Stack.Navigator
            screenOptions={{
                presentation: 'modal',
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
                component={barcodeCameraAllow ? FriendlyScreen : BarcodePolicyScreen}
                options={{
                    headerShown: false,
                }}
            />
            <Stack.Screen
                name='Chatroom'
                component={ChatroomScreen}
                options={{
                    headerShown: false,
                }}
            />
        </Stack.Navigator>
    );
};

export default CritNavigation;
