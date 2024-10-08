import React from 'react';
import { View, StyleSheet, TouchableHighlight } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as WebBrowser from 'expo-web-browser';

// custom imports
import Screen from '../components/Screen';
import AppText from '../components/AppText';
import { useBarcodePolicy } from '../config/BarcodeContext';
import { useTheme } from '../utils/ThemeContext';

function BarcodePolicyScreen({ navigation }) {
  const { theme } = useTheme();
  const { setBarcodeCameraAllow } = useBarcodePolicy();

  const disallowPolicy = async () => {
    try {
      await AsyncStorage.setItem('policyAccepted', 'false');
      navigation.goBack();
    } catch (error) {
      console.error('Error handling disallow policy:', error);
    }
  };

  const allowPolicy = async () => {
    try {
      await AsyncStorage.setItem('policyAccepted', 'true');
      setBarcodeCameraAllow(true);
    } catch (error) {
      console.error('Error handling allow policy:', error);
    }
  };  

  const openPrivacyPolicy = () => {
    WebBrowser.openBrowserAsync('https://www.niveel.com/privacy/');

  };

  const darkModeTextColor = theme?.amberGlow === "#e2521d" ? theme?.text : theme?.white
  const darkModeBgColor = theme?.amberGlow === "#e2521d" ? theme?.midnight : theme?.horizon
  return (
    <Screen 
      style={styles.screen} 
      statusColor={darkModeBgColor}
    >
      <View style={[styles.container, { backgroundColor: darkModeBgColor }]}>
        <AppText style={styles.text} color={darkModeTextColor}>
          You are responsible for content you post on the App. You agree not to post content that is illegal, harmful, or violates any third-party rights. Depending on the severity of the content, Shopwit reserves the rights to flag such content, warn or remove you from the platform for such behavior. You have the right to report users that indulge in such behavior too. You can also choose to exit any group chat that you dislike or find offensive. To learn more visit our privacy policy:
        </AppText>
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
          <AppText style={{ textDecorationLine: 'underline' }} color={darkModeTextColor}>
            Privacy Policy
          </AppText>
        </TouchableHighlight>
        <View style={styles.wrapper}>
          <TouchableHighlight
            style={[styles.button, { backgroundColor: theme?.punch }]}
            underlayColor="rgba(250,0,0,0.7)"
            onPress={disallowPolicy}
          >
            <AppText color={darkModeTextColor}>Disagree</AppText>
          </TouchableHighlight>
          <TouchableHighlight
            style={[styles.button, { backgroundColor: theme?.amberGlow }]}
            onPress={allowPolicy}
            underlayColor="rgba(0,250,0,0.6)"
          >
            <AppText color={darkModeTextColor}>Agree</AppText>
          </TouchableHighlight>
        </View>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  button: {
    width: '48%',
    paddingVertical: 5,
    paddingHorizontal: 10,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 5,
  },
  container: {
    padding: 10,
    borderRadius: 5,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  screen: {
    justifyContent: 'center',
  },
  text: {
    marginBottom: 10,
    fontSize: 15,
    lineHeight: 17,
  },
  wrapper: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 10,
    gap: 10,
    paddingVertical: 20,
  },
});

export default BarcodePolicyScreen;
