import React, { useEffect, useState } from 'react';
import { View, StyleSheet, TouchableHighlight, Linking } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

// custom imports
import Screen from '../components/Screen';
import AppText from '../components/AppText';
import { useBarcodePolicy } from '../config/BarcodeContext';
import { useTheme } from '../utils/ThemeContext';

function BarcodePolicyScreen({ navigation }) {
  const { setBarcodeCameraAllow } = useBarcodePolicy();
  const { theme } = useTheme();
  const [policyChecked, setPolicyChecked] = useState(false);

  // Effect to check if the policy has already been accepted
  useEffect(() => {
    const checkPolicyStatus = async () => {
      try {
        const policyStatus = await AsyncStorage.getItem('policyAccepted');
        
        if (policyStatus === 'true') {
          navigation.goBack();
        } else {
          setPolicyChecked(true); 
        }
      } catch (error) {
        console.error('Error reading policy status from AsyncStorage:', error);
      }
    };

    checkPolicyStatus();
  }, []);

  const disallowPolicy = async () => {
    try {
      await AsyncStorage.removeItem('policyAccepted');
      setBarcodeCameraAllow(false);
      navigation.goBack();
    } catch (error) {
      console.error('Error handling disallow policy:', error);
    }
  };

  const allowPolicy = async () => {
    try {
      await AsyncStorage.setItem('policyAccepted', 'true');
      setBarcodeCameraAllow(true); 
      navigation.goBack();
    } catch (error) {
      console.error('Error handling allow policy:', error);
    }
  };  

  const openPrivacyPolicy = () => {
    Linking.openURL('https://www.niveel.com/privacy/');
  };


  if (!policyChecked) {
    return null;
  }

  return (
    <Screen style={[styles.screen, { backgroundColor: theme?.midnight }]}>
      <View style={[styles.container, { backgroundColor: theme?.horizon }]}>
        <AppText style={styles.text}>
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
          <AppText style={{ color: theme?.amberGlow, textDecorationLine: 'underline' }}>
            Privacy Policy
          </AppText>
        </TouchableHighlight>
        <View style={styles.wrapper}>
          <TouchableHighlight
            style={[styles.button, { backgroundColor: theme?.punch }]}
            underlayColor="rgba(250,0,0,0.7)"
            onPress={disallowPolicy}
          >
            <AppText>Disagree</AppText>
          </TouchableHighlight>
          <TouchableHighlight
            style={[styles.button, { backgroundColor: theme?.amberGlow }]}
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
  },
  screen: {
    padding: 10,
    justifyContent: 'center',
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
