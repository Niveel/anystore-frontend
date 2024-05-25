import { createStackNavigator } from '@react-navigation/stack'

import FavoriteStoreScreen from '../screens/FavoriteStoreScreen'
import CartScreen from '../screens/CartScreen'
import ProductsScreen from '../screens/ProductsScreen'
import StoreNavigator from './StoreNavigator'
import colors from '../config/colors'

const Stack = createStackNavigator()

const FavAndCartNavigator = () => {
  return (
   <Stack.Navigator
        screenOptions={{
            headerStyle: {
                backgroundColor: colors.horizon,
            },
            headerTintColor: colors.amberGlow,
            headerTitleStyle: {
                fontWeight: 'bold',
            },
        }}
   >
        <Stack.Screen 
            name='Products' 
            component={ProductsScreen}
            options={{headerShown: false}} 
        />
        <Stack.Screen 
            name='Favorites' 
            component={StoreNavigator}
            options={{headerShown: false}} 

        />
        <Stack.Screen 
            name='Cart' 
            component={CartScreen}
        /> 
    </Stack.Navigator>
  )
}

export default FavAndCartNavigator