import React, {useState, useEffect} from 'react';
import { View, StyleSheet, Linking, Alert} from 'react-native';
import { BarCodeScanner } from 'expo-barcode-scanner';

import AppButton from '../components/AppButton';
import AppText from '../components/AppText';
import colors from '../config/colors';
import Screen from '../components/Screen';
import CustomModal from '../components/CustomModal';

function BarcodeScreen(props) {
    const [hasPermission, setHasPermission] = useState(null);
    const [scanned, setScanned] = useState(false);
    const [isScannedComplete, setIsScannedComplete] = useState(false);
    const [scannedData, setScannedData] = useState(null);

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
        <Screen style={styles.Screen}>
          <View style={styles.container}>
              <BarCodeScanner
              onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
              style={{width: "100%", height: "100%"}}
              />
              {!scanned && <AppText style={{color: colors.white, textAlign: "center", fontSize: 14, marginVertical: 10}}>Point your camera at the BAR/QR Code</AppText>}
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
                  <AppText style={{color: colors.white, fontSize: 18, textAlign: "center"}}>Scan Complete</AppText>
                  <AppText style={{color: colors.white, fontSize: 16, textAlign: "center"}}>Scanned Data: {scannedData}</AppText>
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
  Screen: {
    backgroundColor: colors.midnight,
  },
});

export default BarcodeScreen;