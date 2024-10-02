import React, {useState, useRef} from 'react';
import { View, StyleSheet , TouchableOpacity, Image, ToastAndroid, Alert, Platform, Share} from 'react-native';
import {MaterialCommunityIcons} from '@expo/vector-icons';
import * as Clipboard from 'expo-clipboard';
import * as Linking from 'expo-linking';

import { useTheme } from '../utils/ThemeContext';
import AppText from './AppText';
import { formatNumber } from '../utils/utils';
import AppButton from './AppButton';
import AppBottomSheet from './AppBottomSheet';
import DescriptionModal from './modals/DescriptionModal';
import Icon from './Icon';

const ProductInfo = ({
    title, 
    description, 
    rating, 
    price,
    store,
    category,
    condition,
    type,
    askCafa,
    productId,
    handleAddToFavStores,
    handleAddToCart,
    handleAddToRadar,
    handleBuyNow,
    productImg,
    handleShare,
  }) => {
    const [showDetailsModal, setShowDetailsModal] = useState(false);
    const [showProductInfoModal, setShowProductInfoModal] = useState(false);
    const {theme} = useTheme();
    const bottomSheetRef = useRef(null)

    // console.log('productImg', productImg);

    const showLinkCopied = () => {
      if (Platform.OS === 'android') {
        ToastAndroid.show('Link copied to clipboard', ToastAndroid.SHORT);
      } else {
        Alert.alert('Link copied to clipboard');
      }
    }

    const openBottomSheet = () => {
      bottomSheetRef.current?.open();
    }

    const openProductDescription = () => {
      setShowDetailsModal(true);
    }

    const openProductInfo = () => {
      setShowProductInfoModal(true);
    }

    const generateProductLink = (productId) => {
      const productLink = Linking.createURL(`/app/product/${productId}`);
      return productLink;
    }

    const productLink = generateProductLink(productId);

    const copyLink = async () => {
      await Clipboard.setStringAsync(productLink);
      showLinkCopied();
    }

    const shareToExternal = async (productId) => {
      
      try {
        const result = await Share.share({
          message: `Check out this product from shopwit ${productLink}`,
          url: productLink,
          title: 'Product Link',
        });
        if (result.action === Share.sharedAction) {
          if (result.activityType) {
            // The content was shared with a specific activity type (like WhatsApp, Facebook, etc.)
            console.log(`Shared via ${result.activityType}`);

          } else {
            // The content was shared successfully without a specific activity type
            console.log('Product shared successfully!');
          }
        } else if (result.action === Share.dismissedAction) {
          console.log('Share dismissed by the user');
        }
      } catch (error) {
        alert(`Error: ${error.message}`);
      }
    }

  return (
      <View style={[styles.container, {backgroundColor: theme?.misty}]}>
        {/* modal for description */}
        <DescriptionModal 
          visible={showDetailsModal} 
          closeModal={() => setShowDetailsModal(false)}
          header='Product Description'
        >
          <AppText style={{fontSize: 20, textAlign: 'center'}}>Product Description</AppText>

          <AppText style={{fontSize: 16, marginVertical: 10}}>
            {description} blah blah black sheep blah blah black sheep 
            blah blah black sheep blah blah black sheep blah blah black sheep
            blah blah black sheep blah blah black sheep blah blah black sheep
            blah blah black sheep blah blah black sheep blah blah black sheep
            blah blah black sheep blah blah black sheep blah blah black sheep
            blah blah black sheep blah blah black sheep blah blah black sheep
            blah blah black sheep blah blah black sheep blah blah black sheep
            blah blah black sheep blah blah black sheep blah blah black sheep
            blah blah black sheep blah blah black sheep blah blah black sheep
            blah blah black sheep blah blah black sheep blah blah black sheep
            blah blah black sheep blah blah black sheep blah blah black sheep
            blah blah black sheep blah blah black sheep blah blah black sheep
            blah blah black sheep blah blah black sheep blah blah black sheep
            blah blah black sheep blah blah black sheep blah blah black sheep
          </AppText>
        </DescriptionModal>
        {/* modal for product information */}
        <DescriptionModal 
          visible={showProductInfoModal} 
          closeModal={() => setShowProductInfoModal(false)}
          header='Product Information'
        >
          <AppText style={{fontSize: 20, textAlign: 'center'}}>{title}</AppText>
          {/* info boxes */}
          <View style={styles.infoBox}>
            <AppText style={styles.infoBig}>STORE:</AppText>
            <AppText style={styles.infoSmall}>{store}</AppText>
          </View>
          <View style={styles.infoBox}>
            <AppText style={styles.infoBig}>CATEGORY:</AppText>
            <AppText style={styles.infoSmall}>{category}</AppText>
          </View>
          <View style={styles.infoBox}>
            <AppText style={styles.infoBig}>CONDITION:</AppText>
            <AppText style={styles.infoSmall}>{condition}</AppText>
          </View>
          <View style={styles.infoBox}>
            <AppText style={styles.infoBig}>TYPE:</AppText>
            <AppText style={styles.infoSmall}>{type}</AppText>
          </View>
          {/* end of info boxes */}
        </DescriptionModal>

        {/* inner container */}
        <View style={styles.inner}>
          <AppText color={theme?.white} numberOfLines={2}>{title} blah blah blah blah blah blah blah blah blah blah blah blah blah blah</AppText>
          {/* desc */}
          <TouchableOpacity 
            style={[styles.desc, {backgroundColor: theme?.mistyLight}]}
            onPress={openProductDescription}
          >
            <AppText color={theme?.white} style={styles.smallText} numberOfLines={3}>{description} blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah</AppText>
          </TouchableOpacity>
          {/* more info wrapper */}
          <View style={styles.moreInfo}>
            {/* rating and price */}
            <View>
              <View
                accessible={true}
                accessibilityLabel={`Rating: ${rating} out of 5 stars`}
              >
                {rating}
              </View>
              <AppText color={theme?.white} style={styles.price}>${formatNumber(Number(price))}</AppText>
            </View>
            {/* end of rating and price */}
            {/* share and cafa */}
            <View style={styles.shareCafa}>
              <TouchableOpacity 
                style={[styles.share, {backgroundColor: theme?.horizon}]}
                onPress={openBottomSheet}
                accessible={true}
                accessibilityLabel='Share product'
              >
                <MaterialCommunityIcons name="share-variant" size={22} color={theme?.white} />
              </TouchableOpacity>
              <AppButton 
                width='50%'
                textColor={theme?.white}
                title='Ask CAFA'
                height={38}
                onPress={askCafa}
              />
            </View>
            {/* end of share and cafa */}
          </View>
          {/* end of more info wrapper */}
          <AppButton
            height={38}
            style={[{borderColor: theme?.white}, styles.productInfoBtn]}
            textColor={theme?.white}
            title='Product Details'
            textStyle={{fontSize: 14}}
            onPress={openProductInfo}
          />
          <AppButton
            height={38}
            style={{marginVertical: 5}}
            textColor={theme?.white}
            title='Add to favorite stores'
            textStyle={{fontSize: 14}}
            onPress={handleAddToFavStores}
          />
          {/* cart and radar */}
          <View style={styles.cartRadar}>
            <AppButton
              height={38}
              textColor={theme?.white}
              title='Add to cart'
              textStyle={{fontSize: 14}}
              width='46%'
              onPress={handleAddToCart}
            />
            <AppButton
              height={38}
              textColor={theme?.white}
              title='Add to radar'
              textStyle={{fontSize: 14}}
              width='46%'
              onPress={handleAddToRadar}
            />
          </View>
          {/* end of cart and radar */}
          <AppButton
              height={38}
              textColor={theme?.misty}
              title='buy now'
              textStyle={{fontSize: 14}}
              style={{marginVertical: 5}}
              color={theme?.white}
              onPress={handleBuyNow}
            />
        </View>
        {/* end of inner container */}

        {/* bottom sheet */}
        <AppBottomSheet ref={bottomSheetRef}>
          <View style={styles.sheetInner}>
            <AppText style={styles.shareHeadText}>Share Product</AppText>
            <AppButton 
              width='40%'
              style={{marginVertical: 10, alignSelf: 'center'}}
              height={38}
              textColor={theme?.white}
              title='Crit'
              onPress={handleShare}
            />
            {/* share link generator */}
            <View style={styles.shareLinkWrapper}>
              <View style={styles.shareIcon}>
                <Image source={{uri: productImg}} style={styles.shareImg} />
              </View>
              <View style={styles.linkBox}>
                <AppText style={{fontSize: 10}} numberOfLines={1}>{productLink}</AppText>
              </View>
              <TouchableOpacity onPress={copyLink}>
                <MaterialCommunityIcons name="content-copy" size={22} color={theme?.horizon} />
              </TouchableOpacity>
            </View>
            {/* end of share link generator */}
            {/* social media shares */}
            <View style={styles.socialShareLinkWrapper}>
              {/* share to instagram */}
              <TouchableOpacity 
                style={styles.shareSocialIcon}
                onPress={()=> shareToExternal(productId)}
              >
                <Icon name='share-all-outline' size={40} color={theme?.horizon} />
                <AppText style={{fontSize: 8, textAlign: 'center'}}>external</AppText>
              </TouchableOpacity>
            </View>
            {/* end of social media shares */}
          </View>
        </AppBottomSheet>
        {/* end of bottom sheet */}
      </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 2,
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
    paddingHorizontal: 30,
  },
  inner: {
    flex: 1,
    padding: 10,
    justifyContent: 'space-between',
  },
  desc: {
    padding: 5,
    borderRadius: 10,
    marginVertical: 5,
  },
  smallText: {
    fontSize: 12,
  },
  price: {
    fontSize: 18,
    fontWeight: 'bold',
    letterSpacing: 0.1,
  },
  shareCafa: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: 15,
  },
  share: {
    padding: 8,
    borderRadius: 50,
  },
  moreInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  productInfoBtn: {
    backgroundColor: "transparent",
    borderWidth: 1,
  },
  cartRadar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  sheetInner: {
    paddingHorizontal: 10,
    height: "100%"
  },
  shareHeadText: {
    fontSize: 16,
    fontWeight: 'bold',
    letterSpacing: 0.1,
    textAlign: 'center',
  },
  shareLinkWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 5,
    width: '100%',
  },
  shareIcon: {
    height: 40,
    width: 40,
    borderRadius: 30,
    overflow: 'hidden',
  }, 
  shareImg: {
    borderRadius: 30,
    height: '100%',
    width: '100%',
    resizeMode: 'contain',
  },
  linkBox: {
    width: '75%',
    borderRadius: 10,
    backgroundColor: 'rgba(255,255,255,0.1)',
  },
  socialShareLinkWrapper: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 5,
    gap: 10,
    width: '100%',
    flexWrap: 'wrap',
    paddingVertical: 10,
  },
  shareSocialIcon: {
    height: 80,
    width: 80,
    borderRadius: 40,
    overflow: 'hidden',
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  infoBox: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 10,
    gap: 30,
  },
  infoBig: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  infoSmall: {
    fontSize: 14,
  },

  
});

export default ProductInfo;