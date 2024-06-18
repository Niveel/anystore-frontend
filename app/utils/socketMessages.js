import AsyncStorage from "@react-native-async-storage/async-storage";

export const storeMessagesToStorage = async (messages) => {
    try {
        await AsyncStorage.setItem('messages', JSON.stringify(messages))
    } catch (error) {
        console.error('Error storing messages to storage:', error);
    }
}

export const getMessagesFromStorage = async () => {
    try {
        const messages = await AsyncStorage.getItem('messages')
        return messages ? JSON.parse(messages) : []
    } catch (error) {
        console.error('Error getting messages from storage:', error);
    }
} 
