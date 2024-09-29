import React from 'react';
import { View, StyleSheet, TextInput, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons, FontAwesome } from '@expo/vector-icons';

import { useTheme } from '../utils/ThemeContext';
import ReplyMessage from './ReplyMessage';
import useAuth from '../auth/useAuth';

const ChatInput = ({message, setMessage, sendMessage, reply, clearReply, onScroll}) => {

    const {theme} = useTheme();
    const {user} = useAuth();

    const isCurrentUser = reply?.sender?._id === user?._id || reply?.sender === user?.id;

    const onPressScroll = () => {
        if(onScroll) {
            onScroll();
        }
    }

  return (
    <View>
        <ReplyMessage 
            clearReply={clearReply} 
            message={reply?.content} 
            username={isCurrentUser ? 'You' : reply?.sender?.username || "You"} 
        />
        <View style={{paddingHorizontal: 10, backgroundColor: "transparent"}}>
            <View style={[styles.chatInputContainer, { backgroundColor: theme?.horizon,}]}>
                <TextInput
                    placeholder='Type your message here...'
                    placeholderTextColor={theme?.mistyLight}
                    selectionColor={theme?.misty}
                    style={[styles.chatInput, {backgroundColor: theme?.midnight, color: theme?.misty,}]}
                    multiline
                    autoCapitalize='none'
                    value={message}
                    onChangeText={text => setMessage(text)}
                    onFocus={()=> onPressScroll()}
                    onBlur={()=> onPressScroll()}
                    accessible={true}
                    accessibilityLabel="Type your message here"
                />
                <TouchableOpacity 
                    style={[styles.sendBtn, {backgroundColor: theme?.midnight,}]} 
                    onPress={sendMessage}
                    accessible={true}
                    accessibilityLabel="Send message"
                >
                    <FontAwesome name="send" size={25} color={theme?.horizon} />
                </TouchableOpacity>
            </View>
        </View>
    </View>
  );
}

const styles = StyleSheet.create({
    chatInput: {
        width: "85%",
        height: "100%",
        fontSize: 15,
        borderRadius: 50,
        paddingHorizontal: 10,
    },
    chatInputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 5,
        padding: 5,
        paddingRight: 10,
        width: '100%',
        height: 60,
        borderRadius: 50,
        elevation: 5,
    },
    sendBtn: {
        padding: 5,
        borderRadius: 50,
        width: "15%",
        alignItems: 'center',
        justifyContent: 'center',
        height: "100%",
    },
});

export default ChatInput;