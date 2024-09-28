import { FlatList, ActivityIndicator, View, Text, AccessibilityInfo, Animated, Dimensions } from 'react-native';
import React, { useState, useEffect } from 'react';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import ProductCard from './ProductCard';
import routes from '../navigation/routes';
import { addToCart } from '../hooks/utils';
import useAuth from '../auth/useAuth';

const { width } = Dimensions.get("window");

const CardProducts = ({ productData, onEndReached, hasMore, onScroll }) => {
  const navigation = useNavigation();
  const [cartItemAdded, setCartItemAdded] = useState([]);
  const [loadingAnnouncement, setLoadingAnnouncement] = useState('');

  const { user } = useAuth();
  const AnimatedFlatList = Animated.createAnimatedComponent(FlatList);

  useEffect(() => {
    fetchCartItems();
  }, []);

  // accessibility announcement
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

  return (
    <AnimatedFlatList
      data={productData}
      keyExtractor={(product) => product?.id?.toString()}
      windowSize={10}
      initialNumToRender={15}
      maxToRenderPerBatch={10}
      updateCellsBatchingPeriod={100}
      removeClippedSubviews={true}
      onScroll={onScroll}
      renderItem={({ item }) => (
        <ProductCard
          name={item?.title}
          price={priceRegex(item?.price)}
          image={item?.images || ["https://img.freepik.com/free-vector/illustration-gallery-icon_53876-27002.jpg?size=626&ext=jpg&ga=GA1.1.1700460183.1713139200&semt=ais"]}
          desc={item?.description ? item?.description : item?.title}
          companyName={item?.shop_name}
          rating={item?.rating}
          addToCart
          addToCartOnPress={() => handleAddToCart(item)}
          onPress={() => handleProductPress(item)}
        />
      )}
      onEndReached={onEndReached}
      onEndReachedThreshold={0.5}
      numColumns={width > 300 ? 3: 2}
      contentContainerStyle={{
        paddingRight: 5, 
        justifyContent: 'center',
      }}
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
