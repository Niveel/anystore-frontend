import React from 'react';
import { Modal, View, Text, TouchableOpacity, StyleSheet, TouchableWithoutFeedback } from 'react-native';

const MessageOptionsDialog = ({ visible, onClose, onFlag, onDelete, onReport }) => {
  return (
    <Modal
      transparent={true}
      animationType="slide"
      visible={visible}
      onRequestClose={onClose}
    >
        <TouchableWithoutFeedback>
            <View style={styles.modalBackground}>
                <View style={styles.modalContainer}>
                <TouchableOpacity onPress={onFlag} style={styles.option}>
                    <Text style={styles.optionText}>Flag as inappropriate</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={onDelete} style={styles.option}>
                    <Text style={styles.optionText}>Delete</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={onReport} style={styles.option}>
                    <Text style={styles.optionText}>Report message</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={onClose} style={[styles.option, styles.cancel]}>
                    <Text style={styles.optionText}>Cancel</Text>
                </TouchableOpacity>
                </View>
            </View>
        </TouchableWithoutFeedback>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalBackground: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.2)',
  },
  modalContainer: {
    width: 300,
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
  },
  option: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  optionText: {
    fontSize: 16,
  },
  cancel: {
    borderBottomWidth: 0,
    marginTop: 10,
  },
});

export default MessageOptionsDialog;
