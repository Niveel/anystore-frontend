import {
  View,
  StyleSheet,
  Image,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import React, {useEffect, useState} from "react";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";

import AppText from "./AppText";
import { useTheme } from "../utils/ThemeContext";
import routes from "../navigation/routes";
import useAuth from "../auth/useAuth";
import { addToCart } from "../hooks/utils";

const { width, height } = Dimensions.get("window");

const ProductCard = ({
  name,
  image,
  desc,
  price,
  companyName,
  onPress,
  addToCartVisible,
  addToCartOnPress,
  rating,
  item,
  ...otherPops
}) => {
  const [cartItemAdded, setCartItemAdded] = useState([]);
  const { theme } = useTheme();
  const navigation = useNavigation();

  const { user } = useAuth();

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

  useEffect(() => {
    fetchCartItems();
  }, []);

  const handleProductPress = (item) => {
    navigation.navigate(routes.PRODUCT_DETAILS, item);
    navigation.setOptions({
      headerTitle: item?.shop_name,
    });
  };

  const priceRegex = (price) => {
    return price.replace(/\$/g, "").replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  return (
    <TouchableOpacity
      activeOpacity={0.9}
      style={styles.card}
      onPress={()=> handleProductPress(item)}
      {...otherPops}
      accessible={true}
      accessibilityLabel={name}
    >
      {/* image */}
      <View style={[styles.imgBox, {backgroundColor: theme?.misty}]}>
        <Image source={{uri: image ? image[0] : "https://img.freepik.com/free-vector/illustration-gallery-icon_53876-27002.jpg?size=626&ext=jpg&ga=GA1.1.1700460183.1713139200&semt=ais" }} style={styles.image} />
      </View>
      {/* end of image */}
      {/* details */}
      <View style={[styles.details, {backgroundColor: theme?.midnight, shadowColor: theme?.black}]}>
        {/* add to cart */}
      {addToCartVisible && (
        <TouchableOpacity
          style={[styles.addToCartButton, {backgroundColor: theme?.misty}]}
          onPress={() => handleAddToCart(item)}
          accessible={true}
          accessibilityLabel="Add to cart"
          accessibilityHint={`Double tap to add ${name} to cart`}
        >
          <MaterialCommunityIcons name="cart-plus" color={theme?.amberGlow} size={16} />
        </TouchableOpacity>
      )}
      {/* end of add to cart */}
        <AppText style={{fontSize: 11,}} color={theme?.black} numberOfLines={2}>{name}</AppText>
        <AppText style={{fontSize: 12, textDecorationLine: "underline"}} color={theme?.horizon}>${priceRegex(price)}</AppText>
        <View style={{flexDirection: "row", alignItems: "center"}}>
          <MaterialCommunityIcons name="star" size={15} color={theme?.amberGlow} />
          <AppText style={{fontSize: 12,}} >{rating}</AppText>
        </View>
        <AppText style={{fontSize: 10,}} numberOfLines={1}>Store: <AppText style={{fontSize: 10,}} color={theme?.horizon}>{companyName}</AppText></AppText>
      </View>
      {/* end of details */}
    </TouchableOpacity>

  );
};

const styles = StyleSheet.create({
  card: {
    width: width > 250 ? width / 2.16: width / 2.2,
    height: height > 650 ? height / 3.5 : height / 4.5,
    margin: 5,
    justifyContent: "center",
    alignItems: "center",
  },
  image: {
    width: "100%",
    height: "100%",
    resizeMode: "contain",
    borderRadius: 7,
  },
  imgBox: {
    width: "100%",
    height: "50%",
    backgroundColor: "blue",
    padding: 5,
    borderRadius: 10,
  },
  details: {
    height: "50%",
    width: "95%",
    padding: 4,
    marginTop: -8,
    borderRadius: 10,
    elevation: 4,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    justifyContent: "space-between",
  },
  addToCartButton: {
    position: "absolute",
    top: 38,
    right: 5,
    width: 30,
    height: 30,
    borderRadius: 15,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 2,
  },
  
});
export default ProductCard;
