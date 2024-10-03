import React from 'react';
import { View, TouchableHighlight, Image, TouchableOpacity } from 'react-native';

import { useTheme } from '../utils/ThemeContext';
import AppText from './AppText';

const MessageProductBubble = ({msgPress, justifyContent, index, msgId, selectedMessageIds, isCurrentUser, msgSenderUsername, msgTime, selectedMessages, msgIsInFlaggedMessages, longPress, productPress, productTitle, productImageUrl, ...otherProps}) => {

    const {theme} = useTheme();

    const formatTime = (time) => {
        const date = new Date(time);
        return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true });
    };

    const darkModeTextColor = theme?.amberGlow === "#e2521d" ? theme?.text : theme?.white

  return (
    <TouchableHighlight
        key={msgId || index}
        style={[
            {
                flexDirection: 'row',
                justifyContent: justifyContent,
                marginBottom: 15,
                marginTop: index === 0 ? 10 : 0,
            },
            msgId && selectedMessageIds.includes(msgId) && {backgroundColor: theme?.mistyLight, borderWidth: 1, borderColor: theme?.amberGlow, borderRadius: 5, padding: 2}
        ]}
        onPress={msgPress}
        underlayColor={theme?.light}
        {...otherProps}
    >
        <TouchableOpacity
            style={[
                {
                backgroundColor: msgIsInFlaggedMessages 
                    ? theme?.punch 
                    : (isCurrentUser ? theme?.misty : theme?.horizon),
                padding: 10,
                borderRadius: 5,
                maxWidth: '80%',
                minWidth: 80,
                }
                
            ]}
            onLongPress={longPress}
            onPress={productPress}
            accessible={true}
            accessibilityLabel={`${productTitle}, product link from ${isCurrentUser ? "you" : msgSenderUsername || "a group member"} at ${formatTime(msgTime)}`}
            accessibilityHint={`${selectedMessages.includes(msgId) ? "Product link selected" : "Product link not selected"}`}
        >
        {/* Render product image and title */}
            <Image 
                source={{ uri: productImageUrl || "https://img.freepik.com/free-vector/illustration-gallery-icon_53876-27002.jpg?size=626&ext=jpg&ga=GA1.1.1700460183.1713139200&semt=ais" }} 
                style={{ 
                width: 200, 
                height: 250, 
                marginBottom: 5,
                borderRadius: 5,
                resizeMode: 'cover',
                }} 
            />
            <AppText style={{ 
                color: theme?.white, 
                fontSize: 16, 
                fontWeight: 'bold', 
                textTransform: "capitalize" 
                }} 
                numberOfLines={1}
                color={darkModeTextColor}
            >{productTitle}</AppText>
            {/* time and name */}
            <View style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
            }}>
                <AppText 
                    style={{fontSize: 8, fontWeight: 'bold'}} 
                    color={theme?.white}
                    numberOfLines={1}
                >{isCurrentUser ? "You" : msgSenderUsername}</AppText>
                <AppText
                    style={{
                        fontSize: 8,
                        fontWeight: 'bold',
                        marginHorizontal: 5,
                    }}
                    color={isCurrentUser ? theme?.midnight : darkModeTextColor}
                >{formatTime(msgTime)}</AppText>
            </View>
            {/* end of time and name */}
        </TouchableOpacity>
    </TouchableHighlight>
  );
}

export default MessageProductBubble;