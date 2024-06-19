import React, {useState, useEffect} from 'react';
import { View, StyleSheet, Linking, Alert, TouchableOpacity} from 'react-native';
import { BarCodeScanner } from 'expo-barcode-scanner';
import {MaterialCommunityIcons} from '@expo/vector-icons';

import AppButton from '../components/AppButton';
import AppText from '../components/AppText';
import Screen from '../components/Screen';
import CustomModal from '../components/CustomModal';
import { useTheme } from '../utils/ThemeContext';

function BarcodeScreen({navigation}) {
    const [hasPermission, setHasPermission] = useState(null);
    const [scanned, setScanned] = useState(false);
    const [isScannedComplete, setIsScannedComplete] = useState(false);
    const [scannedData, setScannedData] = useState(null);
    const {theme} = useTheme()

    const goHome = () => {
      navigation.navigate('Product');
    }

    const getBarCodeScannerPermissions = async () => {
        try {
        const { status } = await BarCodeScanner.requestPermissionsAsync();
        setHasPermission(status === 'granted');
        } catch (error) {
        console.log("Error asking for permission",error);
        }
    };

    useEffect(() => {
        getBarCodeScannerPermissions();
    }, []);

    const handleBarCodeScanned = ({ type, data }) => {
        setScanned(true);
        setScannedData(data);
        setIsScannedComplete(true);
      };

      if (hasPermission === null) {
        return <AppText>Requesting for camera permission</AppText>;
      }
      if (hasPermission === false) {
        return <AppText>No access to camera</AppText>;
      }

      const openLink = async (url) => {
        if (url) {
          const supported = await Linking.canOpenURL(url);
          if (supported) {
            await Linking.openURL(url);
          } else {
            Alert.alert(`Product not found!`);
          }
        } else {
          console.error('Attempted to open an undefined URL');
        }
      }

    return (
        <Screen style={{backgroundColor: theme?.midnight,}}>
          <View style={{
            backgroundColor: theme?.horizon,
            padding: 5,
            width: "100%",
            gap: 20,
            alignItems: 'center',
            flexDirection: 'row',
          }}>
            <TouchableOpacity onPress={goHome}>
              <MaterialCommunityIcons name="arrow-left" size={30} color={theme?.amberGlow} />
            </TouchableOpacity>
            <View style={{
              flexDirection: 'row',
              alignItems: 'center',
              gap: 10,
            }}>
              <MaterialCommunityIcons name="barcode-scan" size={30} color={theme?.amberGlow} style={{alignSelf: 'center'}} />
              <AppText style={{color: theme?.white, fontSize: 18, textAlign: "center", marginVertical: 10}}>Barcode Scanner</AppText>
            </View>
          </View>
          <View style={styles.container}>
              <BarCodeScanner
              onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
              style={{width: "100%", height: "100%"}}
              />
              {!scanned && <AppText style={{color: theme?.white, textAlign: "center", fontSize: 14, marginVertical: 10}}>Point your camera at the BAR/QR Code</AppText>}
              {scanned && <AppButton title={'Tap to Scan Again'} style={{
                marginTop: 20,
              }} onPress={() => setScanned(false)} />}
          </View>
            
            {/* modal when scan is complete */}
            <CustomModal
              visible={isScannedComplete}
              onPress={() => setIsScannedComplete(false)}
            >
              <View>
                <View>
                  <AppText style={{color: theme?.white, fontSize: 18, textAlign: "center"}}>Scan Complete</AppText>
                  <AppText style={{color: theme?.white, fontSize: 16, textAlign: "center"}}>Scanned Data: {scannedData}</AppText>
                  <AppButton title={'Open Link'} style={{
                    marginTop: 20,
                  }} onPress={() => openLink(scannedData)} />
                </View>
              </View>
            </CustomModal>
            {/* end of modal when scan is complete */}
        </Screen>
    );
    }

const styles = StyleSheet.create({
  container: {
    width: "100%",
    height: 400,
    alignSelf: 'center',
    padding: 10,
  },
});

export default BarcodeScreen;