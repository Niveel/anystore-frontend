import { View, Text, StyleSheet, ActivityIndicator } from 'react-native'
import { MaterialCommunityIcons } from '@expo/vector-icons'
import React, { useState, } from 'react'
import { TouchableOpacity, Keyboard } from 'react-native'
import { useNavigation } from '@react-navigation/native'
import axios from 'axios'

import Screen from '../components/Screen'
import CodeSearch from '../components/CodeSearch'
import SearchInput from '../components/SearchInput'
import routes from '../navigation/routes'
import CardProducts from '../components/CardProducts'
import ListItem from '../components/ListItem'
import { useTheme } from '../utils/ThemeContext'

const ProductsScreen = () => {
    const [searchText, setSearchText] = useState("")
    const [products, setProducts] = useState([])
    const [resultNotFound, setResultNotFound] = useState(false)
    const [loading, setLoading] = useState(false)
    const [productLoaded, setProductLoaded] = useState(true)
    const navigation = useNavigation()
    const { theme } = useTheme();

    // generate random id
    const generateRandomId = () => {
        return Math.floor(Math.random() * 1000000)
    }

    const handleSearch = () => {
        setProducts([])
        setLoading(true)
        setProductLoaded(true)
        Keyboard.dismiss() 

        axios.get(`https://ishopwit.com/api/search/products/?query=${searchText}`, {
            timeout: 10000
        })
            .then(res => {
                const result = res?.data.map(product => ({ ...product, id: generateRandomId() }));
                setProducts([...result])
                setLoading(false)
                setProductLoaded(true)

                if (result.length === 0) {
                    setResultNotFound(true)
                } else {
                    setResultNotFound(false)
                }

            })
            .catch(err => {
                console.log("error getting products", err)
                if(err.response) {
                    console.log("error response", err.response.data)
                } else if(err.request) {
                    console.log("error request", err.request)
                } else {
                    console.log("error message", err.message)
                }
                setLoading(false)
                setProductLoaded(false)
            })
    }

    const handleFavorite = () => {
        navigation.navigate(routes.FAVORITES)
    }

    const handleCart = () => {
        navigation.navigate(routes.CART)
    }

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
            <View style={[styles.mainBody, {backgroundColor: theme?.horizon,}]}>
                 <ActivityIndicator 
                    animating={loading} 
                    size="large"
                />
                <CardProducts
                    productData={products}
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
