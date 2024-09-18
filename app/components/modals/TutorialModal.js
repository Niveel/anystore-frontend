import React, {useState, useRef} from 'react';
import { View, StyleSheet, Modal, TouchableOpacity, Dimensions } from 'react-native';
import Carousel from 'react-native-snap-carousel';
import { useNavigation } from '@react-navigation/native';

import { useTheme } from '../../utils/ThemeContext';
import AppText from '../AppText';
import {useTutorial} from '../../utils/TutorialContext';
import { Home, FavStoreInfo, RadarInfo, CritInfo } from '../tutorial';

const { width: screenWidth } = Dimensions.get('window')

const TutorialModal = () => {
    const { theme } = useTheme();
    const { showTutorial, removeTutorialValue,} = useTutorial();
    const [currentIndex, setCurrentIndex] = useState(0);
    const carouselRef = useRef(null);
    const navigation = useNavigation();

    const tutorialScreens = [
        { key: 'home', component: <Home /> },
        { key: 'favStoreInfo', component: <FavStoreInfo /> },
        { key: 'radarInfo', component: <RadarInfo /> },
        { key: 'critInfo', component: <CritInfo /> },
    ];

    const skipTutorial = () => {
        removeTutorialValue();
        navigation.navigate('App', {screen: 'Product'});
    }

    const goToNext = () => {
        if (currentIndex < tutorialScreens.length - 1) {
            carouselRef.current.snapToNext();
        } else {
            skipTutorial();
            
        }
    };

    const goToPrev = () => {
        if (currentIndex > 0) {
            carouselRef.current.snapToPrev();
        }
    };

  return (
    <Modal 
        visible={showTutorial} 
        animationType="slide"
    >
      <View style={[styles.container, {backgroundColor: theme?.midnight}]}>
        <TouchableOpacity onPress={skipTutorial} style={[styles.skip, {backgroundColor: theme.punch}]}>
            <AppText>Skip</AppText>
        </TouchableOpacity>
        <View style={[styles.innerBox, {backgroundColor: theme?.horizon}]}>
            <View style={[styles.controlBox, {backgroundColor: theme?.mistyLight}]}>
                <TouchableOpacity
                    onPress={goToPrev}
                    style={[styles.ctrlBtn,{backgroundColor: theme?.midnight}]} 
                >
                    <AppText>Prev</AppText>
                </TouchableOpacity>
                <TouchableOpacity
                    onPress={goToNext}
                    style={[styles.ctrlBtn,{backgroundColor: theme?.amberGlow}]} 
                >
                    <AppText color={theme?.midnight}>Next</AppText>
                </TouchableOpacity>
            </View>
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
      </View>
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
        width: '95%',
        alignSelf: 'center',
        padding: 5,
        bottom: 15,
        position: 'absolute',
        borderRadius: 10,
        zIndex: 2,
    },
    ctrlBtn: {
        paddingVertical: 5,
        paddingHorizontal: 15,
        borderRadius: 5,
    },
    innerBox: {
        width: '100%',
        height: "90%",
        marginTop: 50,
        borderRadius: 10,
        padding: 10,
    },
    skip: {
        alignSelf: 'flex-end',
        paddingHorizontal: 15,
        paddingVertical: 5,
        borderRadius: 5,
        position: 'absolute',
        zIndex: 2,
        right: 10,
        top: 40,
    }
});

export default TutorialModal;