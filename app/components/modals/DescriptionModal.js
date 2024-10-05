import React from 'react';
import { View, StyleSheet, Modal, ScrollView, TouchableOpacity, Dimensions } from 'react-native';

import { useTheme } from '../../utils/ThemeContext';
import AppText from '../AppText';
import Icon from '../Icon';

const { height } = Dimensions.get('window');

const DescriptionModal = ({visible, children, header="heading", closeModal, ...otherProps}) => {
    if( !visible ) return null;
    const { theme } = useTheme();
    const darkModeTextColor = theme?.amberGlow === "#e2521d" ? theme?.text : theme?.white
  return (
    <Modal
        visible={visible}
        animationType="slide"
        {...otherProps}
        statusBarTranslucent={true}
        onRequestClose={closeModal}
        transparent={true}
    >
        <View style={[styles.container, {backgroundColor: theme?.blackLight}]}>
            <View style={[styles.modal, {
                backgroundColor: theme?.midnight
            }]}>
                {/* head */}
                <View style={[styles.header, {backgroundColor: theme?.horizon}]}>
                    <AppText style={styles.headText} color={darkModeTextColor}>{header}</AppText>
                    <TouchableOpacity
                        style={[styles.closeButton, {borderColor: darkModeTextColor}]}
                        onPress={closeModal}
                        accessible={true}
                        accessibilityLabel="Close"
                    >
                        <Icon 
                            name="close" 
                            size={25} 
                            color={darkModeTextColor}
                        />
                    </TouchableOpacity>
                </View>
                {/* body */}
                <ScrollView 
                    style={{
                        flex: 1, 
                        padding: 10, 
                    }}
                    contentContainerStyle={{
                        paddingBottom: 10,
                    }}
                    showsVerticalScrollIndicator={false}
                >
                    {children}
                </ScrollView>
                {/* end of body */}
            </View>
        </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },
    header: {
        
        padding: 10,
    },
    headText: {
        fontSize: height > 700 ? 20 : 18,
        textAlign: 'center',
    },
    closeButton: {
        position: 'absolute',
        right: 10,
        top: 10,
        borderWidth: 2,
        borderRadius: 50,
        padding: 2,
    },
    modal: {
        height: height - 400,
        width: '100%',
    },
});

export default DescriptionModal;