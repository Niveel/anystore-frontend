import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';

import AppText from '../AppText';
import { useTheme } from '../../utils/ThemeContext';

const RadarInfo = (props) => {
  const { theme } = useTheme();
  return (
    <ScrollView style={[styles.container, {backgroundColor: theme?.misty}]}>
      <View style={{paddingBottom: 80}}>
        <AppText style={styles.head} color={theme?.amberGlow}>Radar Feature</AppText>
        <AppText style={styles.details} color={theme?.white}>The Radar feature in Shopwit helps you track the price of a product you're interested in and notifies you when it drops to a price you’re comfortable with. It’s like having a personal price watchdog that helps you shop smarter. Sign up/register for free to use Radar.</AppText>
        
        <AppText style={styles.head} color={theme?.amberGlow}>Add a Product to Your Radar</AppText>
        <AppText style={styles.details} color={theme?.white}>When you find a product you love but want to wait for a better deal, you can add it to your Radar. This feature allows you to set a target price, and Shopwit will notify you when the product’s price drops to or below that amount on the original eCommerce site.</AppText>
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

export default RadarInfo;
