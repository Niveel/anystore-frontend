import React, { useState, useEffect} from 'react'
import { View, StyleSheet, Platform, Linking, Alert , BackHandler, Animated, TouchableWithoutFeedback } from 'react-native'
import { MaterialCommunityIcons } from '@expo/vector-icons'
import { Keyboard, ToastAndroid } from 'react-native'
import { useNavigation } from '@react-navigation/native'
import axios from 'axios'
import Constants from 'expo-constants';
import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
// import * as expoLinking from 'expo-linking';
// import * as WebBrowser from 'expo-web-browser';
// import AsyncStorage from '@react-native-async-storage/async-storage'

// AsyncStorage.clear()

import Screen from '../components/Screen'
import AdHero from '../components/AdHero'
import CardProducts from '../components/CardProducts'
import ListItem from '../components/ListItem'
import { useTheme } from '../utils/ThemeContext'
import SortingBar from '../components/SortingBar'
import FilterBar from '../components/FilterBar'
import useAuth from '../auth/useAuth'
import authStorage from '../auth/storage'
import registerDeviceToken from '../api/registerDeviceToken'
import HomeHeader from '../components/HomeHeader'
import { TouchableOpacity } from 'react-native'
import routes from '../navigation/routes'
import BackBtnBar from '../components/BackBtnBar'

// notifications
Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: true,
      shouldPlaySound: false,
      shouldSetBadge: false,
    }),
});

