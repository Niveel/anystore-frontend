import React from 'react';
import { View, StyleSheet, TouchableHighlight } from 'react-native';

// custom imports
import Screen from '../components/Screen';
import colors from '../config/colors';
import AppText from '../components/AppText';
import {useBarcodePolicy} from '../config/BarcodeContext';

function BarcodePolicyScreen({navigation}) {

  const {setBarcodeCameraAllow} = useBarcodePolicy();

  const disallowPolicy = () => {
    setBarcodeCameraAllow(false);
    navigation.goBack();
  }

  const allowPolicy = () => {
    setBarcodeCameraAllow(true);
    navigation.navigate('BarcodeScreen');
  }

  return (
    <Screen style={styles.screen}>
      <View style={styles.container}>
          <AppText style={styles.text}>Shopwit needs your camera access. Alternatively to a keyword search, you can do QR/Bar code search. Your camera will only be used to scan Bar/QR code. Click next to allow or disallow. Clicking allow means you consent to Shopwit to access your camera only to do a Bar/QR code scan and search. You will need to point your camera to a Bar/QR code for the scan and search to work.</AppText>
        <View style={styles.wrapper}>
          <TouchableHighlight 
            style={[styles.button, styles.disallow]}
            underlayColor="rgba(250,0,0,0.7)"
            onPress={disallowPolicy}
          >
            <AppText>Disallow</AppText>
          </TouchableHighlight>
          <TouchableHighlight 
            style={[styles.button, styles.allow]}
            onPress={allowPolicy}
            underlayColor="rgba(0,250,0,0.6)"
          >
            <AppText>Allow</AppText>
          </TouchableHighlight>
        </View>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  allow: {
    backgroundColor: colors.amberGlow,
  },
  button: {
    width: '48%',
    paddingVertical: 5,
    paddingHorizontal: 10,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 5,
  },
  disallow: {
    backgroundColor: colors.punch,
  },
  container: {
    backgroundColor: colors.horizon,
    padding: 10,
    borderRadius: 5,
  },
  screen: {
    backgroundColor: colors.midnight,
    padding: 10,
    justifyContent: "center",
  },
  text: {
    marginBottom: 10,
    fontSize: 15,
    textAlign: 'center',
    lineHeight: 17,
  },
  wrapper: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 10,
  },
});

export default BarcodePolicyScreen;