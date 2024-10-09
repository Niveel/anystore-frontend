import React, { useState, useEffect, useRef} from 'react';
import { View, Text, TextInput, FlatList, TouchableWithoutFeedback, TouchableOpacity, KeyboardAvoidingView, Keyboard, StyleSheet, ActivityIndicator, Platform, useWindowDimensions, Image } from 'react-native';
import axios from 'axios';

import Screen from '../components/Screen';
import { useTheme } from '../utils/ThemeContext';
import Icon from '../components/Icon';

const CafaAiScreen = ({ route }) => {
  const [messages, setMessages] = useState([
    { id: 0, text: 'Hello! I am Cafa, your product assistant. Ask me anything about this product, and I will help you!', sender: 'bot' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false); 
  const { theme } = useTheme();

  const productTitle = route?.params?.product.title;
  const productImage = route?.params?.product.images[0];

  const scrollViewRef = useRef();
  const { height } = useWindowDimensions();
  const keyboardVerticalOffset = Platform.select({
    ios: height > 700 ? 140 : 100, 
    android: height > 700 ? 80 : 90, 
  });
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
        style={item.sender === 'bot' ? { color: theme?.midnight } : { color: theme?.white }}
      >{item.text}</Text>
    </View>
  );

  return (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
      <Screen style={[styles.container, { backgroundColor: theme?.midnight }]}>
        <KeyboardAvoidingView 
          style={{ 
            backgroundColor: theme?.midnight, 
            paddingHorizontal: 10, 
            paddingTop: 5,
            paddingBottom: Platform.OS === 'ios' ? 40 : 15,
            height: '100%'
          }}
          behavior={Platform.OS === 'ios' ? 'padding': "height"}
          keyboardVerticalOffset={keyboardVerticalOffset}
        >
          <View style={[styles.productPreviewBOx, {backgroundColor: theme?.horizon}]}>
            <View style={styles.imageBox}>
              <Image source={{ uri: productImage }} style={styles.image} />
            </View>
            <View style={styles.details}>
              <Text style={{ color: theme?.white, fontSize: 20, fontWeight: "bold" }} numberOfLines={2}>{productTitle}</Text>
            </View>
          </View>
          <FlatList
            data={messages}
            keyExtractor={(item) => item.id.toString()}
            renderItem={renderItem}
            contentContainerStyle={styles.messagesContainer} 
            ref={scrollViewRef}
            // automaticallyAdjustKeyboardInsets
            showsVerticalScrollIndicator={false}
          />
          {loading && (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color={theme?.amberGlow} />
              <Text style={{ color: theme?.text }}>Cafa is thinking...</Text>
            </View>
          )}
          <View style={[styles.inputContainer, 
            { backgroundColor: theme?.horizon }
            ]}>
            <TextInput
              style={[styles.textInput, { backgroundColor: theme?.midnight, color: theme?.text, borderColor: theme?.white }]}
              value={input}
              onChangeText={setInput}
              placeholder="Ask Cafa about this product"
              placeholderTextColor={theme?.mistyLight}
              onSubmitEditing={handleSend}
              multiline
              selectionColor={theme?.text}
              verticalAlign='center'
            />
            <TouchableOpacity
              style={[styles.sendBtn, { backgroundColor: theme?.midnight }]}
              onPress={handleSend}
              accessible={true}
              accessibilityLabel="Send message"
            >
              <Icon name="send" size={25} color={theme?.horizon} />
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
    // padding: 10,
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
    padding: 5,
    borderRadius: 30,
    marginRight: 5,
    elevation: 5,
    height: 60,
  },
  sendBtn: {
    padding: 5,
    borderRadius: 55,
    alignItems: 'center',
    justifyContent: 'center',
    width: 50,
    height: 50,
  },
  textInput: {
    flex: 1,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderRadius: 25,
    marginRight: 10,
    maxHeight: 80,
    minHeight: 50,
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 20,
  },
  productPreviewBOx: {
    height: 70,
    borderRadius: 10,
    flexDirection: 'row',
  },
  imageBox: {
   flex: 1,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  details: {
    flex: 2.5,
    borderRadius: 10,
    padding: 5,
  },
  image: {
    width: 60, 
    height: 60, 
    resizeMode: "contain",
    borderRadius: 10,
  }
});

export default CafaAiScreen;
