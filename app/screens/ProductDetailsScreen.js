import React, {useState, useEffect} from 'react';
import { View, StyleSheet, Image, TouchableOpacity, Alert, Linking } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage'; 

import AppText from '../components/AppText';
import colors from '../config/colors';
import AppButton from '../components/AppButton'; 
import Icon from '../components/Icon';
import Screen from '../components/Screen';
import routes from '../navigation/routes';

function ProductDetails({route, navigation}) {
    const [cartItemAdded, setCartItemAdded] = useState([]);
    const [favStoreAdded, setFavStoreAdded] = useState([]);
    const [radarItemAdded, setRadarItemAdded] = useState([]);
    const product = route.params;
    
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
    // regex to remove 'www.' and '.com' from websiteName
  const websiteNameRegex = (name) => {
    // if no name
    if (!name) return;
    return name.replace(/www.|.com/g, '');
  };

  return (
    <Screen style={styles.screen}>
        <View style={styles.container}>
            <View style={styles.image}>
                <Image 
                    source={{uri: product?.imageUrl || "https://img.freepik.com/free-vector/illustration-gallery-icon_53876-27002.jpg?size=626&ext=jpg&ga=GA1.1.1700460183.1713139200&semt=ais"}} 
                    style={{width: "100%", height: "100%", resizeMode: "contain"}}
                />
            </View>
            <View style={styles.detailsContainer}>
                <View style={styles.details}>
                    <AppText style={{
                        textTransform: "capitalize",
                    }} numberOfLines={1}>{websiteNameRegex(product?.title)}</AppText>
                    <AppText style={styles.price}>${product?.price || "N/A"}</AppText>
                </View>
                {product?.websiteName && 
                    <View style={styles.storeWrapper}>
                        <AppText style={styles.store}>{websiteNameRegex(product?.websiteName)}</AppText>
                        <TouchableOpacity 
                            style={{flexDirection: "row", alignItems: "center"}} 
                            onPress={()=> handleAddToFavStores(websiteNameRegex(product?.websiteName))}
                        >
                            <AppText style={styles.heart}>Add to Favorite Stores</AppText>
                            <Icon
                                name="heart"
                                size={25}
                                color={colors.punch}
                            />
                        </TouchableOpacity>
                    </View>
                }
                <AppButton
                    title="Product Information"
                    color={colors.amberGlowLight}
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
                    onPress={()=> navigation.navigate(routes.PRODUCT_INFO, {productDetails: product?.websiteDescription})}
                />
                <View style={styles.buttonWrapper}>
                    <TouchableOpacity style={styles.addToCartButton} onPress={()=> handleAddToCart(product?.id)}>
                        <AppText style={styles.cartText}>Add to cart</AppText>
                        <Icon
                            name="cart"
                            size={25}
                            color={colors.amberGlow}
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
                    <TouchableOpacity style={styles.button} onPress={()=> openBuyNowLink(product?.originalUrl)}>
                        <AppText style={styles.buttonText}>Buy Now</AppText>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.share} onPress={()=> handleShare(product)}>
                        <Icon 
                            name="share"
                            size={20}
                            color={colors.amberGlow}
                        />
                        <AppText style={styles.shareText}>SHARE</AppText>
                    </TouchableOpacity>
                </View>
                
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
        backgroundColor: colors.misty,
    },
    button: {
        borderRadius: 5,
        paddingVertical: 5,
        paddingHorizontal: 10,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: colors.horizon,
    },
    buttonText: {
        textTransform: "uppercase",
        fontWeight: "normal",
        color: colors.amberGlow,
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
        gap: 10,
    },
    detailsContainer: {
        padding: 20,
        width: '100%',
        height: "65%",

    },
    heart: {
        fontSize: 14,
    },
    image: {
        width: '100%',
        height: "35%",
        borderRadius: 5,
        overflow: "hidden",
        backgroundColor: colors.horizon,
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
        color: colors.amberGlow,
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
        backgroundColor: colors.midnight,
        paddingTop: 0,
    },
    share: {
        borderRadius: 5,
        backgroundColor: colors.horizon,
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
        color: colors.misty,
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