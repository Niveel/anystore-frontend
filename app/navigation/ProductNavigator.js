import { createStackNavigator } from '@react-navigation/stack'

import FavAndCartNavigator from './FavAndCartNavigator'
import ProductDetails from '../screens/ProductDetailsScreen'
import ShareScreen from '../screens/ShareScreen'
import BarcodeScreen from '../screens/BarcodeScreen'
import BarcodePolicyScreen from '../screens/BarcodePolicyScreen'
import ShareTitleScreen from '../screens/ShareTitleScreen'
import ProductInfoScreen from '../screens/ProductInfoScreen'
import CafaAiScreen from '../screens/CafaAiScreen'
import CategoriesScreen from '../screens/CategoriesScreen'
import CameraSearchScreen from '../screens/CameraSearchScreen'
import BarcodeResultsScreen from '../screens/BarcodeResultsScreen'
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
                backgroundColor: theme?.misty,
                height: 60,   
                borderBottomLeftRadius: 25,
                borderBottomRightRadius: 25,
            },
            headerTitleStyle: {
                fontSize: 20,
                fontWeight: 'bold',
            },
            headerTintColor: theme?.white,
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
                headerTitle: "Share To Groups",
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
            name={routes.CATEGORIES_SCREEN} 
            component={CategoriesScreen}
            options={{headerShown: false}}
        />
        <Stack.Screen 
            name={routes.CAMERA_SEARCH_SCREEN} 
            component={CameraSearchScreen}
            options={{headerShown: false}}
        />
        <Stack.Screen 
            name={routes.BARCODE_RESULTS} 
            component={BarcodeResultsScreen}
            options={{
                headerTitle: "Barcode Results",
            }}
        />
        <Stack.Screen 
            name={routes.PRODUCT_IMAGES} 
            component={ImagesScreen}
            options={{headerShown: false}}
        />
    </Stack.Navigator>
  )
}

export default ProductNavigator