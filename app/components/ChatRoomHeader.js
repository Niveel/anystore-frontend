import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import AppText from './AppText';
import MsgLongPressOptions from './MsgLongPressOptions';
import { useTheme } from '../utils/ThemeContext';

const ChatRoomHeader = ({navigation, groupName, isCreatedGroup, addMember, morePress, selectedMessages, deleteMsg, reportMsg, deselectMsgs, flagMsg, unFlagMsg, isFlagged }) => {

    const {theme} = useTheme();

  return (
    <View style={[styles.header, {backgroundColor: theme?.horizon,}]}>
        <View style={styles.box}>
            <TouchableOpacity 
                onPress={() => navigation.navigate('CritScreen')} 
                style={[styles.backBtn, {backgroundColor: theme?.midnight,}]}
                accessible={true}
                accessibilityLabel="Back"
            >
                <MaterialCommunityIcons name="arrow-left" size={30} color={theme?.amberGlow} />
            </TouchableOpacity>
            <View style={styles.infoBox}>
                <AppText style={styles.groupName} numberOfLines={1}>{groupName}</AppText>
                <AppText>Chatroom</AppText>
            </View>
        </View>
        <View style={[styles.moreList, {
            justifyContent: isCreatedGroup ? 'space-between' : 'flex-end',
            paddingRight: isCreatedGroup ? 10 : 20,
            }]}
        >
        {isCreatedGroup && 
        <TouchableOpacity 
            onPress={addMember} 
            style={[styles.moreBtn, {backgroundColor: theme?.midnight,}]} 
            activeOpacity={0.8}
            accessible={true}
            accessibilityLabel="Add member"
        >
            <MaterialCommunityIcons name="account-plus" size={30} color={theme?.amberGlow} />
        </TouchableOpacity>}
        <TouchableOpacity 
            onPress={morePress} 
            style={[styles.moreBtn, {backgroundColor: theme?.midnight,}]} 
            activeOpacity={0.8}
            accessible={true}
            accessibilityLabel="More options"
        >
            <MaterialCommunityIcons name="dots-vertical" size={30} color={theme?.amberGlow} />
        </TouchableOpacity>
        </View>

          {/* longPressing messages options */}
        {selectedMessages.length > 0 && <MsgLongPressOptions
        style={{
            position: 'absolute',
            width: "100%",
            height: "100%",
            backgroundColor: theme?.midnight,
            zIndex: 20,
        }}
        messages={selectedMessages}
        deleteMsg={() => deleteMsg(selectedMessages)}
        reportMsg={reportMsg}
        deselectMsgs={deselectMsgs}
        flagMsg={() => flagMsg(selectedMessages)}
        unFlagMsg={() => unFlagMsg(selectedMessages)}
        isFlagged={isFlagged}
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
    },
    box: {
        flexDirection: 'row',
        gap: 10,
        alignItems: 'center',
        width: "70%",
    },
    backBtn: {
        paddingVertical: 5,
        paddingHorizontal: 10,
        borderRadius: 5,
    },
    infoBox: {
        flexDirection: 'column',
        maxWidth: '83%',
    },
    groupName: {
        fontSize: 19,
        fontWeight: 'bold',
    },
    moreList: {
        flexDirection: 'row',
        gap: 10,
        alignItems: 'center',
        width: "30%",
    },
    moreBtn: {
        paddingVertical: 5,
        paddingHorizontal: 10,
        borderRadius: 5,
    },
});

export default ChatRoomHeader;