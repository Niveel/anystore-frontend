import React, { useState } from 'react';
import { View, Text, Modal, TouchableOpacity, StyleSheet } from 'react-native';
import { useTheme } from '../utils/ThemeContext';

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
        <Text style={styles.sortButtonText}>Sort By</Text>
      </TouchableOpacity>

      {/* Dropdown menu for Price and Rating */}
      {showMenu && (
        <View style={{
          position: "absolute", top: "105%", left: "60%", backgroundColor: theme?.misty, paddingVertical: 10, 
          paddingHorizontal: 20, borderRadius: 5, gap: 10, zIndex: 99,
        }}>
          {/* Sort by Price */}
          <TouchableOpacity
            style={[styles.sortButton, { backgroundColor: theme?.midnightLight, borderWidth: 1 }]}
            onPress={() => {
              setPriceModalVisible(true);
              setShowMenu(false);
            }}
          >
            <Text style={styles.sortButtonText}>Price</Text>
          </TouchableOpacity>

          {/* Sort by Rating */}
          <TouchableOpacity
            style={[styles.sortButton, { backgroundColor: theme?.midnightLight, borderWidth: 1 }]}
            onPress={() => {
              setRatingModalVisible(true);
              setShowMenu(false);
            }}
          >
            <Text style={styles.sortButtonText}>Rating</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Modal for sorting by Price */}
      <Modal
        transparent={true}
        animationType="slide"
        visible={priceModalVisible}
        onRequestClose={() => setPriceModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContainer, {backgroundColor: theme?.midnight}]}>
            <TouchableOpacity onPress={() => handlePriceSortSelect('highest')} style={styles.optionButton}>
              <Text style={[styles.optionText, {color: theme?.text}]}>Highest Price First</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => handlePriceSortSelect('lowest')} style={styles.optionButton}>
              <Text style={[styles.optionText, {color: theme?.text}]}>Lowest Price First</Text>
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
    width: '100%',
    height: 50,
    marginBottom: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sortButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  sortButtonText: {
    color: '#fff',
    fontWeight: 'bold',
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
  },
  optionText: {
    fontSize: 16,
  },
  cancelButton: {
    marginTop: 10,
  },
  cancelText: {
    fontSize: 16,
  },
});

export default SortingBar;
