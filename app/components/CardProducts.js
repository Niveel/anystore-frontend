import { FlatList, Alert } from 'react-native'
import React, {useState, useEffect} from 'react'
import { useNavigation } from '@react-navigation/native'
import AsyncStorage from '@react-native-async-storage/async-storage'; 

import ProductCard from './ProductCard'
import routes from '../navigation/routes'
import {addToCart} from '../hooks/utils'

const CardProducts = ({productData}) => {
  const navigation = useNavigation()
  const [cartItemAdded, setCartItemAdded] = useState([]);

  useEffect(() => {
    fetchCartItems();
  }, []);

  const handleProductPress = (item) => {
    navigation.navigate(routes.PRODUCT_DETAILS, item);
    navigation.setOptions({
      headerTitle: item?.websiteName,
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

  // regex to remove 'www.' and '.com' from websiteName
  const websiteNameRegex = (name) => {
    return name.replace(/www.|.com/g, '');
  };

  return (
        <FlatList 
            data={productData}
            keyExtractor={(product) => product?.id?.toString()}
            renderItem={({item}) => (
               <ProductCard 
                    name={item?.title}
                    price={item?.price}
                    image={item?.imageUrl || "https://img.freepik.com/free-vector/illustration-gallery-icon_53876-27002.jpg?size=626&ext=jpg&ga=GA1.1.1700460183.1713139200&semt=ais"}
                    desc={item?.websiteDescription}
                    companyName={websiteNameRegex(item?.websiteName)}
                    addToCart
                    addToCartOnPress={() => handleAddToCart(item)}
                    onPress={() => handleProductPress(item)}
                    buyPress={() => console.log("Buy Now pressed")}
                />
            )} 
        />
  )
}
export default CardProducts 