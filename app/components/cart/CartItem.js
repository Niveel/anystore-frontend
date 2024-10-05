import React from 'react'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import Swipeable from 'react-native-gesture-handler/Swipeable';
import { TouchableOpacity, Image, View, StyleSheet, Alert} from 'react-native';

import CartDeleteAction from './CartDeleteAction'
import { useTheme } from '../../utils/ThemeContext';
import AppText from '../AppText';
import Icon from '../Icon';
import { formatNumber } from '../../utils/utils';

const CartItem = ({image, name, desc, price, companyName, onPress, rating, delPress, ...otherPops}) => {

  const {theme} = useTheme();

  // remove $ from a string
  const removeDollar = (str) => {
    return str.replace('$', '');
  }

  const deleteConfirmation = () => {
    Alert.alert(
      "Delete Item",
      "Are you sure you want to delete this item?",
      [
        {
          text: "Cancel",
          onPress: () => console.log("Cancel Pressed"),
          style: "cancel"
        },
        { text: "Delete", onPress: delPress },
      ],
      { cancelable: true }
    );
  }

  const darkModeTextColor = theme?.amberGlow === "#e2521d" ? theme?.text : theme?.amberGlow
  const darkModeBgColor = theme?.amberGlow === "#e2521d" ? theme?.horizon : theme?.misty

  return (
    <GestureHandlerRootView>
      <Swipeable renderRightActions={()=> <CartDeleteAction onPress={delPress}/>}>
        <TouchableOpacity
          style={[styles.card, {backgroundColor: darkModeBgColor}]}
          activeOpacity={0.9}
          onPress={onPress}
          {...otherPops}
        >
          <View style={[styles.imageBox, {backgroundColor: theme?.horizon}]}>
            <Image source={{uri: image[0]}} style={styles.image}/>
          </View>
          <View style={[styles.details]}>
            {/* top part */}
            <View style={styles.topWrapper}>
              <View style={styles.nameStore}>
                <AppText style={styles.name} numberOfLines={2} color={darkModeTextColor}>{name}</AppText>
                <AppText style={{fontSize: 12}} color={darkModeTextColor}>Store: <AppText style={{fontSize: 12}} color={theme?.amberGlow}>{companyName}</AppText></AppText>
              </View>
              <View style={styles.deleteBox}>
                <TouchableOpacity 
                  style={styles.delete}
                  onPress={deleteConfirmation}
                >
                  <Icon name="trash-can-outline" size={20} color={theme?.white}/>
                </TouchableOpacity>
              </View>
            </View>
            {/* lower part */}
            <View style={styles.lowWrapper}>
              <AppText style={{fontSize: 12}} color={theme?.white}>Rating: {rating}</AppText>
              <AppText style={{fontSize: 18}} color={theme?.amberGlow}>${removeDollar(price)}</AppText>
            </View>
          </View>
        </TouchableOpacity>
      </Swipeable>

    </GestureHandlerRootView>
  )
}

const styles = StyleSheet.create({
  imageBox: {
    flex: 1,
    borderRadius: 10,
    overflow: 'hidden',
    padding: 5,
  },
  image: {
    flex: 1,
    resizeMode: 'contain',
    borderRadius: 10,
  },
  card: {
    flexDirection: 'row',
    padding: 5,
    borderRadius: 10,
    marginBottom: 10,
    height: 120,
  },
  details: {
    flex: 2,
    padding: 5,
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
  topWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  name: {
    fontSize: 16,
    marginBottom: 5,
  },
  nameStore: {
    flex: 3,
  },
  deleteBox: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  delete: {
    padding: 5,
    position: 'absolute',
    right: 0,
    top: 0,
  },
  lowWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
})

export default CartItem