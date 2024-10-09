import React from 'react';
import { View, StyleSheet, TouchableOpacity, SafeAreaView } from 'react-native';

import AppText from '../AppText';
import { useTheme } from '../../utils/ThemeContext';
import PopupModal from './PopupModal';

const ReportMsgModal = ({visible, msgString, reportPress, closeModal}) => {

    const {theme} = useTheme();

  return (
    <>
      <PopupModal
        visible={visible}
        closeModal={closeModal}
      >
        <SafeAreaView>
          <View style={styles.modalInner}>
            <View style={[styles.infoBox, {
              backgroundColor: theme?.misty,
            }]}>
              <AppText style={{fontSize: 20, fontWeight: 'bold', marginBottom: 10, textAlign: "center"}} color={theme?.white}>Report Message</AppText>
                <AppText style={{fontSize: 16, marginBottom: 10}} color={theme?.white}>Are you sure you want to report {msgString}?</AppText>
                <AppText style={{fontSize: 16}} color={theme?.white}>Allow up to 24 hours for us to review and get back to you.</AppText>
            </View>
            <View style={styles.buttonBox}>
              <TouchableOpacity 
                style={[styles.button, {
                  backgroundColor: theme?.punch,
                }]}
                onPress={closeModal}
              >
                <AppText style={{fontSize: 16}} color={theme?.white}>Cancel</AppText>
                </TouchableOpacity>
                <TouchableOpacity 
                    style={[styles.button, {
                      backgroundColor: theme?.horizon,
                    }]}
                    onPress={reportPress}
                  >
                    <AppText style={{ fontSize: 16}} color={theme?.midnight}>Report</AppText>
                  </TouchableOpacity>
            </View>
          </View>
        </SafeAreaView>
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
      flexDirection: "row",
      justifyContent: "space-between",
      padding: 10,
    },
    button: {
      borderRadius: 10,
      width: "48%",
      height: 50,
      justifyContent: "center",
      alignItems: "center",
    },
});

export default ReportMsgModal;