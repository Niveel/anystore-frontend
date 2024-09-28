import React, {useState, useEffect} from 'react';
import { View, StyleSheet, FlatList, Dimensions} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import TitleBar from './TitleBar';
import ProductCard from './ProductCard';
import {products} from '../dummyData'
import routes from '../navigation/routes';
import { addToCart } from '../hooks/utils';
import useAuth from '../auth/useAuth';

const { width } = Dimensions.get("window");

const Trending = (props) => {
  const navigation = useNavigation();
  const [cartItemAdded, setCartItemAdded] = useState([]);

  const { user } = useAuth();

  const handleProductPress = (item) => {
    navigation.navigate(routes.PRODUCT_DETAILS, item);
    navigation.setOptions({
      headerTitle: item?.shop_name,
    });
  };

  const fetchCartItems = async () => {
    try {
      const existingCartItems = await AsyncStorage.getItem('cartItems');
      const parsedExistingCartItems = JSON.parse(existingCartItems) || [];
      setCartItemAdded(parsedExistingCartItems);
    } catch (error) {
      console.error('Error fetching cart items:', error);
    }
  };

  const handleAddToCart = async (product) => {
    if (!user) {
      navigation.navigate("Auth", { screen: 'Login' })
      return;
    } else {
      addToCart(product);
    }
  };

  const priceRegex = (price) => {
    return price.replace(/\$/g, '').replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  };

  useEffect(() => {
    fetchCartItems();
  }, []);

  return (
    <View style={styles.container}>
      <TitleBar title="Trending" />

      <FlatList
        data={products}
        keyExtractor={(product) => product.id.toString()}
        renderItem={({ item }) => (
          <ProductCard
            name={item.title}
            desc={item.desc}
            price={priceRegex(item.price)}
            companyName={item.companyName}
            image={item.images}
            rating={item.rating}
            addToCart
            addToCartOnPress={() => handleAddToCart(item)}
            onPress={() => handleProductPress(item)}
          />
        )}
        numColumns={width > 300 ? 3: 2}
        contentContainerStyle={{
          padding: 5, 
          justifyContent: 'center',
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {}
});

export default Trending;
