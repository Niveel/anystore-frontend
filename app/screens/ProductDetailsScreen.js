import React, {useState, useEffect} from 'react';
import { View, StyleSheet, Image, FlatList, TouchableOpacity, Alert, Linking } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage'; 

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
    const product = route.params;

    const { theme } = useTheme();
    
    useEffect(() => {
        fetchFavStores()
        fetchCartItems();
        fetchRadarItems();
    }, []);

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
            console.log('Link not available');
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

  return (
    <Screen style={[styles.screen, {backgroundColor: theme?.midnight,}]}>
        <View style={styles.container}>
            <View style={[styles.image, {backgroundColor: theme?.horizon,}]}>
                {/* flatList to display array of images */}
                <FlatList
                    data={product?.images}
                    keyExtractor={(item, index) => index.toString()}
                    horizontal
                    pagingEnabled
                    showsHorizontalScrollIndicator={false}
                    style={{width: "100%", height: "100%"}}
                    renderItem={({item}) => (
                        <View style={{ width: 365, height: 240, justifyContent: "center", alignItems: "center" }}>
                            <Image
                                source={{ uri: item }}
                                style={{ width: "100%", height: "100%", resizeMode: "contain" }}
                                defaultSource={{ uri: "https://img.freepik.com/free-vector/illustration-gallery-icon_53876-27002.jpg?size=626&ext=jpg" }}
                            />
                        </View>
                    )}
                />
            </View>
            <View style={styles.detailsContainer}>  
                <View style={styles.details}>
                    <AppText style={{
                        textTransform: "capitalize",
                        fontSize: 16,
                    }}>{product?.title}</AppText>
                    <AppText style={styles.price} color={theme?.amberGlow}>{product?.price || "$N/A"}</AppText>
                </View>
                {product?.shop_name && 
                    <View style={styles.storeWrapper}>
                        <AppText style={styles.store} color={theme?.misty}>{product?.shop_name}</AppText>
                        <TouchableOpacity 
                            style={{flexDirection: "row", alignItems: "center"}} 
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
                    style={{
                        borderRadius: 5,
                        marginVertical: 10,
                        width: 'max-content',
                        paddingHorizontal: 10,
                        height: 40,
                        alignSelf: 'center'
                    }}
                    textStyle={{
                        fontSize: 14,
                        fontWeight: "normal",
                    }}
                    onPress={()=> navigation.navigate(routes.PRODUCT_INFO, {productDetails: product?.description})}
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
                    <TouchableOpacity style={[styles.button, {backgroundColor: theme?.horizon,}]} onPress={()=> openBuyNowLink(product?.link)}>
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
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        width: "100%",
        gap: 5,
        flexWrap: "wrap",
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
        height: "35%",
        borderRadius: 5,
        overflow: "hidden",
    },
    name: {
        fontSize: 20,
        fontWeight: "bold",
        color: "#fff",
        maxWidth: "80%",
    },
    price: {
        fontSize: 16,
        fontWeight: "900",
    },
    radar: {
        borderRadius: 5,
        width: 'auto',
        paddingHorizontal: 10,
        paddingVertical: 5,
        height: 36,
    },
    radarShareWrapper: {
        marginBottom: 20,
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
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        width: "100%",
        gap: 20,
        marginVertical: 10,
    },
});

export default ProductDetails;