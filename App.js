import 'react-native-get-random-values';
import 'react-native-gesture-handler';
import { StyleSheet, Platform } from 'react-native';
import React, { useState, useEffect, useRef } from 'react'
import { NavigationContainer } from '@react-navigation/native';
import * as Notifications from 'expo-notifications';

// custom imports
import colors from './app/config/colors';
import AppNavigator from './app/navigation/AppNavigator';
import OfflineNotice from './app/components/OfflineNotice';
import AuthNavigation from './app/navigation/AuthNavigation';
import AuthContext from './app/auth/context';
import authStorage from './app/auth/storage';
import BarcodePolicyProvider from './app/config/BarcodeContext';
import {ThemeProvider} from './app/utils/ThemeContext';
import registerDeviceToken from './app/api/registerDeviceToken';

// notifications
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});


export default function App() {
  const [user, setUser] = useState()
  const [authToken, setAuthToken] = useState()

  const restoreUser = async () => {
    const user = await authStorage.getUser()
    if (user) setUser(user)
  }

  useEffect(() => {
    restoreUser()
  }, [])

  authStorage.getToken().then(token => {
    setAuthToken(token)
  })

  // console log the device token
  useEffect(() => {
    registerForPushNotificationsAsync().then(token => {
      if(authToken && user) {
        // console.log("Device Token: ", token, "authToken: ", authToken, "Username: ", user?.username);
        registerDeviceToken(authToken, user?.username, token).then(response => {
          console.log(response.data.message);
        }).catch(error => {
          console.log("Device Registration Error:",error);
        });
      }
    });
  }, [authToken, user]);

  // register for push notifications
  const registerForPushNotificationsAsync = async () => {
    let token;

    if (Platform.OS === 'android') {
      await Notifications.setNotificationChannelAsync('default', {
        name: 'default',
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#FF231F7C',
      });
      token = (await Notifications.getExpoPushTokenAsync()).data;

      return token;
  }
  }


  return (
    <ThemeProvider>
      <AuthContext.Provider value={{ user, setUser }}>
        <BarcodePolicyProvider>
          <OfflineNotice />
            <NavigationContainer>
              {user ? <AppNavigator /> : <AuthNavigation />}
            </NavigationContainer>
        </BarcodePolicyProvider>
      </AuthContext.Provider>
    </ThemeProvider>
  );
}

const styles = StyleSheet.create({
  screen: {
    backgroundColor: colors.midnight,
    padding: 10,
  }
})
