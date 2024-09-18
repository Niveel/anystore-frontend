import React from 'react';
import { View, StyleSheet, Modal, TouchableHighlight, TouchableWithoutFeedback, Keyboard, Platform } from 'react-native';
import {MaterialCommunityIcons} from '@expo/vector-icons'

import { useTheme } from '../utils/ThemeContext';

function CustomModal({visible, onPress, children, ...otherProps}) {
    const {theme} = useTheme();

  return (
    <Modal 
        visible={visible} 
        animationType="slide" 
        {...otherProps}
    >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <View style={[styles.container, {backgroundColor: theme?.horizon}]}>
                <View style={[styles.body, {paddingVertical: Platform.OS === "ios" ? 50 : 30}]}>
                {children}
                </View>
                <TouchableHighlight 
                    style={[styles.closeBtn, {top: Platform.OS === "ios" ? 40 : 10}]}
                    onPress={onPress}
                    accessible={true}
                    accessibilityLabel="Close Modal"
                >
                    <MaterialCommunityIcons name="close" size={40} color={theme?.amberGlow} />
                </TouchableHighlight>
            </View>
        </TouchableWithoutFeedback>
    </Modal>
  );
}

const styles = StyleSheet.create({
    body: {
        padding: 10,
        borderRadius: 5,
        height: "100%",
    },
    container: {
        paddingHorizontal: 10,
        paddingVertical: 50,
        flex: 1,
    },
    closeBtn: {
        position: 'absolute',
        right: 20,

    },
    
});

export default CustomModal;