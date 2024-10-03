import React, {useRef, useEffect} from 'react';
import { View, StyleSheet, TouchableHighlight, Animated, TouchableOpacity } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import Swipeable from 'react-native-gesture-handler/Swipeable';
import {MaterialCommunityIcons} from '@expo/vector-icons';

import { useTheme } from '../utils/ThemeContext';
import DoubleTapTouchableOpacity from './DoubleTapTouchableOpacity';
import AppText from './AppText';

const MessageBubble = ({msgPress, justifyContent, index, msgId, selectedMessageIds, msgContent, isCurrentUser, msgSenderUsername, msgTime, selectedMessages, msgIsInFlaggedMessages, messageLongPress, selectMessage, doubleTapMessage, msgSentiment, setReplyOnSwipeOpen, updateBubbleRef, message, onReplyPress, ...otherProps}) => {

    const {theme} = useTheme();
    const isMyNextMessage = true
    const bubbleRef = useRef(null);

    useEffect(() => {
    if (bubbleRef.current) {
        updateBubbleRef(bubbleRef.current, msgId);
    }
    }, [msgId, updateBubbleRef]);

    const formatTime = (time) => {
        const date = new Date(time);
        return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true });
    };

    const renderLeftAction = (animatedProgress) => {
        const size = animatedProgress.interpolate({
            inputRange: [0, 1, 100],
            outputRange: [0, 1, 1],
        });

        const translate = animatedProgress.interpolate({
            inputRange: [0, 1, 2],
            outputRange: [0, -12, -20],
        });

        const rotate = animatedProgress.interpolate({
            inputRange: [0, 1, 150],
            outputRange: ["0deg", "180deg", "0deg"],
        });
        const opacity = animatedProgress.interpolate({
            inputRange: [0, 1],
            outputRange: [0, 1],
        });

        return (
            <Animated.View
                style={[
                    {
                        width: 40,
                        opacity,
                    },
                    {
                        transform: [{ scale: size }, { translateX: translate }, { rotateY: rotate }],
                    },
                    isMyNextMessage ? {
                        marginBottom: 2,
                        marginLeft: 15
                    } : {
                        marginBottom: 10
                    }
                ]}
            >
                <View style={{
                    flex: 1,
                    justifyContent: 'center',
                    alignItems: 'center',
                }}>
                    <MaterialCommunityIcons name='arrow-right-top-bold' size={30} color={theme?.text} />
                </View>
            </Animated.View>
        )
    }

    const onSwipeableOpenAction = () => {
        setReplyOnSwipeOpen()
    }

    const darkModeTextColor = theme?.amberGlow === "#e2521d" ? theme?.text : theme?.white
    const darkModeBgColor = theme?.amberGlow === "#e2521d" ? theme?.text : theme?.white

  return (
    <GestureHandlerRootView>
        <Swipeable
            ref={bubbleRef}
            friction={3}
            leftThreshold={40}
            renderLeftActions={renderLeftAction} 
            onSwipeableOpen={onSwipeableOpenAction}
        >
            <TouchableHighlight 
                key={msgId || index} 
                accessible={true}
                accessibilityLabel={`${msgContent}, Message from ${isCurrentUser ? "you" : msgSenderUsername || "a group member"} at ${formatTime(msgTime)}. Swipe right to reply.`}
                accessibilityHint={`${selectedMessages.includes(msgId) ? "Message selected" : "Message not selected"}`}
                onPress={msgPress}
                underlayColor="rgba(0, 0, 0, 0.05)"
                style={[
                    {
                        flexDirection: 'row', 
                        justifyContent: justifyContent, 
                        marginBottom: 10,
                        marginTop: 0,
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
                                : (isCurrentUser ? theme?.misty : theme?.horizon),
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
                        {/* bubble point */}
                        <View
                            style={{
                                position: "absolute",
                                top: -10,
                                left: isCurrentUser ? -10 : "unset",
                                right: isCurrentUser ? "unset" : -10,
                                width: 25,
                                height: 25,
                                backgroundColor: isCurrentUser ? theme?.misty : theme?.horizon,
                                // zIndex: -1,
                                transform: [{rotate: isCurrentUser ? "45deg" : "225deg"}],
                                borderBottomLeftRadius: 2,
                                // borderBottomRightRadius: 5,
                            }}
                        />
                        {/* end of bubble point */}
                        {/* reply preview */}
                        {message?.replyMessageContent && (
                            <TouchableOpacity 
                                style={styles.replyPreview}
                                onPress={() => onReplyPress(message?.replyTo)}
                                accessible={true}
                            >
                                <MaterialCommunityIcons name='reply' size={15} color={theme?.white} />
                                <AppText numberOfLines={3} style={{fontSize: 12}} color={theme?.white}>{message.replyMessageContent}</AppText>
                            </TouchableOpacity>
                        )}
                        {/* end of reply preview */}
                    <View 
                        style={[styles.flagIndicator, {backgroundColor: msgSentiment === "negative" ? "red" : "green", borderRadius: 15, borderWidth: 1, borderBlockColor: theme?.black}]}
                        accessible={true}
                        accessibilityLabel={msgSentiment === "negative" ? "Negative message" : "Positive message"}
                        accessibilityHint='This message has been flagged for tone. Double tap to view reason.'
                    />
                    <AppText style={{
                        fontSize: 14, 
                        fontWeight: 'bold',
                        paddingBottom: 5,
                        }}
                        color={isCurrentUser ? theme?.midnight : darkModeTextColor}
                    >{msgContent}</AppText>
                    {/* time and name */}
                    <View style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                    }}>
                        <AppText 
                            style={{fontSize: 7, fontWeight: 'bold'}} 
                            color={darkModeTextColor} 
                            numberOfLines={1}>{isCurrentUser ? "You" : msgSenderUsername}</AppText>
                        <AppText
                            style={{
                                fontSize: 6,
                                fontWeight: 'bold',
                                marginHorizontal: 5,
                            }}
                            color={isCurrentUser ? theme?.midnight : darkModeTextColor}
                        >{formatTime(msgTime)}</AppText>
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
    replyPreview: {
        borderLeftWidth: 2,
        borderLeftColor: 'gray',
        paddingLeft: 8,
        marginBottom: 5,
    },
});

export default MessageBubble;