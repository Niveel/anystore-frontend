import { FlatList, ActivityIndicator, View, Text, AccessibilityInfo } from 'react-native';
import React, { useState, useEffect } from 'react';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import ProductCard from './ProductCard';
import routes from '../navigation/routes';
import { addToCart } from '../hooks/utils';

const CardProducts = ({ productData, onEndReached, hasMore }) => {
  const navigation = useNavigation();
  const [cartItemAdded, setCartItemAdded] = useState([]);
  const [loadingAnnouncement, setLoadingAnnouncement] = useState('');

  useEffect(() => {
    fetchCartItems();
  }, []);

  useEffect(() => {
    if (hasMore) {
      setLoadingAnnouncement('Loading products...');
      AccessibilityInfo.announceForAccessibility(loadingAnnouncement);
    } else {
      setLoadingAnnouncement('Products loaded');
      AccessibilityInfo.announceForAccessibility(loadingAnnouncement);
    }
  }, [hasMore]);

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
    addToCart(product);
  };

  const priceRegex = (price) => {
    return price.replace(/\$/g, '').replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  };

  return (
    <FlatList
      data={productData}
      keyExtractor={(product) => product?.id?.toString()}
      windowSize={10}
      initialNumToRender={15}
      maxToRenderPerBatch={10}
      updateCellsBatchingPeriod={100}
      removeClippedSubviews={true}
      renderItem={({ item }) => (
        <ProductCard
          name={item?.title}
          price={priceRegex(item?.price)}
          image={item?.images || ["https://img.freepik.com/free-vector/illustration-gallery-icon_53876-27002.jpg?size=626&ext=jpg&ga=GA1.1.1700460183.1713139200&semt=ais"]}
          desc={item?.description}
          companyName={item?.shop_name}
          addToCart
          addToCartOnPress={() => handleAddToCart(item)}
          onPress={() => handleProductPress(item)}
          buyPress={() => console.log("Buy Now pressed")}
        />
      )}
      onEndReached={onEndReached}
      onEndReachedThreshold={0.5}
      ListFooterComponent={hasMore ? (
        <View
          accessible={true}
          accessibilityLabel="Loading products"
          accessibilityLiveRegion="assertive"
          importantForAccessibility="yes"
        >
          <ActivityIndicator size="large" color="orange" />
          <Text style={{ display: 'none' }}>{loadingAnnouncement}</Text>
        </View>
      ) : null}
    />
  );
};

export default CardProducts;
