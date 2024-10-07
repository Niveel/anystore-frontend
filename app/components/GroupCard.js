import React, {useEffect, useState, useMemo} from 'react';
import { View, StyleSheet, TouchableOpacity, Image, TouchableWithoutFeedback } from 'react-native';

import AppText from './AppText';
import { useTheme } from '../utils/ThemeContext';
import userImg from '../assets/user.jpg';
import fetchMessages from '../api/fetchMessages';

const GroupCard = ({groupName, groupId, onPress, date, groupImg, openGroupImg, ...otherProps}) => {
    const [messages, setMessages] = useState([]);
    const [lastMessageToShow, setLastMessageToShow] = useState("");
    const {theme} = useTheme();

    useEffect(() => {
        const fetch = async () => {
            try {
                const response = await fetchMessages.fetchMessages(groupId);
                setMessages(response.data);
            } catch (error) {
                console.log("Error fetching messages in group card", error);
            }
        }
        fetch();
    }, [messages]);

    const lastMessage = useMemo(() => {
        if (messages && messages.length > 0) {
            const lastMsg = messages[messages.length - 1].content;

            try {
                const parsedMessage = JSON.parse(lastMsg);

                if (parsedMessage && parsedMessage.images) {
                    return parsedMessage.images[0];
                }
            } catch (e) {
                return lastMsg;
            }
        }
        return "No messages yet";
    }, [messages]); 

    useEffect(() => { 
        setLastMessageToShow(lastMessage);
    }, [messages]);

    
  return (
    <TouchableOpacity  
        style={[styles.groupCard, {backgroundColor: theme?.midnightLight,}]} 
        onPress={onPress}
        accessible={true}
        accessibilityLabel={`Open ${groupName} chatroom`}
        activeOpacity={0.7}
        {...otherProps}
    >
        <TouchableWithoutFeedback 
            onPress={openGroupImg}
            accessible={true}
            accessibilityLabel={`View ${groupName} group image`}
        >
            <View style={styles.imageBox}>
                <Image source={{ uri: groupImg}} style={styles.image} />
            </View>
        </TouchableWithoutFeedback>
        <View style={styles.info}>
            <AppText style={styles.name} numberOfLines={1}>{groupName}</AppText>
            {
                lastMessageToShow.includes("https://") ? 
                <Image source={{uri: lastMessageToShow}} style={styles.lastMsgImg} /> :
                <AppText style={styles.text} numberOfLines={2}>{lastMessageToShow}</AppText>
            }
            <AppText style={styles.date} color={theme?.amberGlowLight}>{date}</AppText>
        </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
    groupCard: {
        padding: 10,
        height: 90,
        justifyContent: "space-between",
        marginVertical: 5,
        borderRadius: 5,
        flexDirection: 'row',
        gap: 10,
    },
    name: {
        fontSize: 14,
        letterSpacing: .02,
        fontWeight: 'bold',
    },
    date: {
        fontSize: 8,
        alignSelf: 'flex-end',
    },
    imageBox: {
        width: 70,
        height: 70,
        borderRadius: 50,
        backgroundColor: 'rgba(0,0,0,.1)',
        alignSelf: 'center',
    },
    image: {
        width: "100%",
        height: "100%",
        borderRadius: 50,
        resizeMode: 'cover',
    },
    info: {
        flex: 1,
        justifyContent: 'space-between',
    },
    text: {
        fontSize: 11,
        letterSpacing: .02,
    },
    lastMsgImg: {
        width: 38, 
        height: 40, 
        borderRadius: 5,
        resizeMode: 'contain',
    }
});

export default GroupCard;