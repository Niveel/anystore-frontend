import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Modal, TouchableOpacity } from 'react-native';

import Screen from '../components/Screen';
import AppText from '../components/AppText';
import AppButton from '../components/AppButton';
import { useTheme } from '../utils/ThemeContext';

function ProductInfoScreen({ route }) {
  const {productData, rating} = route.params;
  const { theme } = useTheme();

  const [isRatingsModalVisible, setRatingsModalVisible] = useState(false);
  const [isReviewsModalVisible, setReviewsModalVisible] = useState(false);

  return (
    <Screen style={[styles.screen, { backgroundColor: theme?.midnight }]}>
      <ScrollView>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            padding: 10,
            borderBottomWidth: 1,
            borderBottomColor: theme?.blackLight,
            marginBottom: 20,
          }}
        >
          <AppButton
            title="Ratings"
            color={theme?.amberGlowLight}
            style={styles.buttonStyle}
            textStyle={styles.buttonTextStyle}
            onPress={() => setRatingsModalVisible(true)}
          />
          <AppButton
            title="Reviews"
            color={theme?.horizon}
            style={styles.buttonStyle}
            textStyle={styles.buttonTextStyle}
            onPress={() => setReviewsModalVisible(true)}
          />
        </View>

        <View>
          <AppText>{productData?.description}</AppText>
        </View>
      </ScrollView>

      {/* Ratings Modal */}
      <Modal
        visible={isRatingsModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setRatingsModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContainer, { backgroundColor: theme?.midnight }]}>
            <AppText style={{ fontSize: 18, fontWeight: 'bold' }}>Product Ratings</AppText>
            <AppText style={{fontSize: 30}} color={theme?.amberGlow}>{rating}</AppText>
            <TouchableOpacity
              style={[styles.closeButton, { backgroundColor: theme?.amberGlowLight }]}
              onPress={() => setRatingsModalVisible(false)}
            >
              <AppText style={{ color: '#fff' }}>Close</AppText>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Reviews Modal */}
      <Modal
        visible={isReviewsModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setReviewsModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContainer, { backgroundColor: theme?.midnight }]}>
            <AppText style={{ fontSize: 18, fontWeight: 'bold' }}>Product Reviews</AppText>
            <AppText>1. "Great product! Highly recommend."</AppText>
            <AppText>2. "Good value for the price."</AppText>
            <AppText>3. "Had some issues with shipping."</AppText>
            <TouchableOpacity
              style={[styles.closeButton, { backgroundColor: theme?.mistyLight }]}
              onPress={() => setReviewsModalVisible(false)}
            >
              <AppText style={{ color: '#fff' }}>Close</AppText>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </Screen>
  );
}

const styles = StyleSheet.create({
  screen: {
    padding: 10,
    paddingTop: 0,
  },
  buttonStyle: {
    borderRadius: 5,
    marginVertical: 10,
    width: 'max-content',
    paddingHorizontal: 10,
    height: 40,
    alignSelf: 'center',
  },
  buttonTextStyle: {
    fontSize: 14,
    fontWeight: 'normal',
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContainer: {
    width: '80%',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  closeButton: {
    marginTop: 20,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
});

export default ProductInfoScreen;
