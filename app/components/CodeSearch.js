import { StyleSheet } from 'react-native';
import React from 'react';
import { TouchableHighlight } from 'react-native';
import { useNavigation } from '@react-navigation/native';

import AppText from './AppText';
import colors from '../config/colors';
import { useBarcodePolicy } from '../config/BarcodeContext';

const CodeSearch = () => {
  const navigation = useNavigation();
  const { barcodeCameraAllow } = useBarcodePolicy();

  const handleCodeSearch = () => {
    if(!barcodeCameraAllow){
      navigation.navigate('BarcodePolicyScreen');
      return;
    }
    navigation.navigate('BarcodeScreen');
  };



  return (
    <TouchableHighlight
      style={styles.searchBar}
      onPress={handleCodeSearch}
      underlayColor={colors.lighter}
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
    backgroundColor: colors.light,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 5,
  },
});

export default CodeSearch;

