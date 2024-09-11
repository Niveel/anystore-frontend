import { createStackNavigator } from '@react-navigation/stack'

import FavAndCartNavigator from './FavAndCartNavigator'
import ProductDetails from '../screens/ProductDetailsScreen'
import ShareScreen from '../screens/ShareScreen'
import BarcodeScreen from '../screens/BarcodeScreen'
import BarcodePolicyScreen from '../screens/BarcodePolicyScreen'
import ShareTitleScreen from '../screens/ShareTitleScreen'
import ProductInfoScreen from '../screens/ProductInfoScreen'
import CafaAiScreen from '../screens/CafaAiScreen'
import ImagesScreen from '../screens/ImagesScreen'
import { useTheme } from '../utils/ThemeContext'
import routes from './routes'

const Stack = createStackNavigator()

const ProductNavigator = () => {
    const {theme} = useTheme()
  return (
    <Stack.Navigator
        screenOptions={{
            presentation: "modal",
            headerStyle: {
                backgroundColor: theme?.horizon,
                height: 60,   
            },
            headerTitleStyle: {
                fontSize: 20,
                fontWeight: 'bold',
            },
            headerTintColor: theme?.amberGlow,
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
            name='BarcodePolicyScreen' 
            component={BarcodePolicyScreen}
            options={{headerShown: false}}
        />
        <Stack.Screen 
            name='BarcodeScreen' 
            component={BarcodeScreen}
            options={{headerShown: false}}
        />
        <Stack.Screen 
            name='ProductInfoScreen' 
            component={ProductInfoScreen}
            options={{
                headerTitle: "Product Information",
            }}
        />
        <Stack.Screen 
            name='CafaAiScreen' 
            component={CafaAiScreen}
            options={{
                headerTitle: "Cafa AI",
            }}
        />
        <Stack.Screen 
            name={routes.PRODUCT_IMAGES} 
            component={ImagesScreen}
            options={{
                headerTitle: "Images",
            }}
        />
    </Stack.Navigator>
  )
}

export default ProductNavigator