import { FlatList, ActivityIndicator, View, StyleSheet } from 'react-native';
import React, { useState, useEffect } from 'react';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import CartItem from './cart/CartItem';
import routes from '../navigation/routes';
import colors from '../config/colors';
import SearchInput from './SearchInput';
import SearchNotFound from './SearchNotFound';
import ItemEmpty from './ItemEmpty';

const CardList = () => { 
  const [cartData, setCartData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [resultNotFound, setResultNotFound] = useState(false);
  const navigation = useNavigation();

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

  const generateRandomId = () => {
    return Math.floor(Math.random() * 1000000)
  }

  const handleDelete = (item) => {
    const newCartData = cartData.filter((i) => i.id !== item.id);
    setCartData(newCartData);
    AsyncStorage.setItem('cartItems', JSON.stringify(newCartData));
  };

  const handleCartItemPress = (item) => {
    navigation.navigate(routes.PRODUCT_DETAILS, item);
  };

  const websiteNameRegex = (name) => {
    return name.replace(/www.|.com/g, '');
  };

  const handleSearch = (text) => {
    setSearchQuery(text);

    if(!text.trim()) {
      setSearchQuery("");
      setResultNotFound(false);
      fetchCartItems();
      return;
    }
    const filteredItems = cartData.filter(item => item?.title.toLowerCase().includes(text.toLowerCase()) || item?.websiteName.toLowerCase().includes(text.toLowerCase()) || item?.websiteDescription.toLowerCase().includes(text.toLowerCase()));

    if(filteredItems.length) {
      setCartData([...filteredItems]);
    } else {
      setResultNotFound(true);
    }
  }


  if (loading) {
    // Display a loading indicator while data is being fetched
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="blue" />
      </View>
    );
  }

  return (
    <View style={{
      height: "100%"
    }}>
    {cartData.length > 0 && <View style={styles.headBox}>
        <SearchInput 
          placeholder="Search Product" 
          placeholderTextColor={colors.amberGlow} 
          value={searchQuery}
          onChangeText={handleSearch}
        />
      </View>}
      {cartData.length === 0 && <ItemEmpty 
                                  icon="cart-remove" 
                                  text="Your cart is empty" 
                                  subText="Add items to your cart to see them here" 
                                />}
    {resultNotFound ? <SearchNotFound /> : <FlatList
        data={cartData}
        keyExtractor={(item, index) => item.id ? item.id.toString() : generateRandomId().toString()}
        renderItem={({ item }) => (
          <CartItem
            companyName={websiteNameRegex(item?.websiteName)}
            desc={item?.websiteDescription}
            image={item?.imageUrl || "https://img.freepik.com/free-vector/illustration-gallery-icon_53876-27002.jpg?size=626&ext=jpg&ga=GA1.1.1700460183.1713139200&semt=ais"}
            name={websiteNameRegex(item?.websiteName)}
            onPress={() => handleCartItemPress(item)}
            price={item?.price}
            delPress={() => handleDelete(item)}
          />
        )}
        refreshing={loading} 
        onRefresh={() => {
          // This will refetch the data from AsyncStorage
          setLoading(true);
          fetchCartItems();
        }}
      />}
    </View>
  );
};

const styles = StyleSheet.create({
    headBox: {
      width: "100%",
      backgroundColor: colors.light,
      padding: 10,
      gap: 5,
      marginBottom: 15,
      borderRadius: 5
  },
  head: {
      fontWeight: "900",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default CardList;
