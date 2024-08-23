import React from 'react';
import { View, StyleSheet, TouchableHighlight } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import Swipeable from 'react-native-gesture-handler/Swipeable';

import { useTheme } from '../utils/ThemeContext';
import DoubleTapTouchableOpacity from './DoubleTapTouchableOpacity';
import AppText from './AppText';

const MessageBubble = ({msgPress, justifyContent, index, msgId, selectedMessageIds, msgContent, isCurrentUser, msgSenderUsername, msgTime, selectedMessages, msgIsInFlaggedMessages, messageLongPress, selectMessage, doubleTapMessage, msgSentiment,flagMessage, ...otherProps}) => {

    const {theme} = useTheme();

    const formatTime = (time) => {
        const date = new Date(time);
        return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true });
    };

    const replyToMessage = () => {
        console.log("Replying to message");
    }

  return (
    <GestureHandlerRootView>
        <Swipeable
            renderLeftActions={() => (
                <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 10}}>
                    <TouchableHighlight
                        onPress={replyToMessage}
                        underlayColor="rgba(0, 0, 0, 0.05)"
                        style={{padding: 5, borderRadius: 5}}
                    >
                        <AppText style={{fontSize: 16, fontWeight: 'bold'}} color={theme?.amberGlow}>Reply</AppText>
                    </TouchableHighlight>
                    <TouchableHighlight
                        onPress={flagMessage}
                        underlayColor="rgba(0, 0, 0, 0.05)"
                        style={{padding: 5, borderRadius: 5}}
                    >
                        <AppText style={{fontSize: 16, fontWeight: 'bold'}} color={theme?.punch}>Flag</AppText>
                    </TouchableHighlight>
                </View>
            )} 
        >
            <TouchableHighlight 
                key={msgId || index} 
                accessible={true}
                accessibilityLabel={`${msgContent}, Message from ${isCurrentUser ? "you" : msgSenderUsername || "a group member"} at ${formatTime(msgTime)}`}
                accessibilityHint={`${selectedMessages.includes(msgId) ? "Message selected" : "Message not selected"}`}
                onPress={msgPress}
                underlayColor="rgba(0, 0, 0, 0.05)"
                style={[
                    {
                        flexDirection: 'row', 
                        justifyContent: justifyContent, 
                        marginBottom: 15,
                        marginTop: index === 0 ? 10 : 0,
                    },
                    msgId && selectedMessageIds.includes(msgId) && {backgroundColor: theme?.mistyLight, borderWidth: 1, borderColor: theme?.amberGlow, borderRadius: 5, padding: 2}
                ]}
                {...otherProps}
            >
                <DoubleTapTouchableOpacity 
                    style={[
                        {
                        backgroundColor: msgIsInFlaggedMessages 
                            ? theme?.punch 
                            : (isCurrentUser ? theme?.amberGlow : theme?.horizon),
                        padding: 10, 
                        paddingBottom: 5,
                        borderRadius: 5, 
                        maxWidth: '80%',
                        minWidth: 80,
                        },
                        
                    ]}
                    onLongPress={messageLongPress}
                    onPress={selectMessage}
                    onDoublePress={doubleTapMessage}
                    >
                    <View 
                        style={[styles.flagIndicator, {backgroundColor: msgSentiment === "negative" ? "red" : "green", borderRadius: 15, borderWidth: 1, borderBlockColor: theme?.black}]}
                        accessible={true}
                        accessibilityLabel={msgSentiment === "negative" ? "Negative message" : "Positive message"}
                        accessibilityHint='This message has been flagged for tone. Double tap to view reason.'
                    />
                    <AppText style={{
                        fontSize: 16, 
                        fontWeight: 'bold',
                        paddingBottom: 6,
                        }}
                        color={isCurrentUser ? theme?.midnight : theme?.white}
                    >{msgContent}</AppText>
                    {/* time and name */}
                    <View style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                    }}>
                        <AppText 
                        style={{fontSize: 8, fontWeight: 'bold'}} color={theme?.white}>{isCurrentUser ? "You" : msgSenderUsername}</AppText>
                        <AppText
                        style={{
                            fontSize: 8,
                            fontWeight: 'bold',
                            marginHorizontal: 5,
                        }}
                        color={isCurrentUser ? theme?.horizon : theme?.misty}
                        >
                        {formatTime(msgTime)}
                        </AppText>
                    </View>
                    {/* end of time and name */}
                </DoubleTapTouchableOpacity>
            </TouchableHighlight>
        </Swipeable>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
    flagIndicator: {
        position: 'absolute',
        width: 10,
        height: 10,
        top: 5,
        right: 5,
    },
});

export default MessageBubble;