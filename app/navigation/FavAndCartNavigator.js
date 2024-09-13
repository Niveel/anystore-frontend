import { createStackNavigator } from '@react-navigation/stack'

import CartScreen from '../screens/CartScreen'
import ProductsScreen from '../screens/ProductsScreen'
import StoreNavigator from './StoreNavigator'
import { useTheme } from '../utils/ThemeContext'

const Stack = createStackNavigator()

const FavAndCartNavigator = () => {
    const {theme} = useTheme()
  return (
   <Stack.Navigator
        screenOptions={{
            headerStyle: {
                backgroundColor: theme?.horizon,
                height: 60,
            },
            headerTintColor: theme?.amberGlow,
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