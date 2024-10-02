import React from 'react';
import { View, StyleSheet, Text, TouchableOpacity } from 'react-native';

import CustomModal from '../CustomModal';
import AppText from '../AppText';
import { useTheme } from '../../utils/ThemeContext';
import PopupModal from './PopupModal';

const ToneFlagModal = ({visible, message, sentimentColor, flagReason="neutral", closeModal}) => {

    const {theme} = useTheme();

  return (
    <>
    <PopupModal
      visible={visible}
      closeModal={closeModal}
    >
      <View style={styles.modalInner}>
        <View style={[styles.infoBox, {
          backgroundColor: theme?.misty,
        }]}>
          <AppText style={{fontSize: 20, fontWeight: 'bold', marginBottom: 10, textAlign: "center"}} color={theme?.white}>Flagged message</AppText>
          <AppText style={{fontSize: 16, marginBottom: 10}} color={theme?.white}>This message has a <Text style={{color: sentimentColor}}>{flagReason}</Text> tone.</AppText>
          <AppText style={{fontSize: 16}} color={theme?.white}>Messages with abusive/offensive language are not allowed.</AppText>
        </View>
        <View style={styles.buttonBox}>
          <TouchableOpacity 
            style={[styles.button, {
              backgroundColor: theme?.punch,
            }]}
            onPress={closeModal}
          >
            <AppText style={{fontSize: 16}} color={theme?.white}>Close</AppText>
          </TouchableOpacity>
        </View>
      </View>
    </PopupModal>
    </>
  );
}

const styles = StyleSheet.create({
    memberBox: {
        padding: 10,
        height: "100%",
        borderRadius: 10,
    },
    modalInner: {
        flex: 1,
        padding: 20,
        gap: 20,
    },
    infoBox: {
        flex: 2,
        borderRadius: 20,
        padding: 10,
    },
    buttonBox: {
        flex: 1,
        borderRadius: 20,
    },
    button: {
        padding: 10,
        borderRadius: 10,
        alignItems: 'center',
        width: "50%",
        alignSelf: 'center',
    },

});

export default ToneFlagModal;