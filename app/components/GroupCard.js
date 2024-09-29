import React from 'react';
import { View, StyleSheet, TouchableOpacity, Image } from 'react-native';

import AppText from './AppText';
import { useTheme } from '../utils/ThemeContext';
import userImg from '../assets/user.jpg';

const GroupCard = ({groupName, groupId, onPress, date, ...otherProps}) => {
    const {theme} = useTheme();
  return (
    <TouchableOpacity  
        style={[styles.groupCard, {backgroundColor: theme?.midnightLight,}]} 
        onPress={onPress}
        accessible={true}
        accessibilityLabel={`Open ${groupName} chatroom`}
        activeOpacity={0.7}
        {...otherProps}
    >
        <View style={styles.imageBox}>
            <Image source={userImg} style={styles.image} />
        </View>
        <View style={styles.info}>
            <AppText style={styles.name} numberOfLines={1}>{groupName}</AppText>
            <AppText style={styles.text} numberOfLines={2}>{groupName} blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah </AppText>
            <AppText style={styles.date} color={theme?.amberGlowLight}>{date}</AppText>
        </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
    groupCard: {
        padding: 10,
        height: 90,
        justifyContent: "space-between",
        marginVertical: 5,
        borderRadius: 5,
        flexDirection: 'row',
        gap: 10,
    },
    name: {
        fontSize: 14,
        letterSpacing: .02,
        fontWeight: 'bold',
    },
    date: {
        fontSize: 8,
        alignSelf: 'flex-end',
    },
    imageBox: {
        width: 70,
        height: 70,
        borderRadius: 50,
        backgroundColor: 'rgba(0,0,0,.1)',
        alignSelf: 'center',
    },
    image: {
        width: "100%",
        height: "100%",
        borderRadius: 50,
        resizeMode: 'cover',
    },
    info: {
        flex: 1,
        justifyContent: 'space-between',
    },
    text: {
        fontSize: 11,
        letterSpacing: .02,
    },
});

export default GroupCard;