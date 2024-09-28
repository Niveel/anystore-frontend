import React, {useMemo, useRef, useImperativeHandle, forwardRef} from 'react';
import { View, StyleSheet } from 'react-native';
import BottomSheet from '@gorhom/bottom-sheet'

import { useTheme } from '../utils/ThemeContext';

const AppBottomSheet = forwardRef(({children}, ref) => {
  const snapPoints = useMemo(() => ['60%', '90%'], []);
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
      >{children}</BottomSheet>
  );
})

const styles = StyleSheet.create({
  container: {
    // flex: 1
  }
});

export default AppBottomSheet;