import React, {useState, useEffect} from 'react';
import { View, StyleSheet, Dimensions, Linking } from 'react-native';
import { BarCodeScanner } from 'expo-barcode-scanner';
// import * as WebBrowser from 'expo-web-browser';

import AppButton from '../components/AppButton';
import AppText from '../components/AppText';
import Screen from '../components/Screen';
import { useTheme } from '../utils/ThemeContext';
import CustomHeader from '../components/CustomHeader';
import PopupModal from '../components/modals/PopupModal';
import BackBtnBar from '../components/BackBtnBar'; 
import routes from '../navigation/routes';
import barcodeSearch from '../api/barcodeSearch';


const { height } = Dimensions.get("window");

function BarcodeScreen({navigation}) {
    const [hasPermission, setHasPermission] = useState(null);
    const [scanned, setScanned] = useState(false);
    const [isScannedComplete, setIsScannedComplete] = useState(false);
    const [scannedData, setScannedData] = useState(null);
    const [productLink, setProductLink] = useState("");
    const {theme} = useTheme()

    const goHome = () => {
      navigation.navigate('Product');
    }

    // getting and setting the link from api when scanned
    useEffect(() => {
      const getLink = async () => {
        try {
          if (!isScannedComplete) return;

          const response = await barcodeSearch.searchBarcode(scannedData);

          if (response.ok) {
            const productLink = response?.data?.link;
            setProductLink(productLink);
            
            if(productLink) {
              Linking.openURL(productLink);
            }
          } else {
            console.log("Error getting barcode link: ", response);
            alert("Error getting barcode link: ", response);
          }
        } catch (error) {
          console.log("Error getting barcode link: ", error);
        } finally {
          setIsScannedComplete(false);
          setScanned(false);
        }
      }

      getLink();
    }, [isScannedComplete]);

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

      // const openLink = (url) => {
      //   // navigation.navigate(routes.BARCODE_RESULTS, {barcode: url});
      //   if(!url) return;
      //   const isValidUrl = url.startsWith("http://") || url.startsWith("https://");

      //   if (isValidUrl) {
      //     Linking.openURL(url);
      //   } else {
      //     const searchUrl = `https://www.google.com/search?q=${url}`;
      //     Linking.openURL(searchUrl);
      //   }
      // }

    return (
        <Screen style={{backgroundColor: theme?.midnight,}}>
          <CustomHeader title={'Barcode Scanner'} />
          <BackBtnBar goBack={goHome} />
          <View style={styles.container}>
              <BarCodeScanner
                onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
                style={{
                  width: "100%", 
                  height: "100%",
                }}
              />
              {!scanned && <AppText style={{color: theme?.white, textAlign: "center", fontSize: 14, marginVertical: 10}}>Point your camera at the BAR/QR Code</AppText>}
              {scanned && 
                <AppButton 
                  title={'Tap to Scan Again'} 
                  style={{
                  marginTop: 20,
                  alignSelf: 'center',
                }} 
                onPress={() => setScanned(false)} 
                textColor={theme?.midnight}
                width='60%'
              />}
          </View>
            
            {/* modal when scan is complete */}
            {/* <PopupModal
              visible={isScannedComplete}
              closeModal={()=> setIsScannedComplete(false)}
            >
              <View style={styles.modalInner}>
                <View style={[styles.topPart, {
                  backgroundColor: theme?.misty,
                }]}>
                  <AppText style={{fontSize: 18, textAlign: "center"}} color={theme?.amberGlow}>Scan Complete</AppText>
                  <AppText style={{fontSize: 16, textAlign: "center"}} color={theme?.amberGlow}>Scanned Data: {scannedData}</AppText>
                </View>
                <View style={styles.bottomPart}>
                  <AppButton 
                    title="Search Product" 
                    onPress={() => openLink(scannedData)} 
                    width='60%'
                    textColor={theme?.midnight}
                  />
                </View>
              </View>
            </PopupModal> */}
            {/* end of modal when scan is complete */}
        </Screen>
    );
    }

const styles = StyleSheet.create({
  container: {
    width: "100%",
    height: height / 1.6,
    alignSelf: 'center',
    paddingVertical: 10,
  },
  modalInner: {
    flex: 1,
    padding: 20,
    gap: 20,
  },
  topPart: {
    flex: 1,
    borderRadius: 20,
    padding: 20,
  },
  bottomPart: {
    flex: 1,
    alignItems: 'center',
  }
});

export default BarcodeScreen;