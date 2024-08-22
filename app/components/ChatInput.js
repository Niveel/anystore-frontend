import React from 'react';
import { View, StyleSheet, TextInput, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import { useTheme } from '../utils/ThemeContext';

const ChatInput = ({message, setMessage, sendMessage}) => {

    const {theme} = useTheme();

  return (
    <View style={[styles.chatInputContainer, { backgroundColor: theme?.horizon,}]}>
        <TextInput
        placeholder='Type your message here...'
        placeholderTextColor={theme?.white}
        style={[styles.chatInput, {backgroundColor: theme?.midnight, color: theme?.white,}]}
        multiline
        autoCapitalize='none'
        value={message}
        onChangeText={text => setMessage(text)}
        />
        <TouchableOpacity 
            style={[styles.sendBtn, {backgroundColor: theme?.midnight,}]} 
            onPress={sendMessage}
            accessible={true}
            accessibilityLabel="Send message"
        >
        <MaterialCommunityIcons name='send' size={35} color={theme?.amberGlow} />
        </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
    chatInput: {
        width: "80%",
        height: "100%",
        fontSize: 16,
        borderRadius: 5,
        paddingHorizontal: 10,
    },
    chatInputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 5,
        paddingVertical: 10,
        paddingHorizontal: 5,
        paddingRight: 10,
        width: '100%',
        height: 80,
        borderRadius: 5,
        elevation: 5,
    },
    sendBtn: {
        padding: 10,
        borderRadius: 5,
        width: "20%",
        alignItems: 'center',
        justifyContent: 'center',
        height: "100%",
    },
});

export default ChatInput;