import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';

import AppText from '../AppText';
import { useTheme } from '../../utils/ThemeContext';

const FavStoreInfo = (props) => {
  const { theme } = useTheme();
  return (
    <ScrollView style={[styles.container, {backgroundColor: theme?.midnight}]}>
      <View style={{paddingBottom: 80}}>
        <AppText style={styles.head} color={theme?.amberGlow}>Favorite Store Feature</AppText>
        <AppText style={styles.details}>With Shopwit, you have the power to save your favorite stores for quick access and personalized shopping experience. Sign up/register for free to use Favorite.</AppText>

        <AppText style={styles.head} color={theme?.amberGlow}>Save Your Favorite Stores</AppText>
        <AppText style={styles.details}>When you come across a store that consistently offers the products you love or unbeatable deals, you can save it to your Favorite Stores list. This allows you to keep all your preferred stores in one place, so you can easily search for products within those stores whenever you like.</AppText>

        <AppText style={styles.head} color={theme?.amberGlow}>Search Within Favorite Stores</AppText>
        <AppText style={styles.details}>Once you've added stores to your favorites, you can search directly within those stores for specific products. This feature helps you save time by narrowing your search to just your trusted stores.</AppText>

        <AppText style={styles.head} color={theme?.amberGlow}>Add to Cart</AppText>
        <AppText style={styles.details}>Purchases that you are not ready to buy right away can be saved to cart. This gives shoppers enough time to rethink their purchases. To remove a product from your cart, just swipe it to the left then press the trash/delete container. Sign up/register for free to add to Cart.</AppText>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '90%',
    height: '100%',
    padding: 10,
    borderRadius: 10,
  },
  head: {
    fontSize: 18,
    fontWeight: 'bold',
    textTransform: 'uppercase',
    textAlign: 'center',
  },
  details: {
    fontSize: 14,
    marginBottom: 10,
  }
});

export default FavStoreInfo;