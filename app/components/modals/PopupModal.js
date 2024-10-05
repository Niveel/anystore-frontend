import React from 'react';
import { View, StyleSheet, Modal, TouchableOpacity, TouchableWithoutFeedback, Keyboard } from 'react-native';

import Icon from '../Icon';
import { useTheme } from '../../utils/ThemeContext';

const PopupModal = ({visible, children, closeModal}) => {
    if( !visible ) return null;
    const { theme } = useTheme();
    const darkModeBgColor = theme?.amberGlow === "#e2521d" ? theme?.midnight : theme?.midnightLight
  return (
    <Modal
      animationType="slide"
      visible={visible}
      onRequestClose={closeModal}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={[styles.container, {backgroundColor: darkModeBgColor}]}>
          <View style={[styles.head, {backgroundColor: theme?.horizon}]}>
              <TouchableOpacity
                  style={[styles.closeButton, {borderColor: theme?.white}]}
                  onPress={closeModal}
                  accessible={true}
                  accessibilityLabel="Close"
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
      </TouchableWithoutFeedback>
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