import { Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage'; 

export const addToCart = async (product) => {
  try {
    // Retrieve existing cart items from AsyncStorage
    const existingCartItems = await AsyncStorage.getItem('cartItems');
    const parsedExistingCartItems = JSON.parse(existingCartItems) || [];

    // Check if the product is already in the cart
    const isProductInCart = parsedExistingCartItems.some(
      (item) => item.id === product.id
    );

    if (isProductInCart) {
      // Product is already in the cart
      Alert.alert('Product is already in the cart');
      return;
    }

    // Add the new product to the cart
    const updatedCartItems = [...parsedExistingCartItems, product];
    await AsyncStorage.setItem('cartItems', JSON.stringify(updatedCartItems));
    Alert.alert('Product added to cart');
  } catch (error) {
    console.error('Error adding product to cart:', error);
  }
};
