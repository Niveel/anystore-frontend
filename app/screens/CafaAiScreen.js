import React, { useState } from 'react';
import { View, Text, TextInput, FlatList, TouchableWithoutFeedback, TouchableOpacity, KeyboardAvoidingView,Keyboard, StyleSheet } from 'react-native';

import Screen from '../components/Screen';
import { useTheme } from '../utils/ThemeContext';

const CafaAiScreen = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');

  const { theme } = useTheme();

  const handleSend = () => {
    if (input.trim()) {
      const newMessage = { id: messages.length, text: input, sender: 'user' };
      setMessages([...messages, newMessage]);
      setInput('');
      Keyboard.dismiss();

      // Simulate bot response
      setTimeout(() => {
        const botMessage = { id: messages.length + 1, text: "I'm here to help you!", sender: 'bot' };
        setMessages((prevMessages) => [...prevMessages, botMessage]);
      }, 1000);
    }
  };

  const renderItem = ({ item }) => (
    <View style={[styles.messageBubble, item.sender === 'bot' ? [styles.botBubble, {backgroundColor: theme?.misty}] : [styles.userBubble, {backgroundColor: theme?.horizon}]]}>
      <Text 
        style={item.sender === 'bot' ? {color: theme?.midnight} : {color: theme?.amberGlow}}
    >{item.text}</Text>
    </View>
  );

  return (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
      <Screen style={[styles.container, {backgroundColor: theme?.midnight}]}>
        <KeyboardAvoidingView style={{ backgroundColor: theme?.midnight, padding: 10, paddingRight: 5, height: "100%", paddingBottom: 70}}>
            <FlatList
                data={messages}
                keyExtractor={(item) => item.id.toString()}
                renderItem={renderItem}
                contentContainerStyle={styles.messagesContainer}
            />
            <View style={[styles.inputContainer, {backgroundColor: theme?.horizon}]}>
                <TextInput
                    style={[styles.textInput, {backgroundColor: theme?.horizon, color: theme?.text, borderColor: theme?.white}]}
                    value={input}
                    onChangeText={setInput}
                    placeholder="Ask Cafa about the product"
                    placeholderTextColor={theme?.text}
                    onSubmitEditing={handleSend}
                    multiline
                    selectionColor={theme?.text}
                />
                 <TouchableOpacity 
                    style={[styles.sendBtn, {backgroundColor: theme?.amberGlow}]} 
                    onPress={handleSend}
                    accessible={true}
                    accessibilityLabel="Send message"
                    >
                    <Text style={{color: theme?.midnight}}>Send</Text>
                </TouchableOpacity>
            </View>
        </KeyboardAvoidingView>
      </Screen>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 0,
  },
  messagesContainer: {
    padding: 10,
  },
  messageBubble: {
    padding: 10,
    borderRadius: 10,
    marginVertical: 5,
    maxWidth: '80%',
  },
  userBubble: {
    alignSelf: 'flex-end',
  },
  botBubble: {
    alignSelf: 'flex-start',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderRadius: 10,
    marginRight: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
    sendBtn: {
        padding: 10,
        borderRadius: 5,
        alignItems: 'center',
        justifyContent: 'center',
    },
  textInput: {
    flex: 1,
    padding: 10,
    borderWidth: 1,
    borderRadius: 20,
    marginRight: 10,
  },
});

export default CafaAiScreen;
