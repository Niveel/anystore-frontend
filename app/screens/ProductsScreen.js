import React, { useState, useEffect} from 'react'
import { View, Text, StyleSheet, Platform } from 'react-native'
import { MaterialCommunityIcons } from '@expo/vector-icons'
import { TouchableOpacity, Keyboard, ToastAndroid } from 'react-native'
import { useNavigation } from '@react-navigation/native'
import axios from 'axios'
import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import Constants from 'expo-constants';

import Screen from '../components/Screen'
import CodeSearch from '../components/CodeSearch'
import SearchInput from '../components/SearchInput'
import routes from '../navigation/routes'
import CardProducts from '../components/CardProducts'
import ListItem from '../components/ListItem'
import { useTheme } from '../utils/ThemeContext'
import SortingBar from '../components/SortingBar'
import FilterBar from '../components/FilterBar'
import useAuth from '../auth/useAuth'
import authStorage from '../auth/storage'
import registerDeviceToken from '../api/registerDeviceToken'

// notifications
Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: true,
      shouldPlaySound: false,
      shouldSetBadge: false,
    }),
});

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
        const navigation = useNavigation()
        const { theme } = useTheme();
        const { user } = useAuth();

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

        const handleFavorite = () => {
            navigation.navigate(routes.FAVORITES)
        }

        const handleCart = () => {
            navigation.navigate(routes.CART)
        }

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

        // notifications====================
        // getting auth token
        authStorage.getToken().then(token => {
            setAuthToken(token);
        }).catch(error => {
            console.log("Error getting auth token", error);
        });

        useEffect(() => {
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
                    alert('Could not register your device for push notifications');
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
                {/* top bar */}
                <View style={styles.topBarContainer}>
                    <View style={styles.navbar}>
                        <Text style={{ color: theme?.white, fontSize: 20, fontWeight: '900', marginLeft: 10 }}>Store Search</Text>
                        <View style={styles.iconBox}>
                            <TouchableOpacity
                                onPress={handleFavorite}
                                accessible={true}
                                accessibilityLabel='Favorite stores'
                            >
                                <MaterialCommunityIcons name="heart" size={30} color={theme?.punch} />
                            </TouchableOpacity>
                            <TouchableOpacity
                                onPress={handleCart}
                                accessible={true}
                                accessibilityLabel='Cart'
                            >
                                <MaterialCommunityIcons name="cart" size={30} color={theme?.amberGlow} />
                            </TouchableOpacity>
                        </View>
                    </View>
                    <SearchInput
                        autoCapitalize="none"
                        autoCorrect={false}
                        placeholder="Search Products by Keyword"
                        placeholderTextColor={theme?.misty}
                        onChangeText={text => setSearchText(text)}
                        searchPress={handleSearch}
                    />
                    <CodeSearch />
                </View>
                {/* end of top bar */}
                {/* main body */}
                <View 
                    style={[styles.mainBody, {backgroundColor: theme?.horizon,}]}
                    accessible={true}
                    accessibilityLabel="Products Area."
                >
                    {/* sorting bar */}
                    {products?.length > 0 && (
                        <View style={{
                            width: '100%',
                            height: 50,
                            flexDirection: 'row',
                            justifyContent: 'center',
                            alignItems: 'center',
                            gap: 12,
                            paddingHorizontal: 15,
                            paddingVertical: 30,
                        }}>
                            <SortingBar onSortOptionSelected={(option) => handleSortItem(option)} />
                            <FilterBar onFilterApply={(priceRange) => handlePriceFilter(priceRange)} />
                        </View>
                    ) }
                    {/* end of sorting bar */}
                    <CardProducts
                        productData={filteredProducts.length > 0 ? filteredProducts : products}
                        onEndReached={handleLoadMore}
                        hasMore={hasMore}
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
                {/* end of main body */}
            </Screen>
        )
    }

    const styles = StyleSheet.create({
        iconBox: {
            flexDirection: "row",
            gap: 20,
        },
        mainBody: {
            width: '100%',
            height: '80%',
            marginTop: 35,
            borderTopLeftRadius: 30,
            borderTopRightRadius: 30,
            paddingHorizontal: 15,
            paddingBottom: 85,
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
    });

    export default ProductsScreen;
