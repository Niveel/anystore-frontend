import React, { useState } from 'react';
import { View, Modal, TouchableOpacity, StyleSheet, Text, TextInput, ToastAndroid, Platform , Alert} from 'react-native';
import Slider from '@react-native-community/slider'; 
import { useTheme } from '../utils/ThemeContext';

import AppText from './AppText';

const FilterBar = ({ onFilterApply }) => {
  const [priceModalVisible, setPriceModalVisible] = useState(false);
  const [minPrice, setMinPrice] = useState(1); 
  const [maxPrice, setMaxPrice] = useState(59999); 

  const { theme } = useTheme();

  const handleFilterApply = () => {
    if(minPrice) {
      onFilterApply({ minPrice, maxPrice });
      setPriceModalVisible(false);
    } else {
      const errorMessage = 'Please enter a valid price range';
      if (Platform.OS === 'android') {
        ToastAndroid.show(errorMessage, ToastAndroid.SHORT);
      } else {
        Alert.alert('Error', errorMessage);
      }
    }
  };

  const formatPrice = (price) => {
    return price.toLocaleString(); 
  };

  const handleMinPriceChange = (value) => {
    const newMinPrice = Math.round(value);
    setMinPrice(newMinPrice);

    // Adjust the max price if it is lower than the new min price
    if (maxPrice < newMinPrice) {
      setMaxPrice(newMinPrice);
    }
  };

  const handleMaxPriceChange = (value) => {
    setMaxPrice(Math.round(value));
  };

  const handleMinPriceInputChange = (text) => {
    if (text === '') {
      setMinPrice(0); 
      return;
    }
  
    const newMinPrice = parseFloat(text);
    if (!isNaN(newMinPrice) && newMinPrice <= maxPrice) {
      setMinPrice(newMinPrice);
    } else {
      const errorMessage = 'Min price must be less than or equal to max price';
  
      if (Platform.OS === 'android') {
        ToastAndroid.show(errorMessage, ToastAndroid.SHORT);
      } else {
        Alert.alert('Error', errorMessage);
      }
    }
  };

  const handleMaxPriceInputChange = (text) => {
    const newMaxPrice = parseFloat(text);
    if (!isNaN(newMaxPrice) && newMaxPrice >= minPrice) {
        setMaxPrice(newMaxPrice);
    } else if (text === '') { 
        setMaxPrice('');
    } else {
        const errorMessage = 'Max price must be greater than min price';

        if (Platform.OS === 'android') {
            ToastAndroid.show(errorMessage, ToastAndroid.SHORT);
        } else {
            Alert.alert('Error', errorMessage); 
        }
    }
  };

  return (
    <View style={styles.container}>
      {/* Main Filter button */}
      <TouchableOpacity onPress={() => setPriceModalVisible(true)} style={[styles.filterButton, { backgroundColor: theme?.misty }]}>
        <AppText style={styles.filterButtonText} color={theme?.white}>Filter</AppText>
      </TouchableOpacity>

      {/* Modal for Price Filter */}
      <Modal
        transparent={true}
        animationType="slide"
        visible={priceModalVisible}
        onRequestClose={() => setPriceModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContainer, { backgroundColor: theme?.midnight }]}>
            <AppText style={[styles.optionText, { color: theme?.text }]}>Select Price Range</AppText>

            {/* Price Range Sliders */}
            <View style={styles.sliderContainer}>
                <View style={styles.priceInputWrapper}>
                    <Text style={{ color: theme?.text }}>Min: ${formatPrice(minPrice)}</Text>
                    <TextInput 
                        style={[styles.textInput, {backgroundColor: theme?.misty, color: theme?.midnight, fontWeight: 'bold'}]}
                        selectionColor={theme?.punch}
                        keyboardType="numeric"
                        maxLength={3}
                        placeholder='Min Price'
                        placeholderTextColor={theme?.horizon}
                        value={minPrice !== '' ? minPrice.toString() : ''}
                        onChangeText={handleMinPriceInputChange}
                    />
                </View>
                <Slider
                    style={styles.slider}
                    minimumValue={1}
                    maximumValue={59999}
                    value={minPrice}
                    onValueChange={handleMinPriceChange}
                    minimumTrackTintColor={theme?.amberGlow}
                    maximumTrackTintColor={theme?.misty}
                    thumbTintColor={theme?.punch}
                />

                <View style={styles.priceInputWrapper}>
                    <Text style={{ color: theme?.text }}>Max: ${formatPrice(maxPrice)}</Text>
                    <TextInput 
                        style={[styles.textInput, {backgroundColor: theme?.misty, color: theme?.midnight, fontWeight: 'bold'}]}
                        selectionColor={theme?.punch}
                        keyboardType="numeric"
                        maxLength={5}
                        placeholder='Max Price'
                        placeholderTextColor={theme?.horizon}
                        value={maxPrice !== '' ? maxPrice.toString() : ''} 
                        onChangeText={handleMaxPriceInputChange}
                    />
                </View>
                <Slider
                    style={styles.slider}
                    minimumValue={minPrice}
                    maximumValue={59999}
                    step={1}
                    value={maxPrice}
                    onValueChange={handleMaxPriceChange}
                    minimumTrackTintColor={theme?.amberGlow}
                    maximumTrackTintColor={theme?.misty}
                    thumbTintColor={theme?.punch}
                />
            </View>

            {/* Apply Button */}
            <TouchableOpacity onPress={handleFilterApply} style={[styles.applyButton, { backgroundColor: theme?.amberGlow }]}>
              <Text style={[styles.applyButtonText, { color: theme?.midnight }]}>Apply Filter</Text>
            </TouchableOpacity>

            {/* Cancel Button */}
            <TouchableOpacity onPress={() => setPriceModalVisible(false)} style={[styles.cancelButton, { backgroundColor: theme?.horizon }]}>
              <Text style={[styles.cancelText, { color: theme?.punch }]}>Cancel</Text>
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
  filterButton: {
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  filterButtonText: {
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'center',
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
  },
  optionText: {
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 20,
  },
  sliderContainer: {
    width: '100%',
    marginBottom: 20,
  },
  slider: {
    width: '100%',
    height: 40,
  },
  applyButton: {
    paddingVertical: 10,
    borderRadius: 5,
    marginBottom: 10,
  },
  applyButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  cancelButton: {
    paddingVertical: 10,
    borderRadius: 5,
  },
  cancelText: {
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  priceInputWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  textInput: {
    padding: 5,
    borderRadius: 5,
    width: '40%',
  },
});

export default FilterBar;
