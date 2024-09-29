import 'react-native-get-random-values';
import 'react-native-gesture-handler';
import React, { useState, useEffect, } from 'react'
import { NavigationContainer } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

// custom imports
import OfflineNotice from './app/components/OfflineNotice';
import RootNavigator from './app/navigation/RootNavigator';
import AuthContext from './app/auth/context';
import authStorage from './app/auth/storage';
import BarcodePolicyProvider from './app/config/BarcodeContext';
import {ThemeProvider} from './app/utils/ThemeContext';
import {TutorialProvider} from './app/utils/TutorialContext';
import { linking } from './app/config/linking';
import TutorialModal from './app/components/modals/TutorialModal';

export default function App() {
  const [user, setUser] = useState()
  const [isAppFirstLaunched, setIsAppFirstLaunched] = useState(null)

  const restoreUser = async () => {
    const user = await authStorage.getUser()
    if (user) setUser(user)
  }

  useEffect(() => {
    const checkAppFirstLaunch = async () => {
      try {
        const appData = await AsyncStorage.getItem('appFirstLaunched')
        
        if(appData == null) {
          setIsAppFirstLaunched(true)
          await AsyncStorage.setItem('appFirstLaunched', 'false')
        } else {
          setIsAppFirstLaunched(false)
        }
      } catch (error) {
        console.log('Failed to check app first launch:', error)
      }
    }
    checkAppFirstLaunch()
  }, [])

  useEffect(() => {
    restoreUser()
  }, [])

  return (
    <ThemeProvider>
      <AuthContext.Provider value={{ user, setUser }}>
        <TutorialProvider>
          <BarcodePolicyProvider>
            <OfflineNotice />
              {isAppFirstLaunched !== null && 
              <NavigationContainer linking={linking}>
                <RootNavigator />
                {isAppFirstLaunched && <TutorialModal />}
              </NavigationContainer>}
          </BarcodePolicyProvider>
        </TutorialProvider>
      </AuthContext.Provider>
    </ThemeProvider>
  );
}
