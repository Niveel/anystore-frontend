import Reacct from 'react'
import { createStackNavigator } from '@react-navigation/stack'

import colors from '../config/colors'
import FavoriteStoreScreen from '../screens/FavoriteStoreScreen'
import ProductDetails from '../screens/ProductDetailsScreen'
import StoreScreen from '../screens/StoreScreen'

const Stack = createStackNavigator()

const StoreNavigator = () => {
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
            name='FavoriteStore' 
            component={FavoriteStoreScreen}
            options={{title: 'Favorite Stores'}}
        />
        <Stack.Screen
            name='Store'
            component={StoreScreen}
            options={{ 
                headerShown: true,
             }}
        />
        <Stack.Screen
            name='ProductDetails'
            component={ProductDetails}
            options={{ 
                headerShown: true,
             }}
        />
    </Stack.Navigator>

  )
}

export default StoreNavigator