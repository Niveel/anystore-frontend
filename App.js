import 'react-native-get-random-values';
import 'react-native-gesture-handler';
import React, { useState, useEffect, } from 'react'
import { NavigationContainer } from '@react-navigation/native';

// custom imports
import AppNavigator from './app/navigation/AppNavigator';
import OfflineNotice from './app/components/OfflineNotice';
import AuthNavigation from './app/navigation/AuthNavigation';
import RootNavigator from './app/navigation/RootNavigator';
import AuthContext from './app/auth/context';
import authStorage from './app/auth/storage';
import BarcodePolicyProvider from './app/config/BarcodeContext';
import {ThemeProvider} from './app/utils/ThemeContext';
import {TutorialProvider} from './app/utils/TutorialContext';

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
        <TutorialProvider>
          <BarcodePolicyProvider>
            <OfflineNotice />
              <NavigationContainer>
                {/* {user ? <AppNavigator /> : <AuthNavigation />} */}
                <RootNavigator />
              </NavigationContainer>
          </BarcodePolicyProvider>
        </TutorialProvider>
      </AuthContext.Provider>
    </ThemeProvider>
  );
}
