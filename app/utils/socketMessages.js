import AsyncStorage from "@react-native-async-storage/async-storage";

const storeMessage = async (message) => {
    try {
        const existingMessages = await AsyncStorage.getItem('messages');
        let messages = existingMessages ? JSON.parse(existingMessages) : [];
        messages = [...messages, message];
        await AsyncStorage.setItem('messages', JSON.stringify(messages))
    } catch (error) {
        console.error('Error storing message:', error);
    }
}

const getMessages = async () => {
    try {
        const messages = await AsyncStorage.getItem('messages')
        return messages ? JSON.parse(messages) : []
    } catch (error) {
        console.error('Error getting messages:', error);
    }
} 

export default {storeMessage, getMessages};