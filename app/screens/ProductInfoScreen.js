import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';

import Screen from '../components/Screen';
import AppText from '../components/AppText';
import colors from '../config/colors';

function ProductInfoScreen({route}) {

  const details = route.params.productDetails;

  return (
      <Screen style={styles.screen}>
        <ScrollView>
            <View>
                <AppText>{details}</AppText>
            </View>
        </ScrollView>
      </Screen>
  );
}

const styles = StyleSheet.create({
  screen: {
    padding: 10,
    backgroundColor: colors.midnight,
  },
});

export default ProductInfoScreen;