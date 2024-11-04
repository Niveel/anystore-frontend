import React, {useState, useEffect} from 'react';
import { View, StyleSheet, Alert, ScrollView, Linking } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage'; 
import axios from 'axios';
import {MaterialCommunityIcons} from '@expo/vector-icons';
// import * as WebBrowser from 'expo-web-browser';

import Screen from '../components/Screen';
import routes from '../navigation/routes';
import { useTheme } from '../utils/ThemeContext';
import useAuth from '../auth/useAuth';
import ImageSlider from '../components/ImageSlider';
import ProductInfo from '../components/ProductInfo';

function ProductDetails({route, navigation}) {
    const [cartItemAdded, setCartItemAdded] = useState([]);
    const [favStoreAdded, setFavStoreAdded] = useState([]);
    const [radarItemAdded, setRadarItemAdded] = useState([]);
    const [productData, setProductData] = useState([]);
    const [isImageLoading, setIsImageLoading] = useState(true);
    const product = route.params;

    const { theme } = useTheme();
    const { user } = useAuth();
    
    // Fetch cart items, radar items and fav stores
    useEffect(() => {
        fetchFavStores()
        fetchCartItems();
        fetchRadarItems();
    }, []);

    // Fetch product details
    useEffect(() => {
        try {
            const fetchProductDetails = async () => {
                const response = await axios.get(`https://imprezbookkeeping.pythonanywhere.com/scrape/?url=${product?.link}`);
                setProductData(response.data);
            }
            fetchProductDetails();
        } catch (error) {
            console.error('Error fetching product details:', error)
        } finally {
            setIsImageLoading(false);
        }
    }, []);

    // header title to the product name
    useEffect(() => {
        navigation.setOptions({
            headerTitle: product?.title || "Product Details",
        });
    }, []);

    const formatImageData = (images) => {
        return images.slice(0, 7).map((image, index) => ({
          id: index + 1,
          url: image
        }));
    };

    const formattedImages = formatImageData(productData.images || []);

    // console.log("formattedImages", formattedImages);

    const fetchRadarItems = async () => {
        try {
            // getting radar items from AsyncStorage
            const existingRadarItems = await AsyncStorage.getItem('radarItems');
            const parsedExistingRadarItems = JSON.parse(existingRadarItems) || [];
            setRadarItemAdded(parsedExistingRadarItems);
        } catch (error) {
            console.error('Error fetching radar items:', error);
        }
    }
    
    const fetchCartItems = async () => {
        try {
            const existingCartItems = await AsyncStorage.getItem('cartItems');
            const parsedExistingCartItems = JSON.parse(existingCartItems) || [];
            setCartItemAdded(parsedExistingCartItems);
        } catch (error) {
            console.error('Error fetching cart items:', error);
        }
    };

    const fetchFavStores = async () => {
        try {
        const existingStores = await AsyncStorage.getItem('favStores');
        const parsedExistingStores = JSON.parse(existingStores) || [];
        setFavStoreAdded(parsedExistingStores);
        } catch (error) {
        console.error('Error fetching fav stores:', error);
        }
    };

    const handleAddToCart = async (productID) =>{
        if(!user) {
            navigation.navigate("Auth", { screen: 'Login' })
            return
        }
        try {
            // Retrieve existing cart items from AsyncStorage
            const existingCartItems = await AsyncStorage.getItem('cartItems');
            const parsedExistingCartItems = JSON.parse(existingCartItems) || [];

            // Check if the product is already in the cart
            const isProductInCart = parsedExistingCartItems.some(
                (item) => item.id === productID
            );

            if (isProductInCart) {
                // Product is already in the cart
                Alert.alert("Product is already in the cart")
                return;
            }

            // Add the new product to the cart
            const updatedCartItems = [...parsedExistingCartItems, product];
            setCartItemAdded(updatedCartItems)
            await AsyncStorage.setItem('cartItems', JSON.stringify(updatedCartItems));
            Alert.alert("Product added to cart")
          } catch (error) {
            console.error('Error adding product to cart:', error);
          }
    };

    const openBuyNowLink = link => {
        if (!link) {
            Alert.alert("Link not available")
            return;
        }
        // WebBrowser.openBrowserAsync(link);
        Linking.openURL(link);
    }

    const handleAddToRadar = async (productID) => {
        if(!user) {
            navigation.navigate("Auth", { screen: 'Login' })
            return
        }
        try {
            // Retrieve existing radar items from AsyncStorage
            const existingRadarItems = await AsyncStorage.getItem('radarItems');
            const parsedExistingRadarItems = JSON.parse(existingRadarItems) || [];

            // Check if the product is already in the radar
            const isProductInRadar = parsedExistingRadarItems.some((item) => item.id === productID);

            if (isProductInRadar) {
                // Product is already in the radar
                Alert.alert("Product is already in the radar")
                return;
            }
            // Add the new product to the radar
            const updatedRadarItems = [...parsedExistingRadarItems, product];
            setRadarItemAdded(updatedRadarItems)
            await AsyncStorage.setItem('radarItems', JSON.stringify(updatedRadarItems));
            Alert.alert("Product added to radar")

        } catch (error) {
            console.error('Error adding product to radar:', error);
        }
    }

    const handleAddToFavStores = async (store) => {
        if(!user) {
            navigation.navigate("Auth", { screen: 'Login' })
            return
        }
        try {
            // Retrieve existing stores from AsyncStorage
            const existingStores = await AsyncStorage.getItem('favStores');
            const parsedExistingStores = JSON.parse(existingStores) || [];
        
            // Check if the store is already in the list
            const isStoreInList = parsedExistingStores.some(
              (item) => item === store
            );
        
            if (isStoreInList) {
              // Store is already in the list
              Alert.alert('Store is already in the list');
              return;
            }

            // Add the new store to the list
            const updatedStores = [...parsedExistingStores, store];
            setFavStoreAdded(updatedStores);
            await AsyncStorage.setItem('favStores', JSON.stringify(updatedStores));
            Alert.alert('Store added to list');

        } catch (error) {
            console.error('Error adding store to list:', error);
        }
    }

    const handleShare = product => {
        if(!user) {
            navigation.navigate("Auth", { screen: 'Login' })
            return
        }
        navigation.navigate(routes.SHARE_SCREEN, product) 
    }

    const renderStars = (rating) => {
        const fullStars = Math.floor(rating);
        const hasHalfStar = rating % 1 >= 0.5;
        const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
        
        return (
            <View style={{ flexDirection: 'row' }}>
                {[...Array(fullStars)].map((_, i) => (
                    <MaterialCommunityIcons key={`full-${i}`} name="star" color={theme?.amberGlow} size={16} />
                ))}
                {hasHalfStar && <MaterialCommunityIcons name="star-half" color={theme?.amberGlow} size={16} />}
                {[...Array(emptyStars)].map((_, i) => (
                    <MaterialCommunityIcons key={`empty-${i}`} name="star-outline" color={theme?.amberGlow} size={16} />
                ))}
            </View>
        );
    };

  return (
    <Screen style={[styles.screen, {backgroundColor: theme?.midnight,}]}>
        <ScrollView
            style={{flex: 1}}
            contentContainerStyle={{flexGrow: 1}}
        >
            <ImageSlider 
                imagesData={formattedImages} 
                isImageLoading={isImageLoading}
            />

            <ProductInfo 
                title={product?.title}
                description={product.description}
                rating={renderStars(product.rating || 0)}
                price={product.price}
                askCafa={()=> navigation.navigate(routes.CAFA, {product})}
                handleAddToCart={()=> handleAddToCart(product.id)}
                handleAddToFavStores={()=> handleAddToFavStores(product.shop_name)}
                handleAddToRadar={()=> handleAddToRadar(product.id)}
                handleBuyNow={()=> openBuyNowLink(productData?.link || product?.link)}
                handleShare={()=> handleShare(product)}
                productImg={product?.images[0] || "https://img.freepik.com/free-vector/illustration-gallery-icon_53876-27002.jpg?size=626&ext=jpg&ga=GA1.1.1700460183.1713139200&semt=ais"}
                store={product.shop_name}
                productId={product.id}
                productLink={productData?.link || product?.link}
            />
        </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
    screen: {
        paddingTop: 0,
    },
});

export default ProductDetails;