import { StyleSheet } from 'react-native';
import React from 'react';
import { TouchableHighlight } from 'react-native';
import { useNavigation } from '@react-navigation/native';

import AppText from './AppText';
import { useTheme } from '../utils/ThemeContext';

const CodeSearch = () => {
  const navigation = useNavigation();
  const { theme } = useTheme();

  const handleCodeSearch = () => {
    navigation.navigate('BarcodeScreen');
  };

  return (
    <TouchableHighlight
      style={[styles.searchBar, {backgroundColor: theme?.horizon,}]}
      onPress={handleCodeSearch}
      underlayColor={theme.lighter}
    >
      <AppText style={styles.text} color={theme?.white}>Search by Barcode / QR Code</AppText>
    </TouchableHighlight>
  );
};

const styles = StyleSheet.create({
  searchBar: {
    alignSelf: 'center',
    paddingVertical: 8,
    paddingHorizontal: 16,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 30,
  },
  text: {
    fontSize: 14,
  },
});

export default CodeSearch;

