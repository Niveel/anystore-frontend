import React, {useState, useEffect} from 'react';
import { View, StyleSheet, FlatList, Keyboard, ActivityIndicator, Platform, ToastAndroid, Dimensions } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import axios from 'axios';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

import ProductCard from '../components/ProductCard';
import SearchInput from './SearchInput';
import { addToCart } from '../hooks/utils';
import ListItem from './ListItem';
import { useTheme } from '../utils/ThemeContext';
import SortingBar from './SortingBar';
import FilterBar from './FilterBar';

const { width } = Dimensions.get('window');

function StoreList() {
    const [storeProducts, setStoreProducts] = useState([])
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [searchText, setSearchText] = useState("")
    const [resultNotFound, setResultNotFound] = useState(false)
    const [loading, setLoading] = useState(false)
    const [cartData, setCartData] = useState([]);
    const [productLoaded, setProductLoaded] = useState(true)

    const navigation = useNavigation()
    const route = useRoute()
    const storeName = route.params.shopName
    const {theme} = useTheme()

    useEffect(() => {
      fetchCartItems();
    }, []); 
    
    const fetchCartItems = async () => {
      try {
        // Retrieve cart items from AsyncStorage
        const cartItems = await AsyncStorage.getItem('cartItems');
        if (cartItems) {
          // If there are items in the cart, parse and set them
          const parsedCartItems = JSON.parse(cartItems);
          setCartData(parsedCartItems);
        }
      } catch (error) {
        console.error('Error fetching cart items:', error);
      } finally {
        // Set loading to false once the data has been fetched
        setLoading(false);
      }
    };

    const websiteNameRegex = (name) => {
      return name.replace(/www.|.com/g, '');
    };

    const generateRandomId = () => {
      return Math.floor(Math.random() * 1000000)
    }

    const handleAddToCart = async (product)=> {
        addToCart(product);
    }

    const handleProductPress = item => {
        navigation.navigate("ProductDetails", item);
    };

    // console.log("store name", storeName)

    const handleSearch = () => {
        setLoading(true)
        setProductLoaded(true)
        Keyboard.dismiss()

        axios.get(`https://imprezbookkeeping.pythonanywhere.com/search-shop/?query=${searchText}&&shop=${storeName}`, {
            timeout: 10000
        })
        .then(res => {
            const result = res.data.map(product => ({ ...product, id: generateRandomId() }));
            const filteredResult = result.filter(product => product.shop_name === storeName);

            setStoreProducts(filteredResult)

            setLoading(false)
            setProductLoaded(true)

            if (filteredResult.length === 0) {
                setResultNotFound(true)
            } else {
                setResultNotFound(false)
            }
        })
        .catch(err => {
            console.log("error getting products",err)
            setLoading(false)
            setProductLoaded(false)
        })

    }

    const priceRegex = (price) => {
      return parseFloat(price.replace(/[^0-9.-]+/g, ""));
  }

  const handleSortItem = (option) => {
      if (option === "highest") {
          setStoreProducts(prevProducts => [...prevProducts].sort((a, b) => priceRegex(b.price) - priceRegex(a.price)));
        } else if (option === "lowest") {
          setStoreProducts(prevProducts => [...prevProducts].sort((a, b) => priceRegex(a.price) - priceRegex(b.price)));
        } else if (option === "highest_rating") {
          setStoreProducts(prevProducts => [...prevProducts].sort((a, b) => b.rating - a.rating));
          console.log("highest rating selected");
        } else if (option === "lowest_rating") {
          setStoreProducts(prevProducts => [...prevProducts].sort((a, b) => a.rating - b.rating));
        }
  }
  const handlePriceFilter = ({ minPrice, maxPrice }) => {
    const min = Number(minPrice);
    const max = Number(maxPrice);
    
    // filter products based on price range
    const filtered = storeProducts.filter(product => {
        const price = priceRegex(product.price);
        return price >= min && price <= max;
    });
    
    setFilteredProducts(filtered);
    // toast when there is no product in the price range
    if (filtered.length === 0) {
      if (Platform.OS === 'ios') {
        alert("No product found in the price range");
      } else {
        ToastAndroid.show("No product found in the price range", ToastAndroid.SHORT);
      }
    }
};

  return (
    <View style={styles.container}>
        <View style={styles.header}>
            <SearchInput 
              placeholder="Search within this Store"  
              placeholderTextColor={theme?.mistyLight}
              searchPress={handleSearch}
              autoCapitalize="none"
              autoCorrect={false}
              iconColor={theme?.misty}
              onChangeText={text => setSearchText(text)}
              // cameraSearchPress={}
            />
        </View>
        {loading && <ActivityIndicator animating={loading} size="large" color={theme?.punch} />}
        {storeProducts?.length > 0 && (
          <View style={{
            width: '100%',
            height: 50,
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
            gap: 12,
            paddingHorizontal: 15,
            paddingVertical: 30,
            backgroundColor: theme?.horizon,
            marginTop: 10,
        }}>
            <SortingBar onSortOptionSelected={(option) => handleSortItem(option)} />
            <FilterBar onFilterApply={(priceRange) => handlePriceFilter(priceRange)} />
        </View>
        )}
         <FlatList 
          style={{ flex: 1,}}
          data={filteredProducts.length > 0 ? filteredProducts : storeProducts}
          keyExtractor={(storeProduct) => storeProduct?.id?.toString() || generateRandomId().toString()}
          numColumns={2}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            paddingBottom: 10,
            paddingTop: 10,
          }}
          renderItem={({item}) => (
              <ProductCard 
                desc={item?.description}
                name={item?.title}
                price={item?.price}
                item={item}
                image={item?.images || ["https://img.freepik.com/free-vector/illustration-gallery-icon_53876-27002.jpg?size=626&ext=jpg&ga=GA1.1.1700460183.1713139200&semt=ais"]}
                companyName={item?.shop_name}
                addToCartVisible
                onPress={() => handleProductPress(item)}
                rating={item?.rating}
                width={width / 2.2}
              />
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
                      style={{color: theme?.text, fontSize: 18, fontWeight: "bold"}}
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
                      style={{color: theme?.midnight, fontSize: 18, fontWeight: "bold"}}
                      IconComponent={
                          <MaterialCommunityIcons name="alert-circle" size={35} color={theme?.punch} />
                      }
                    />
                </View>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 5,
    paddingTop: 0,
    paddingBottom: 50,
    marginTop: 0,
    height: "100%",
  },
  header: {
    marginTop: 0,
    paddingBottom: 5,
    paddingTop: 0,
  },
});

export default StoreList;