import React from 'react';
import { View, StyleSheet, Text } from 'react-native';

import CustomModal from '../CustomModal';
import AppText from '../AppText';
import { useTheme } from '../../utils/ThemeContext';

const ToneFlagModal = ({visible, message, sentimentColor, flagReason="neutral", ...otherProps}) => {

    const {theme} = useTheme();

  return (
    <CustomModal visible={visible} {...otherProps}>
         <View style={[styles.memberBox, {backgroundColor: theme?.horizon,}]}>
            <View style={{
              backgroundColor: theme?.midnight,
              borderRadius: 10,
              padding: 10,
            }}>
              <AppText style={{fontSize: 18, fontWeight: 'bold', marginBottom: 10, textAlign: "center"}} color={theme?.white}>Flagged message</AppText>
              <AppText style={{fontSize: 16, marginBottom: 10, textAlign: "center"}} color={theme?.white} numberOfLines={3}>{message}</AppText> 
              <AppText style={{fontSize: 16, marginBottom: 10, textAlign: "center"}} color={theme?.white}>This message has a <Text style={{color: sentimentColor}}>{flagReason}</Text> tone.</AppText>
              <AppText style={{fontSize: 14, marginBottom: 10, textAlign: "center"}} color={theme?.white}>Messages with abusive/offensive language are not allowed.</AppText>
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

export default ToneFlagModal;