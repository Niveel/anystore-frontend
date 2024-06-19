import React from 'react';
import { View, StyleSheet } from 'react-native';
import Constants  from 'expo-constants';
import {useNetInfo} from '@react-native-community/netinfo'

import { useTheme } from '../utils/ThemeContext';
import AppText from './AppText';
import Screen from './Screen';
import Icon from './Icon';

function OfflineNotice(props) {
    const {theme} = useTheme()
  const  netInfo = useNetInfo()

    if(netInfo.type !== 'unknown' && netInfo.isInternetReachable === false)
        return (
            <Screen style={[styles.screen, {backgroundColor: theme?.midnight,}]}>
                <View style={[styles.container, {backgroundColor: theme?.punch,}]}>
                    <Icon name='wifi-off' backgroundColor={theme?.punch} color={theme?.amberGlow} size={45} />
                    <AppText style={[styles.text, {color: theme?.white,}]}>No Internet Connection</AppText>
                    <AppText style={[styles.text, {color: theme?.white,}]}>Please check your connection</AppText>
                    <AppText style={[styles.infoText, {color: theme?.white,}]}>you need an Internet connection to use Anystore.</AppText>
                </View>
            </Screen>
        );
    return null
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    height: 160,
    justifyContent: 'center',
    position: 'absolute',
    top: Constants.statusBarHeight,
    width: '100%',
    zIndex: 100,
    borderRadius: 5,
  },
    infoText: {
        fontSize: 12,
        fontWeight: 'bold',
        textAlign: "center",
        marginVertical: 5,
    },
    text: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    screen: {
        padding: 10,
        minHeight: "100%"
    },
});

export default OfflineNotice;