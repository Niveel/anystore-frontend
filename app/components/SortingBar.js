import React, { useState } from 'react';
import { View, Text, Modal, TouchableOpacity, StyleSheet } from 'react-native';
import { useTheme } from '../utils/ThemeContext';
import AppText from './AppText';

const SortingBar = ({ onSortOptionSelected }) => {
  const [priceModalVisible, setPriceModalVisible] = useState(false);
  const [ratingModalVisible, setRatingModalVisible] = useState(false);
  const [showMenu, setShowMenu] = useState(false);

  const { theme } = useTheme();

  const handlePriceSortSelect = (option) => {
    onSortOptionSelected(option);
    setPriceModalVisible(false);
  };

  const handleRatingSortSelect = (option) => {
    onSortOptionSelected(option);
    setRatingModalVisible(false);
  };

  return (
    <View style={styles.container}>
      {/* Main Sort button */}
      <TouchableOpacity onPress={() => setShowMenu(prev => !prev)} style={[styles.sortButton, { backgroundColor: theme?.misty }]}>
        <Text style={styles.sortButtonText}>Sort</Text>
      </TouchableOpacity>

      {/*  menu for Price and Rating */}
      <Modal
        transparent={true}
        animationType="slide"
        visible={showMenu}
        onRequestClose={() => setShowMenu(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContainer, {backgroundColor: theme?.misty}]}>
            <TouchableOpacity
              style={[styles.optionButton, {backgroundColor: theme?.amberGlow, marginBottom: 8}]}
              onPress={() => {
                setPriceModalVisible(true);
                setShowMenu(false);
              }}
            >
              <AppText style={styles.optionText} color={theme?.white}>Price</AppText>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.optionButton, {backgroundColor: theme?.horizon}]}
              onPress={() => {
                setRatingModalVisible(true);
                setShowMenu(false);
              }}
            >
              <AppText style={styles.optionText} color={theme?.white}>Rating</AppText>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => setShowMenu(false)} style={styles.cancelButton}>
              <AppText style={styles.cancelText} color={theme?.punch}>Cancel</AppText>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Modal for sorting by Price */}
      <Modal
        transparent={true}
        animationType="slide"
        visible={priceModalVisible}
        onRequestClose={() => setPriceModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContainer, {backgroundColor: theme?.misty}]}>
            <TouchableOpacity onPress={() => handlePriceSortSelect('highest')} style={[styles.optionButton, {
              backgroundColor: theme?.amberGlow,
              marginBottom: 10,
            }]}>
              <Text style={[styles.optionText, {color: theme?.white}]}>Highest Price First</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => handlePriceSortSelect('lowest')} style={[styles.optionButton, {
              backgroundColor: theme?.horizon,
            }]}>
              <Text style={[styles.optionText, {color: theme?.white}]}>Lowest Price First</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setPriceModalVisible(false)} style={styles.cancelButton}>
              <Text style={[styles.cancelText, {color: theme?.punch}]}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Modal for sorting by Rating */}
      <Modal
        transparent={true}
        animationType="slide"
        visible={ratingModalVisible}
        onRequestClose={() => setRatingModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContainer, {backgroundColor: theme?.midnight}]}>
            <TouchableOpacity onPress={() => handleRatingSortSelect('highest_rating')} style={styles.optionButton}>
              <Text style={[styles.optionText, {color: theme?.text}]}>Highest Rating First</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => handleRatingSortSelect('lowest_rating')} style={styles.optionButton}>
              <Text style={[styles.optionText, {color: theme?.text}]}>Lowest Rating First</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setRatingModalVisible(false)} style={styles.cancelButton}>
              <Text style={[styles.cancelText, {color: theme?.punch}]}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sortButton: {
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  sortButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
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
  optionButton: {
    padding: 10,
    width: '100%',
    alignItems: 'center',
    borderRadius: 5,
  },
  optionText: {
    fontSize: 16,
    textAlign: 'center',
  },
  cancelButton: {
    marginTop: 30,
    width: '100%',
    textAlign: 'center',
    justifyContent: 'center',
    alignItems: 'center',
  },
  cancelText: {
    fontSize: 16,
  },
  priceRangeBox: {
    width: '100%',
    padding: 10,
    borderRadius: 5,
  },
});

export default SortingBar;
