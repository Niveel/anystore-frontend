import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

// Import your navigators
import AppNavigator from './AppNavigator';
import AuthNavigation from './AuthNavigation';

const RootStack = createStackNavigator();

function RootNavigator() {
  return (
    <RootStack.Navigator 
      screenOptions={{ 
        headerShown: false,
      }}
    >
        <RootStack.Screen 
          name="App" 
          component={AppNavigator} 
        />
        <RootStack.Screen name="Auth" component={AuthNavigation} />
    </RootStack.Navigator>
  );
}

export default RootNavigator;
