import React, {useState, useRef} from 'react';
import { View, StyleSheet, Modal, TouchableOpacity, Dimensions, SafeAreaView, Platform } from 'react-native';
import Carousel from 'react-native-snap-carousel';

import { useTheme } from '../../utils/ThemeContext';
import AppText from '../AppText';
import { Home, FavStoreInfo, RadarInfo, CritInfo } from '../tutorial';
import AppButton from '../AppButton';

const { width: screenWidth } = Dimensions.get('window')

const AppInfoModal = ({visible=false, onClose}) => {
    const { theme } = useTheme();
    const [currentIndex, setCurrentIndex] = useState(0);
    const carouselRef = useRef(null);
    const isIos = Platform.OS === 'ios';

    const tutorialScreens = [
        { key: 'home', component: <Home /> },
        { key: 'favStoreInfo', component: <FavStoreInfo /> },
        { key: 'radarInfo', component: <RadarInfo /> },
        { key: 'critInfo', component: <CritInfo /> },
    ];

    const goToNext = () => {
        if (currentIndex < tutorialScreens.length - 1) {
            carouselRef.current.snapToNext();
        } else {
            onClose()
        }
    };

    const goToPrev = () => {
        if (currentIndex > 0) {
            carouselRef.current.snapToPrev();
        }
    };

    const darkModeBgColor = theme?.amberGlow === "#e2521d" ? theme?.midnight : theme?.misty
    const darkModeTextColor = theme?.amberGlow === "#e2521d" ? theme?.text : theme?.white

  return (
    <Modal 
        visible={visible} 
        animationType="slide"
        onRequestClose={onClose}
    >
        <SafeAreaView>
            <View style={[styles.container, {backgroundColor: darkModeBgColor}]}>
                <View style={styles.skipBox}>
                    <TouchableOpacity 
                        onPress={onClose} 
                        style={[styles.skip, {backgroundColor: theme.punch}]}
                    >
                        <AppText color={darkModeTextColor}>Skip</AppText>
                    </TouchableOpacity>
                </View>
                <View style={[styles.innerBox, {backgroundColor: theme?.horizon}]}>
                    {/* tutorial carousel */}
                    <Carousel
                        ref={carouselRef}
                        data={tutorialScreens}
                        renderItem={({ item }) => (
                            <View style={styles.carouselItem}>
                                {item.component}
                            </View>
                        )}
                        sliderWidth={screenWidth}
                        itemWidth={screenWidth}
                        onSnapToItem={(index) => setCurrentIndex(index)} // Update index when swiped
                    />
                    {/* end of tutorial carousel */}
                </View>
                {/* controls */}
                    <View style={[styles.controlBox, {backgroundColor: darkModeBgColor}]}>
                        {currentIndex > 0 &&
                            <AppButton 
                            title="Prev" 
                            onPress={goToPrev} 
                            style={[styles.ctrlBtn]}
                            width='35%'
                            textColor={darkModeTextColor}
                            color={theme?.amberGlow}
                        />}
                        <AppButton 
                            title={currentIndex < tutorialScreens.length - 1 ? 'Next' : 'Finish'} 
                            onPress={goToNext} 
                            style={[styles.ctrlBtn, {backgroundColor: theme?.horizon}]}
                            width='35%'
                            textColor={darkModeTextColor}
                        />
                    </View>
                {/* end of controls */}
            </View>
        </SafeAreaView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
    controlBox: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 10,
        borderRadius: 10,
        width: '100%',
        flex: 1,
    },
    ctrlBtn: {
        paddingVertical: 5,
        paddingHorizontal: 15,
        borderRadius: 45,
    },
    innerBox: {
        flex: 7,
        borderRadius: 10,
        padding: 10,
    },
    skip: {
        paddingHorizontal: 15,
        paddingVertical: 5,
        borderRadius: 5,
    },
    skipBox: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'flex-end',
        paddingHorizontal: 20,
    },
});

export default AppInfoModal;
