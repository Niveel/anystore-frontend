import React, {useMemo, useRef, useImperativeHandle, forwardRef} from 'react';
import { View, StyleSheet } from 'react-native';
import BottomSheet, {BottomSheetFlatList} from '@gorhom/bottom-sheet'

import { useTheme } from '../utils/ThemeContext';

const AppBottomSheet = forwardRef(({children, onClose, data,renderItem, contentContainerStyle, ...otherProps}, ref) => {
  const snapPoints = useMemo(() => ['60%', '90%', '100%'], []);
  const bottomSheetRef = useRef(null);
  const { theme } = useTheme();

  useImperativeHandle(ref, () => ({
    open: () => {
      bottomSheetRef.current?.snapToIndex(0);
    },
  }));

  return (
      <BottomSheet 
        snapPoints={snapPoints}
        index={-1}
        ref={bottomSheetRef}
        enablePanDownToClose={true}
        enableHandlePanningGesture={true}
        handleIndicatorStyle={{backgroundColor: theme?.horizon}}
        backgroundStyle={{backgroundColor: theme?.midnight}}
        onClose={onClose}
        accessible={true}
        focusable={true}
        onMagicTap={onClose}
        style={{
          flex: 1,
        }}
        {...otherProps}
      >
        {children}
        {data && 
        <BottomSheetFlatList
          data={data}
          renderItem={renderItem} 
          contentContainerStyle={contentContainerStyle} 
          keyExtractor={(item, index) => index.toString()} 
          nestedScrollEnabled={true} 
          numColumns={2}
          showsVerticalScrollIndicator={false}
        />}
      </BottomSheet>
  );
})

const styles = StyleSheet.create({
  container: {
    // flex: 1
  }
});

export default AppBottomSheet;