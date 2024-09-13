import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';

import AppText from '../AppText';
import { useTheme } from '../../utils/ThemeContext';

const Home = (props) => {
  const { theme } = useTheme();
  return (
    <ScrollView style={[styles.container, {backgroundColor: theme?.midnight}]}>
      <View style={{paddingBottom: 80}}>
        <AppText style={styles.head} color={theme?.amberGlow}>About Shopwit</AppText>
        <AppText style={styles.details}>Welcome to Shopwit – your ultimate shopping companion. This app is designed to help you save time and money while searching for products online. This is not a paid app. It is free to use Shopwit.</AppText>

        <AppText style={styles.details}>Shopwit enables you to search for products from multiple online stores with just a few taps. Whether you're looking for electronics, fashion, or everyday essentials, Shopwit compares prices from various eCommerce websites, ensuring you get the best deals available. You can search by a keyword or scan a QR code.</AppText>

        <AppText style={styles.details}>When you find the product you're interested in, Shopwit presents you with a range of prices across different stores. Once you’re ready to purchase, simply tap "Buy Now" to be redirected to the original seller’s website, where you can complete your purchase securely.</AppText>

        <AppText style={styles.head} color={theme?.amberGlow}>Search by QR Code</AppText>
        <AppText style={styles.details}>Another great feature of Shopwit is its QR code scanning capability. If you have a product’s QR code from any physical store or website, just scan it with Shopwit. This feature allows you to quickly find and compare prices for the same product across different online stores without manually searching for it. Sign up/registration is not required to use the search functionality. However, you need to sign up/register to use Shopwit’s additional features such as Crit, Favorite, Radar, etc.</AppText>

        <AppText style={styles.head} color={theme?.amberGlow}>Ask Cafa AI</AppText>
        <AppText style={styles.details}>Get detailed product information by asking our AI chatbot. Cafa provides a polite and knowledgeable answers to questions about every product.</AppText>
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

export default Home;