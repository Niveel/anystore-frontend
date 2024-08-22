import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';

import CustomModal from '../CustomModal';
import AppText from '../AppText';
import { useTheme } from '../../utils/ThemeContext';

const ReportMsgModal = ({visible, msgString, cancelPress, reportPress, ...otherProps}) => {

    const {theme} = useTheme();

  return (
    <CustomModal visible={visible} {...otherProps} >
          <View style={[styles.memberBox, {backgroundColor: theme?.midnight,}]}>
            <View style={{
              backgroundColor: theme?.horizon,
            }}>
              <AppText style={{fontSize: 18, fontWeight: 'bold', marginBottom: 10, textAlign: "center"}} color={theme?.white}>Report Message</AppText>
              <AppText style={{fontSize: 16, marginBottom: 10, textAlign: "center"}} color={theme?.white}>Are you sure you want to report {msgString}?</AppText>
              <AppText style={{fontSize: 16, marginBottom: 10, textAlign: "center"}} color={theme?.white}>Allow up to 24 hours for us to review and get back to you.</AppText>
            </View>
            <View style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              gap: 10,
              marginTop: 10,
            }}>
              <TouchableOpacity 
                style={{
                  backgroundColor: theme?.punch,
                  padding: 10,
                  borderRadius: 5,
                }}
                onPress={cancelPress}
              >
                <AppText style={{fontSize: 16}} color={theme?.amberGlow}>Cancel</AppText>
              </TouchableOpacity>
              <TouchableOpacity 
                style={{
                  padding: 10,
                  borderRadius: 5,
                  backgroundColor: theme?.amberGlow,
                }}
                onPress={reportPress}
              >
                <AppText style={{ fontSize: 16}} color={theme?.midnight}>Report</AppText>
              </TouchableOpacity>
            </View>
          </View>
        </CustomModal>
  );
}

const styles = StyleSheet.create({
    memberBox: {
      padding: 10,
      height: "100%",
      borderRadius: 10,
    },
});

export default ReportMsgModal;