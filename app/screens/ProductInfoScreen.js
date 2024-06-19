import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';

import Screen from '../components/Screen';
import AppText from '../components/AppText';
import { useTheme } from '../utils/ThemeContext';

function ProductInfoScreen({route}) {

  const details = route.params.productDetails;
  const { theme } = useTheme();

  return (
      <Screen style={[styles.screen, {backgroundColor: theme?.midnight,}]}>
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
  },
});

export default ProductInfoScreen;