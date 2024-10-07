import React from 'react';
import { View, StyleSheet, TouchableOpacity, Image, Dimensions } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import AppText from './AppText';
import MsgLongPressOptions from './MsgLongPressOptions';
import { useTheme } from '../utils/ThemeContext';
import Icon from './Icon';

const {width} = Dimensions.get('window');

const ChatRoomHeader = ({navigation, groupName, isCreatedGroup, addMember, morePress, selectedMessages, deleteMsg, reportMsg, deselectMsgs, flagMsg, unFlagMsg, isFlagged, numberOfUsersOnline=1, groupImg, isProduct=false }) => {

    const {theme} = useTheme();
    const darkModeTextColor = theme?.amberGlow === "#e2521d" ? theme?.text : theme?.white

  return (
    <View style={[styles.header, {backgroundColor: theme?.misty,}]}>
        <View style={styles.box}>
            <TouchableOpacity 
                onPress={() => navigation.navigate('CritScreen')} 
                style={[styles.backBtn, {backgroundColor: theme?.midnight,}]}
                accessible={true}
                accessibilityLabel="Back"
            >
                <MaterialCommunityIcons name="arrow-left" size={25} color={theme?.punch} />
            </TouchableOpacity>
            <View>
                <View style={[styles.imgBox, {backgroundColor: theme?.horizon}]}>
                    {groupImg ? 
                    <Image source={{uri: groupImg}} style={{width: 40, height: 40, borderRadius: 20,}} /> : <Icon name="image-outline" size={25} color={darkModeTextColor} />
                    }
                    
                </View>
            </View>
            <View style={styles.infoBox}>
                <AppText style={styles.groupName} color={darkModeTextColor} numberOfLines={1}>{groupName}</AppText>
                <View style={{
                    flexDirection: 'row',
                    gap: 10,
                    alignItems: 'baseline',
                    justifyContent: 'flex-start',
                    width: "55%",
                }}>
                    <AppText style={{
                        fontSize: 10,

                    }} color={darkModeTextColor}>{numberOfUsersOnline} {numberOfUsersOnline == 1 ? 'member' : 'members'} online</AppText>
                </View>
            </View>
        </View>
        <View style={[styles.moreList]}
        >
        {isCreatedGroup && 
        <TouchableOpacity 
            onPress={addMember} 
            style={[styles.moreBtn]} 
            activeOpacity={0.8}
            accessible={true}
            accessibilityLabel="Add member"
        >
            <MaterialCommunityIcons name="account-plus" size={25} color={darkModeTextColor} />
        </TouchableOpacity>}
        <TouchableOpacity 
            onPress={morePress} 
            style={[styles.moreBtn]} 
            activeOpacity={0.8}
            accessible={true}
            accessibilityLabel="More options"
        >
            <MaterialCommunityIcons name="dots-vertical" size={25} color={darkModeTextColor} />
        </TouchableOpacity>
        </View>

          {/* longPressing messages options */}
        {selectedMessages.length > 0 && 
            <MsgLongPressOptions
                style={{
                    position: 'absolute',
                    left: 0,
                    top: 0,
                    width: width,
                    height: "100%",
                    backgroundColor: theme?.misty,
                    height: "125%",
                    zIndex: 20,
                }}
                messages={selectedMessages}
                deleteMsg={() => deleteMsg(selectedMessages)}
                reportMsg={reportMsg}
                deselectMsgs={deselectMsgs}
                flagMsg={() => flagMsg(selectedMessages)}
                unFlagMsg={() => unFlagMsg(selectedMessages)}
                isFlagged={isFlagged}
                isProduct={isProduct}
            />}
          {/* end of longPressing messages options */}
    </View>
  );
}

const styles = StyleSheet.create({
    header: {
        padding: 5,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: 10,
        borderBottomLeftRadius: 20,
        borderBottomRightRadius: 20,
        paddingHorizontal: 20,
    },
    box: {
        flexDirection: 'row',
        gap: 5,
        alignItems: 'center',
        width: "63%",
    },
    backBtn: {
        padding: 5,
        borderRadius: 20,
        flexShrink: 0,
    },
    infoBox: {
        flexDirection: 'column',
        width: '83%',
    },
    groupName: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    moreList: {
        flexDirection: 'row',
        gap: 8,
        alignItems: 'center',
        justifyContent: 'flex-end',
    },
    moreBtn: {
        paddingVertical: 5,
        borderRadius: 5,
        paddingHorizontal: 5,
    },
    imgBox: {
        width: 40, 
        height: 40, 
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
    }
});

export default ChatRoomHeader;