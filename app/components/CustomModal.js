import React from 'react';
import { View, StyleSheet, Modal, TouchableHighlight, TouchableWithoutFeedback, Keyboard } from 'react-native';
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
                <View style={styles.body}>
                {children}
                </View>
                <TouchableHighlight 
                    style={styles.closeBtn}
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
        paddingVertical: 30,
        borderRadius: 5,
        height: "100%",
    },
    container: {
        paddingHorizontal: 10,
        paddingVertical: 40,
        flex: 1,
    },
    closeBtn: {
        position: 'absolute',
        top: 10,
        right: 20,

    },
    
});

export default CustomModal;