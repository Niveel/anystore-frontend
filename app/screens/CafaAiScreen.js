import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TextInput, FlatList, TouchableWithoutFeedback, TouchableOpacity, KeyboardAvoidingView, Keyboard, StyleSheet, ActivityIndicator } from 'react-native';
import axios from 'axios';

import Screen from '../components/Screen';
import { useTheme } from '../utils/ThemeContext';

const CafaAiScreen = ({ route }) => {
  const [messages, setMessages] = useState([
    { id: 0, text: 'Hello! I am Cafa, your product assistant. Ask me anything about this product, and I will help you!', sender: 'bot' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false); 
  const { theme } = useTheme();

  const productTitle = route?.params?.product.title;

  const scrollViewRef = useRef();

  const handleSend = async () => {
    if (input.trim()) {
      const newMessage = { id: messages.length, text: input, sender: 'user' };
      setMessages((prevMessages) => [...prevMessages, newMessage]);
      setInput('');
      Keyboard.dismiss();

      setLoading(true);

      try {
        const response = await axios.get(`https://imprezbookkeeping.pythonanywhere.com/ask-ai/?product_details=${productTitle}&&user_question=${newMessage?.text}`, {
          timeout: 10000
        });

        const botResponse = response?.data?.answer || "I'm sorry, I couldn't understand your request.";
        const botMessage = { id: messages.length + 1, text: botResponse, sender: 'bot' };

        setMessages((prevMessages) => [...prevMessages, botMessage]);

      } catch (error) {
        const errorMessage = { id: messages.length + 1, text: "Oops! Something went wrong. Please try again.", sender: 'bot' };
        setMessages((prevMessages) => [...prevMessages, errorMessage]);
        console.error('Error responding to message:', error);
      } finally {
        setLoading(false); 
      }
    }
  };

  useEffect(() => {
    if(scrollViewRef.current) {
      scrollViewRef.current.scrollToEnd({ animated: true });
    }
  }, [messages]);

  const renderItem = ({ item }) => (
    <View style={[styles.messageBubble, item.sender === 'bot' ? [styles.botBubble, { backgroundColor: theme?.misty }] : [styles.userBubble, { backgroundColor: theme?.horizon }]]}>
      <Text
        style={item.sender === 'bot' ? { color: theme?.midnight } : { color: theme?.amberGlow }}
      >{item.text}</Text>
    </View>
  );

  return (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
      <Screen style={[styles.container, { backgroundColor: theme?.midnight }]}>
        <KeyboardAvoidingView style={{ backgroundColor: theme?.midnight, padding: 10, paddingRight: 5, height: "100%", paddingBottom: 20 }}>
          <FlatList
            data={messages}
            keyExtractor={(item) => item.id.toString()}
            renderItem={renderItem}
            contentContainerStyle={styles.messagesContainer}
            ref={scrollViewRef}
          />
          {loading && (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color={theme?.amberGlow} />
              <Text style={{ color: theme?.text }}>Cafa is thinking...</Text>
            </View>
          )}
          <View style={[styles.inputContainer, { backgroundColor: theme?.horizon }]}>
            <TextInput
              style={[styles.textInput, { backgroundColor: theme?.horizon, color: theme?.text, borderColor: theme?.white }]}
              value={input}
              onChangeText={setInput}
              placeholder="Ask Cafa about the product"
              placeholderTextColor={theme?.text}
              onSubmitEditing={handleSend}
              multiline
              selectionColor={theme?.text}
            />
            <TouchableOpacity
              style={[styles.sendBtn, { backgroundColor: theme?.amberGlow }]}
              onPress={handleSend}
              accessible={true}
              accessibilityLabel="Send message"
            >
              <Text style={{ color: theme?.midnight }}>Send</Text>
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
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 20,
  },
});

export default CafaAiScreen;
