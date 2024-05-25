import React from 'react';
import { View, StyleSheet, Modal, TouchableHighlight, TouchableWithoutFeedback, Keyboard } from 'react-native';
import {MaterialCommunityIcons} from '@expo/vector-icons'

import colors from '../config/colors'

function CustomModal({visible, onPress, children}) {

  return (
    <Modal visible={visible} animationType="slide" >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <View style={styles.container}>
                <View style={styles.body}>
                {children}
                </View>
                <TouchableHighlight 
                    style={styles.closeBtn}
                    onPress={onPress}
                >
                    <MaterialCommunityIcons name="close" size={40} color={colors.amberGlow} />
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
        backgroundColor: colors.horizon,
    },
    closeBtn: {
        position: 'absolute',
        top: 10,
        right: 20,

    },
    
});

export default CustomModal;