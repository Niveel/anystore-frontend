import React from 'react';
import { View, StyleSheet } from 'react-native';
import Constants  from 'expo-constants';
import {useNetInfo} from '@react-native-community/netinfo'

import colors from '../config/colors';
import AppText from './AppText';
import Screen from './Screen';
import Icon from './Icon';

function OfflineNotice(props) {
  const  netInfo = useNetInfo()
    if(netInfo.type !== 'unknown' && netInfo.isInternetReachable === false)
        return (
            <Screen style={styles.screen}>
                <View style={styles.container}>
                    <Icon name='wifi-off' backgroundColor={colors.punch} color={colors.amberGlow} size={45} />
                    <AppText style={styles.text}>No Internet Connection</AppText>
                    <AppText style={styles.text}>Please check your connection</AppText>
                    <AppText style={styles.infoText}>you need an Internet connection to use Anystore.</AppText>
                </View>
            </Screen>
        );
    return null
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    backgroundColor: colors.punch,
    height: 160,
    justifyContent: 'center',
    position: 'absolute',
    top: Constants.statusBarHeight,
    width: '100%',
    zIndex: 100,
    borderRadius: 5,
  },
    infoText: {
        color: colors.white,
        fontSize: 12,
        fontWeight: 'bold',
        textAlign: "center",
        marginVertical: 5,
    },
    text: {
        color: colors.white,
        fontSize: 16,
        fontWeight: 'bold',
    },
    screen: {
        backgroundColor: colors.midnight,
        padding: 10,
        minHeight: "100%"
    },
});

export default OfflineNotice;