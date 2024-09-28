import React from 'react';
import { View, StyleSheet, Modal, TouchableOpacity } from 'react-native';

import Icon from '../Icon';
import { useTheme } from '../../utils/ThemeContext';

const PopupModal = ({visible, children, closeModal}) => {
    if( !visible ) return null;
    const { theme } = useTheme();
  return (
    <Modal
      animationType="slide"
      visible={visible}
      onRequestClose={closeModal}
    >
      <View style={[styles.container, {backgroundColor: theme?.midnightLight}]}>
        <View style={[styles.head, {backgroundColor: theme?.horizon}]}>
            <TouchableOpacity
                style={[styles.closeButton, {borderColor: theme?.white}]}
                onPress={closeModal}
            >
                <Icon
                    name="close"
                    size={30}
                    color={theme?.white}
                />
            </TouchableOpacity>
        </View>
        {children}
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
    closeButton: {
        padding: 8,
        borderRadius: 50,
        borderWidth: 2,
    },  
    head: {
        flexDirection: "row",
        justifyContent: "flex-end",
        padding: 10,
    },
});

export default PopupModal;