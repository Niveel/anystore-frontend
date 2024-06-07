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
          <AppText style={styles.text}>Shopwit needs your camera access. The app extracts QR/Bar Code information to search for the product and display the results similar to a keyword search. Shopwit does not save anything related to the QR/Bar Code or the search results on our server. This is just to provide users with alternative way to a keyword search. The camera will only be used to scan Bar/QR Code. Click next to allow or disallow. Clicking allow is a consent to Shopwit to access your camera only to do a Bar/QR Code scan and search. You will need to point your camera to a Bar/QR Code for the scan and search to work. For example, if you want to search for a particular type of water, instead of typing the long name of the manufacturer or the trade name, pointing the camera to the QR/Bar Code on the bottle of the water will generate the same search results as typing a keyword.</AppText>
        <View style={styles.wrapper}>
          <TouchableHighlight 
            style={[styles.button, styles.disallow]}
            underlayColor="rgba(250,0,0,0.7)"
            onPress={disallowPolicy}
          >
            <AppText>Disagree</AppText>
          </TouchableHighlight>
          <TouchableHighlight 
            style={[styles.button, styles.allow]}
            onPress={allowPolicy}
            underlayColor="rgba(0,250,0,0.6)"
          >
            <AppText>Agree</AppText>
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