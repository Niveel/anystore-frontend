import React, {useState, useEffect} from 'react';
import { View, StyleSheet, ToastAndroid, TouchableOpacity, Alert, Linking } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage'; 
import axios from 'axios';
import {MaterialCommunityIcons} from '@expo/vector-icons';

import AppText from '../components/AppText';
import AppButton from '../components/AppButton'; 
import Icon from '../components/Icon';
import Screen from '../components/Screen';
import routes from '../navigation/routes';
import { useTheme } from '../utils/ThemeContext';

function ProductDetails({route, navigation}) {
    const [cartItemAdded, setCartItemAdded] = useState([]);
    const [favStoreAdded, setFavStoreAdded] = useState([]);
    const [radarItemAdded, setRadarItemAdded] = useState([]);
    const [productData, setProductData] = useState([]);
    const product = route.params;

    const { theme } = useTheme();
    
    useEffect(() => {
        fetchFavStores()
        fetchCartItems();
        fetchRadarItems();
    }, []);

    useEffect(() => {
        try {
            const fetchProductDetails = async () => {
                const response = await axios.get(`https://imprezbookkeeping.pythonanywhere.com/scrape/?url=${product?.link}`);
                setProductData(response.data);
            }
            fetchProductDetails();
        } catch (error) {
            console.error('Error fetching product details:', error)
        }
    }, []);

    useEffect(() => {
        navigation.setOptions({
            headerTitle: product?.title || "Product Details",
        });
    }, []);

    const imagesReadyToast = () => {
        ToastAndroid.show("Images are not ready yet!", ToastAndroid.SHORT);  
    }

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
        Linking.openURL(link);
    }

    const handleAddToRadar = async (productID) => {
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
        navigation.navigate(routes.SHARE_SCREEN, product) 
    }

    const handleViewImages = () => {
        if(productData?.images?.length > 0 || product?.images?.length > 0) {
            navigation.navigate(routes.PRODUCT_IMAGES, {images: productData?.images, fallbackImage: product?.images})
        } else {
            imagesReadyToast();
        }
    }
    const renderStars = (rating) => {
        const fullStars = Math.floor(rating);
        const hasHalfStar = rating % 1 >= 0.5;
        const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
        
        return (
            <View style={{ flexDirection: 'row' }}>
            {[...Array(fullStars)].map((_, i) => (
                <MaterialCommunityIcons key={`full-${i}`} name="star" color={theme?.amberGlow} size={24} />
            ))}
            {hasHalfStar && <MaterialCommunityIcons name="star-half" color={theme?.amberGlow} size={24} />}
            {[...Array(emptyStars)].map((_, i) => (
                <MaterialCommunityIcons key={`empty-${i}`} name="star-outline" color={theme?.amberGlow} size={24} />
            ))}
            </View>
        );
    };
      
  return (
    <Screen style={[styles.screen, {backgroundColor: theme?.midnight,}]}>
        <View style={styles.container}>
            <View style={[styles.image, {backgroundColor: theme?.horizon,}]}>
                <AppButton
                    title="View Images"
                    color={theme?.amberGlowLight}
                    onPress={handleViewImages}
                    width='90%'
                />
                <View 
                    style={{
                        width: "100%",
                        justifyContent: "center",
                        alignItems: "center",
                        paddingVertical: 10,
                        backgroundColor: theme?.midnight,
                        marginTop: 10,
                    }}
                    accessible={true}
                    accessibilityLabel={`Product rating is ${product?.rating || 0} stars out of 5`}
                >
                    <AppText style={{fontSize: 14}}>Rating ({product?.rating})</AppText>
                    {renderStars(product?.rating || 0)}
                </View>
            </View>
            <View style={styles.detailsContainer}>  
                <View style={styles.details}>
                    <View style={{alignSelf: "flex-start"}}>
                        <AppText style={{
                            textTransform: "capitalize",
                            fontSize: 16,
                        }}>{product?.title}</AppText>
                    </View>
                    <AppText style={styles.price} color={theme?.amberGlow}>{product?.price || "$"}</AppText>
                </View>
                {product?.shop_name && 
                    <View style={styles.storeWrapper}>
                        <AppText style={styles.store} color={theme?.misty}>{product?.shop_name}</AppText>
                        <TouchableOpacity 
                            style={{flexDirection: "row", alignItems: "center", alignSelf: "flex-end"}} 
                            onPress={()=> handleAddToFavStores(product?.shop_name)}
                        >
                            <AppText style={styles.heart} color={theme?.white}>Add to Favorite Stores</AppText>
                            <Icon
                                name="heart"
                                size={25}
                                color={theme?.punch}
                            />
                        </TouchableOpacity>
                    </View>
                }
                <AppButton
                    title="Product Information"
                    color={theme?.amberGlowLight}
                    style={styles.productInfo}
                    textStyle={{
                        fontSize: 14,
                        fontWeight: "normal",
                    }}
                    onPress={()=> {
                        if(productData?.description)
                            navigation.navigate(routes.PRODUCT_INFO, {productData, product})
                        return
                    }}
                />
                <View style={styles.buttonWrapper}>
                    <TouchableOpacity style={[styles.addToCartButton, {backgroundColor: theme?.misty,}]} onPress={()=> handleAddToCart(product?.id)}>
                        <AppText style={styles.cartText}>Add to cart</AppText>
                        <Icon
                            name="cart"
                            size={25}
                            color={theme?.midnight}
                        />
                    </TouchableOpacity>
                    <AppButton 
                        title="Add to Radar"
                        onPress={()=> handleAddToRadar(product?.id)}
                        style={styles.radar}
                        textStyle={{
                            fontSize: 15,
                            fontWeight: "normal",
                        }}
                    />
                    
                </View>
                <View style={styles.radarShareWrapper}>
                    <TouchableOpacity style={[styles.button, {backgroundColor: theme?.horizon,}]} onPress={()=> openBuyNowLink(productData?.link || product?.link)}>
                        <AppText style={styles.buttonText} color={theme?.amberGlow}>Buy Now</AppText>
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.share, {backgroundColor: theme?.horizon,}]} onPress={()=> handleShare(product)}>
                        <Icon 
                            name="share"
                            size={20}
                            color={theme?.amberGlow}
                        />
                        <AppText style={styles.shareText}>SHARE</AppText>
                    </TouchableOpacity>
                </View>
                <AppButton
                    title="Ask Cafa"
                    color={theme?.amberGlowLight}
                    style={styles.longBtn}
                    textStyle={{
                        fontSize: 14,
                        fontWeight: "normal",
                    }}
                    onPress={()=> navigation.navigate(routes.CAFA, {product})}
                />
            </View>
        </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
    addToCartButton: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingVertical: 5,
        paddingHorizontal: 10,
        borderRadius: 5,
    },
    button: {
        borderRadius: 5,
        paddingVertical: 5,
        paddingHorizontal: 10,
        justifyContent: "center",
        alignItems: "center",
    },
    buttonText: {
        textTransform: "uppercase",
        fontWeight: "normal",
        fontSize: 14,
    },
    buttonWrapper: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        width: "100%",
        gap: 20,
        marginVertical: 10,
        marginBottom: 20,
    },
    cartText: {
        textTransform: "uppercase",
        fontSize: 15,
    },
  container: {
    width: '100%',
    height: "100%",
    padding: 10,
  },
    details: {
        width: "100%",
        gap: 5,
    },
    detailsContainer: {
        padding: 10,
        width: '100%',
        height: "65%",

    },
    longBtn: {
        borderRadius: 5,
        width: 'max-content',
        paddingHorizontal: 10,
        height: 40,
        alignSelf: 'center'
    },
    heart: {
        fontSize: 14,
    },
    image: {
        width: '100%',
        borderRadius: 5,
        overflow: "hidden",
        justifyContent: "center",
        alignItems: "center",
        paddingVertical: 10,
    },
    name: {
        fontSize: 20,
        fontWeight: "bold",
        color: "#fff",
        maxWidth: "80%",
    },
    price: {
        fontSize: 28,
        fontWeight: "900",
        alignSelf: "flex-end",
    },
    productInfo: {
        borderRadius: 5,
        marginVertical: 10,
        width: 'max-content',
        paddingHorizontal: 10,
        height: 40,
        alignSelf: 'center'
    },
    radar: {
        borderRadius: 5,
        width: 'auto',
        paddingHorizontal: 10,
        paddingVertical: 5,
        height: 36,
    },
    radarShareWrapper: {
        marginBottom: 10,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        width: "100%",
        gap: 20,
        marginVertical: 10,
    },
    screen: {
        paddingTop: 0,
    },
    share: {
        borderRadius: 5,
        paddingVertical: 2,
        width: "20%",
        justifyContent: "center",
        alignItems: "center",
    },
    shareText: {
        fontSize: 10,
    },
    store: {
        fontSize: 18,
        textTransform: "capitalize",
    },
    storeWrapper: {
        width: "100%",
        gap: 10,
        marginVertical: 10,
    },
});

export default ProductDetails;