const isIos = Platform.OS === "ios"

    const ProductsScreen = () => {
        const [searchText, setSearchText] = useState("")
        const [products, setProducts] = useState([])
        const [filteredProducts, setFilteredProducts] = useState([]);
        const [resultNotFound, setResultNotFound] = useState(false)
        const [loading, setLoading] = useState(false)
        const [productLoaded, setProductLoaded] = useState(true)
        const [page, setPage] = useState(1)
        const [hasMore, setHasMore] = useState(false)
        const [authToken, setAuthToken] = useState()
        const [hasSearched, setHasSearched] = useState(false)
        const navigation = useNavigation()
        const { theme } = useTheme();
        const { user } = useAuth();

        // animating header on scroll
        const headerHeight = 168.5
        const scrollY = new Animated.Value(0);
        const diffClamp = Animated.diffClamp(scrollY, 0, headerHeight);
        // interpolating the header
        const translateY = diffClamp.interpolate({
            inputRange: [0, headerHeight],
            outputRange: [0, -headerHeight],
            extrapolate: 'clamp',
        });
        // interpolating the translateY of the main container
        const bodyTranslateY = diffClamp.interpolate({
            inputRange: [0, headerHeight],
            outputRange: [headerHeight, 0],
            extrapolate: 'clamp',
        });
        
        // generate random id
        const generateRandomId = () => {
            return Math.floor(Math.random() * 1000000)
        }

        const fetchProducts = async (pageNum) => {
            if (searchText.trim() === "") return;
            setLoading(true);
            setProductLoaded(true);
            Keyboard.dismiss();
            try {
                const response = await axios.get(`https://imprezbookkeeping.pythonanywhere.com/general-search/?query=${searchText}&page=${pageNum}`, {
                    timeout: 10000,
                });
                const result = response?.data.map(product => ({ ...product, id: generateRandomId() }));
                setProducts(prevProducts => [...prevProducts, ...result]);
                setHasMore(result.length > 0);
                if (result.length === 0 && pageNum === 1) setResultNotFound(true);
            } catch (err) {
                console.log("error getting products", err);
                setLoading(false);
                setHasMore(false);
                setProductLoaded(false);
            } finally {
                setLoading(false);
            }
        };

        const handleSearch = () => {
            if (searchText.trim() === "") return;
            setHasSearched(true);
            setProducts([]);
            setFilteredProducts([]);
            setPage(1);
            setHasMore(true);
            fetchProducts(1);
        }

        const handleLoadMore = () => {
            if (hasMore && !loading) {
                const nextPage = page + 1;
                setPage(nextPage);
                fetchProducts(nextPage);
            } else if(!hasMore){
                setHasMore(false);
            }
        };

        const priceRegex = (price) => {
            return parseFloat(price.replace(/[^0-9.-]+/g, ""));
        }

        const handleSortItem = (option) => {
            if (option === "highest") {
                setProducts(prevProducts => [...prevProducts].sort((a, b) => priceRegex(b.price) - priceRegex(a.price)));
              } else if (option === "lowest") {
                setProducts(prevProducts => [...prevProducts].sort((a, b) => priceRegex(a.price) - priceRegex(b.price)));
              } else if (option === "highest_rating") {
                setProducts(prevProducts => [...prevProducts].sort((a, b) => b.rating - a.rating));
              } else if (option === "lowest_rating") {
                setProducts(prevProducts => [...prevProducts].sort((a, b) => a.rating - b.rating));
              }
        }

        const handlePriceFilter = ({ minPrice, maxPrice }) => {
            const min = Number(minPrice);
            const max = Number(maxPrice);
            
            // filter products based on price range
            const filtered = products.filter(product => {
                const price = priceRegex(product.price);
                return price >= min && price <= max;
            });
            
            setFilteredProducts(filtered);
            // toast when there is no product in the price range
            if (filtered.length === 0) {
                ToastAndroid.show("No product found in the price range", ToastAndroid.SHORT);
            }
        };

        // back button handler. when back button is pressed after search
        const backAction = () => {
            if (hasSearched) {
                setHasSearched(false);
                setProducts([]);
                setFilteredProducts([]);
                setPage(1);
                setHasMore(true);
                fetchProducts(1);
                // reset the header to full height
                Animated.timing(scrollY, {
                    toValue: 0,
                    duration: 0,
                    useNativeDriver: false,
                }).start();
                return true;
            }
            return false;
        };

        // back button listener
        useEffect(() => {
            const backHandler = BackHandler.addEventListener("hardwareBackPress", backAction);
            return () => backHandler.remove();
        }, [hasSearched]);

        // notifications====================
        // getting auth token
        authStorage.getToken().then(token => {
            setAuthToken(token);
        }).catch(error => {
            console.log("Error getting auth token", error);
        });

        // register device token
        useEffect(() => {
            if(authToken)
                registerForPushNotificationsAsync().then(token => {
                if(authToken && user) {
                    // console.log("Device Token: ", token, "authToken: ", authToken, "Username: ", user?.username);
                    registerDeviceToken(authToken, user?.username, token).then(response => {
                    console.log(response.data.message);
                    }).catch(error => {
                    console.log("Device Registration Error:",error);
                    });
                }
                });
          }, [authToken]);

          // register for push notifications
        const registerForPushNotificationsAsync = async () => {
            let token;

            if (Platform.OS === 'android') {
            await Notifications.setNotificationChannelAsync('default', {
                name: 'default',
                importance: Notifications.AndroidImportance.MAX,
                vibrationPattern: [0, 250, 250, 250],
                lightColor: '#FF231F7C',
            });

            if (Device.isDevice) {
                const { status: existingStatus } = await Notifications.getPermissionsAsync();
                let finalStatus = existingStatus;
                if (existingStatus !== 'granted') {
                const { status } = await Notifications.requestPermissionsAsync();
                finalStatus = status;
                }
                if (finalStatus !== 'granted') {
                    Alert.alert(
                        'Push Notifications Disabled',
                        'To receive notifications, please enable push notifications in your settings.',
                        [
                          { text: 'Cancel', style: 'cancel' },
                          {
                            text: 'Open Settings',
                            onPress: () => {
                              if (Platform.OS === 'ios') {
                                Linking.openURL('app-settings:'); // For iOS
                              } else {
                                Linking.openSettings(); // For Android
                              }
                            },
                          },
                        ]
                      );
                      return;
                }
                try {
                const projectId = Constants?.expoConfig?.extra?.eas?.projectId ?? Constants?.easConfig?.projectId;
                if (!projectId) {
                    throw new Error('Project ID not found');
                }
                token = (
                    await Notifications.getExpoPushTokenAsync({
                    projectId,
                    })
                ).data;
                } catch (e) {
                token = `Error ${e}`;
                }
            } else {
                alert('Must use physical device for Push Notifications');
            }

            // token = (await Notifications.getExpoPushTokenAsync()).data;

            return token;
        }
        }

        // console.log("products are", products)

        return (
            <Screen style={{ backgroundColor: theme?.midnight }}>
                <Animated.View 
                    style={styles.main}>
                    <Animated.View
                        style={{
                            transform: [
                                {translateY: translateY},
                            ],
                            position: "absolute",
                            top: 0,
                            left: 0,
                            right: 0,
                            zIndex: 100,
                            elevation: 5,
                        }}
                    >
                        <HomeHeader 
                            setSearchText={setSearchText}
                            handleSearch={handleSearch}
                            handleSearchByImage={()=> navigation.navigate(routes.CAMERA_SEARCH_SCREEN)}
                            showIcons
                            title="Home"
                        />
                    </Animated.View>
                    {/* main body */}
                    <Animated.View style={{flex: 1, marginTop: bodyTranslateY }}>
                        {!hasSearched ? 
                            (<AdHero/>) :
                        ( 
                            <View style={{flex: 1, paddingHorizontal: 5}}>
                                {/* sorting bar */}
                                {products?.length > 0 && (
                                    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                                        <>
                                            
                                        <View style={[styles.sortBar, {backgroundColor: theme?.horizon}]}>
                                            <TouchableOpacity 
                                                onPress={backAction}
                                                style={[styles.backBtn, {borderColor: theme?.white}]}
                                            >
                                                <MaterialCommunityIcons name="arrow-left" size={25} color={theme?.white} />
                                            </TouchableOpacity>
                                            <SortingBar onSortOptionSelected={(option) => handleSortItem(option)} />
                                            <FilterBar onFilterApply={(priceRange) => handlePriceFilter(priceRange)} />
                                        </View>
                                        </>
                                    </TouchableWithoutFeedback>
                                ) }
                                {/* end of sorting bar */}
                                <CardProducts
                                    productData={filteredProducts.length > 0 ? filteredProducts : products}
                                    onEndReached={handleLoadMore}
                                    hasMore={hasMore}
                                    onScroll={Animated.event(
                                        [{ nativeEvent: { contentOffset: { y: scrollY } } }],
                                        { useNativeDriver: false }
                                    )}
                                />
                                {resultNotFound === true &&
                                    <View style={{
                                        width: '100%',
                                        height: "100%",
                                        justifyContent: 'center',
                                    }}>
                                        <ListItem
                                            title="No result found"
                                            subtitle="Try searching with another keyword"
                                            style={{ color: theme?.white, fontSize: 18, fontWeight: "bold" }}
                                            IconComponent={
                                                <MaterialCommunityIcons name="alert-circle" size={35} color={theme?.punch} />
                                            }
                                        />
                                    </View>}
                                {productLoaded === false &&
                                    <View style={{
                                        width: '100%',
                                        height: "100%",
                                        justifyContent: 'center',
                                    }}>
                                        <ListItem
                                            title="No product loaded"
                                            subtitle="There was an error loading products, please try again later."
                                            style={{ color: theme?.white, fontSize: 18, fontWeight: "bold" }}
                                            IconComponent={
                                                <MaterialCommunityIcons name="alert-circle" size={35} color={theme?.punch} />
                                            }
                                        />
                                    </View>}
                        </View>
                        )}
                    </Animated.View>
                    {/* end of main body */}
                </Animated.View>
            </Screen>
        )
    }

    const styles = StyleSheet.create({
        iconBox: {
            flexDirection: "row",
            gap: 20,
        },
        main: {
            flex: 1,
            paddingBottom: 0,
        },
        navbar: {
            width: '100%',
            height: 30,
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            paddingHorizontal: 15,
        },
        topBarContainer: {
            width: '100%',
            height: "20%",
            gap: 15,
            justifyContent: 'flex-start',
            alignItems: 'center',
        },
        backBtn: {
            justifyContent: 'center',
            alignItems: 'center',
            borderRadius: 20,
            position: 'absolute',
            top: 8,
            left: 5,
            borderWidth: 2,
            padding: 5,

        },
        sortBar: {
            width: '100%',
            height: 45,
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
            gap: 12,
            paddingHorizontal: 15,
            paddingVertical: 30,
        },
    });

    export default ProductsScreen;
