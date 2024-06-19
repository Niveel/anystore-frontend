import 'react-native-get-random-values';
import 'react-native-gesture-handler';
import { StyleSheet } from 'react-native';
import React, { useState, useEffect } from 'react'
import { NavigationContainer } from '@react-navigation/native';

// custom imports
import colors from './app/config/colors';
import AppNavigator from './app/navigation/AppNavigator';
import OfflineNotice from './app/components/OfflineNotice';
import AuthNavigation from './app/navigation/AuthNavigation';
import AuthContext from './app/auth/context';
import authStorage from './app/auth/storage';
import BarcodePolicyProvider from './app/config/BarcodeContext';
import {ThemeProvider} from './app/utils/ThemeContext';

export default function App() {
  const [user, setUser] = useState()

  const restoreUser = async () => {
    const user = await authStorage.getUser()
    if (user) setUser(user)
  }

  useEffect(() => {
    restoreUser()
  }, [])

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
