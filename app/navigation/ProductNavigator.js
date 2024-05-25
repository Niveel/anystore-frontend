import { createStackNavigator } from '@react-navigation/stack'

import FavAndCartNavigator from './FavAndCartNavigator'
import ProductDetails from '../screens/ProductDetailsScreen'
import colors from '../config/colors'
import ShareScreen from '../screens/ShareScreen'
import BarcodeScreen from '../screens/BarcodeScreen'
import ShareTitleScreen from '../screens/ShareTitleScreen'
import ProductInfoScreen from '../screens/ProductInfoScreen'

const Stack = createStackNavigator()

const ProductNavigator = () => {
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
            name='Product' 
            component={FavAndCartNavigator}
            options={{headerShown: false}}
        />
        <Stack.Screen
            name='ProductDetails'
            component={ProductDetails}
            options={{
                headerTitle: "Product Details",
            }}
        />
        <Stack.Screen 
            name='ShareScreen' 
            component={ShareScreen}
            options={{
                headerTitle: "Share",
            }}
        />
        <Stack.Screen
            name='ShareTitleScreen'
            component={ShareTitleScreen}
            options={{
                headerTitle: "Share Title",
            }}
        />
        <Stack.Screen 
            name='BarcodeScreen' 
            component={BarcodeScreen}
            options={{
                headerTitle: "Barcode / Qrcode scanner",
            }}
        />
        <Stack.Screen 
            name='ProductInfoScreen' 
            component={ProductInfoScreen}
            options={{
                headerTitle: "Product Information",
            }}
        />
    </Stack.Navigator>
  )
}

export default ProductNavigator