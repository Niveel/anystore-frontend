import React from 'react';
import { View, StyleSheet, TouchableOpacity, Image } from 'react-native';

import AppText from './AppText';
import { useTheme } from '../utils/ThemeContext';
import Icon from './Icon';

const ShareGroupCard = ({groupName, members, groupImage, addThisToShareList, addedToShareList}) => {

    const { theme } = useTheme();

  return (
    <TouchableOpacity
        style={[styles.card, {
            borderBottomColor: theme?.mistyLight,
            backgroundColor: addedToShareList ? theme?.mistyLight : theme?.white,
            paddingVertical: 5,
        }]}
        activeOpacity={0.5}
        onPress={addThisToShareList}
        accessible={true}
        accessibilityRole='button'
        accessibilityLabel={addedToShareList ? `${groupName} selected` : `${groupName} not selected`}
        accessibilityHint='Double tap to select or deselect this group'
    >
        <View style={styles.tickBox}>
            <TouchableOpacity 
                style={[styles.checkBox, {
                    borderColor: theme?.misty,
                    backgroundColor: theme?.white,
                }]}
                activeOpacity={0.8}
            >
                {addedToShareList && <Icon 
                    name='check'
                    size={20}
                    color={theme?.misty}
                />}
            </TouchableOpacity>
        </View>
        <View style={styles.groupInfoBox}>
            <View style={[styles.imgBox, {
                backgroundColor: theme?.misty,
            }]}>
                {groupImage ? 
                    <Image 
                    source={{uri: groupImage}}
                    style={styles.image}
                    /> :
                    <Icon 
                        name='image-outline'
                        size={40}
                        color={theme?.white}
                    />
                }
            </View>
            <View style={styles.infoBox}>
                <AppText style={{fontWeight: 'bold'}}>{groupName}</AppText>
                <AppText style={{fontSize: 12}}>{members} members</AppText>
            </View>
        </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
    checkBox: {
        width: 30,
        height: 30,
        backgroundColor: 'red',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 2,
        borderRadius: 5,
    },
    groupInfoBox: {
        flex: 4,
        flexDirection: 'row',
    },
    card: {
        flexDirection: 'row',
        height: 90,
        marginBottom: 10,
        borderBottomWidth: 2,
        width: '100%',
        borderRadius: 5,
    },
    tickBox: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    imgBox: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 50,
        flexShrink: 0,
    },
    infoBox: {
        flex: 2.5,
        justifyContent: 'flex-start',
        gap: 2,
        padding: 5,
    },
    image: {
        width: "100%",
        height: "100%",
        borderRadius: 50,
        resizeMode: 'cover',
    },
});

export default ShareGroupCard;