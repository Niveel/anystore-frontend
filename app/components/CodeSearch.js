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
      style={[styles.searchBar, {backgroundColor: theme?.light,}]}
      onPress={handleCodeSearch}
      underlayColor={theme.lighter}
    >
      <AppText>Search by Barcode / QR Code</AppText>
    </TouchableHighlight>
  );
};

const styles = StyleSheet.create({
  searchBar: {
    width: '90%',
    alignSelf: 'center',
    height: 45,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 5,
  },
});

export default CodeSearch;

