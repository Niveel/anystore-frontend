import React, { useEffect } from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import Animated, {useAnimatedStyle, useSharedValue, withTiming} from 'react-native-reanimated';

import { useTheme } from '../utils/ThemeContext';
import AppText from './AppText';

const ReplyMessage = ({clearReply, message, username}) => {
    const boxHeight = useSharedValue(0);
    const {theme} = useTheme();

    const toggleBox = (isOpen ) => {
        boxHeight.value = withTiming(isOpen ? 65 : 0, {duration: 300});
    }

    useEffect(() => {
        toggleBox(message !== undefined);
    }, [message]);

    const animatedStyle = useAnimatedStyle(() => {
        return {
            height: boxHeight.value,
            opacity: boxHeight.value > 0 ? 1 : 0,
        };
    })

  return (
    <Animated.View 
        style={[
            styles.container,
            animatedStyle,
            {backgroundColor: theme?.horizon, borderTopColor: theme?.misty,}
        ]}
        accessible={true}
        accessibilityLabel="Reply message"
    >
        <View style={styles.replyMessage}>
            <View style={styles.replyMessageHeader}>
                <View style={styles.replyMessageHeaderLeft}>
                    <MaterialCommunityIcons name='reply' size={20} color={theme?.midnight} />
                    <AppText style={styles.replyMessageSender} color={theme?.white}>{username}</AppText>
                </View>
                <TouchableOpacity 
                    onPress={clearReply} 
                    style={[styles.close, {borderColor: theme?.white}]}
                    accessible={true}
                    accessibilityLabel="Close reply"
                >
                    <MaterialCommunityIcons name='close' size={12} color={theme?.white} />
                </TouchableOpacity>
            </View>
            <AppText style={styles.replyMessageContent} color={theme?.amberGlow} numberOfLines={2}>{message}</AppText>
        </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    borderTopWidth: 0.5,
    width: '95%',
    alignSelf: 'center',
    borderRadius: 10,
    marginBottom: 2,
  },
    replyMessage: {
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'flex-start',
        width: '100%',
    },
    replyMessageHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '100%',
        paddingHorizontal: 5,
    },
    replyMessageHeaderLeft: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
    },
    replyMessageSender: {
        fontSize: 14,
        fontWeight: 'bold',
        marginLeft: 5,
    },
    replyMessageContent: {
        fontSize: 14,
        marginLeft: 5,
    },
    close: {
        borderWidth: 1,
        borderRadius: 15,
        width: 20,
        height: 20,
        justifyContent: "center",
        alignItems: "center"
    }
});

export default ReplyMessage;