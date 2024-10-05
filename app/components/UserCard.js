import React from 'react';
import { View, StyleSheet, TouchableOpacity, Image } from 'react-native';

import AppText from './AppText';
import Icon from './Icon';
import { useTheme } from '../utils/ThemeContext';

const UserCard = ({userImg, userName, onPress, removePress, bgColor, textColor, isYou, isAdmin, ...otherProps}) => {
    const { theme } = useTheme();
    const darkModeTextColor = theme?.amberGlow === "#e2521d" ? theme?.text : theme?.white
  return (
    <TouchableOpacity
        style={[styles.container, {
            backgroundColor: bgColor
        }]}
        onPress={onPress}
        activeOpacity={0.8}
        {...otherProps}
    >
        <View style={[styles.image, {
            borderColor: textColor,
            backgroundColor: theme?.amberGlowLight,
        }]}>
            {userImg && userImg?.length > 0 ? 
            <Image source={userImg} style={{width: 50, height: 50, borderRadius: 25}} />
            :<Icon name="image-outline" size={35} color={textColor} />}
        </View>
        <View style={styles.infoBox}>
            <AppText 
                style={{
                textTransform: "capitalize",
                }}
                color={darkModeTextColor}
            >{userName}</AppText>
            {isYou && 
                <View style={[styles.you, {
                    backgroundColor: theme?.amberGlow,
                }]}>
                    <Icon name="account" size={20} color={theme?.midnight} />
                    <AppText style={{fontSize: 10}}>You</AppText>
                </View>}
            {isAdmin &&
                <TouchableOpacity
                    style={[styles.you, {
                        backgroundColor: theme?.misty,
                    }]}
                    onPress={removePress}
                    accessible={true}
                    accessibilityLabel="Remove"
                >
                    <Icon name="account-remove" size={20} color={theme?.white} />
                </TouchableOpacity>
            }
        </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    height: 60,
    flexDirection: 'row',
    padding: 5,
    borderRadius: 10,
    marginVertical: 5,
    gap: 10,
  },
  image: {
    width: 50,
    height: 50,
    borderRadius: 35,
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  infoBox: {
    flex: 1,
    // marginLeft: 10,
    justifyContent: 'space-between',
    flexDirection: 'row',
    alignItems: 'center',

  },
  you: {
    padding: 2,
    width: 40,
    height: "100%",
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
  }
});

export default UserCard;