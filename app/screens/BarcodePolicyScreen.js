import React from 'react';
import { View, StyleSheet, TouchableHighlight, Linking } from 'react-native';

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
    navigation.goBack();
  }

  const openPrivacyPolicy = () => {
    Linking.openURL('https://www.niveel.com/privacy/');
  }

  return (
    <Screen style={styles.screen}>
      <View style={styles.container}>
          <AppText style={styles.text}>You are responsible for content you post on the App. You agree not to post content that is illegal, harmful, or violates any third-party rights. Depending on the severity of the content, Shopwit reserves the rights to flag such content, warn or remove you from the platform for such behavior. You have the right to report users that indulge in such behavior too. You can also choose to exit any group chat that you dislike or find offensive. To learn more visit our privacy policy:</AppText>
          <TouchableHighlight
            onPress={openPrivacyPolicy}
            underlayColor="rgba(250,250,250,0.08)"
            style={{
              textAlign: 'center',
              alignSelf: 'center',
              padding: 5,
              borderRadius: 5,
            }}
          >
            <AppText style={{color: colors.amberGlow}}>Privacy Policy</AppText>
          </TouchableHighlight>
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