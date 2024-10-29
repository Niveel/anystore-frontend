import React, {useState, useRef, useEffect} from 'react';
import { View, StyleSheet, FlatList, Image, Dimensions, Animated, TouchableOpacity } from 'react-native';

// custom imports
import ad1 from '../assets/ad_1.jpg';
import ad2 from '../assets/ad_2.jpg';
import ad3 from '../assets/ad_3.jpg';
import ad4 from '../assets/ad_4.jpg';
import ad5 from '../assets/ad_5.jpg';
import { useTheme } from '../utils/ThemeContext';

const ads = [ad1, ad2, ad3, ad4, ad5];
const { height, width } = Dimensions.get('window');

const ImageComponent = ({ image }) => (
    <TouchableOpacity 
        style={styles.imgBox}
        accessible={true}
        accessibilityLabel="Product ad image"
        activeOpacity={0.95}
    >
        <Image source={image} style={styles.image} />
    </TouchableOpacity>
);

const AdCarousel = () => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const { theme } = useTheme();

    const slidesRef = useRef(null);
    const scrollX = useRef(new Animated.Value(0)).current;

    const viewableItemsChanged = useRef(({ viewableItems }) => {
        if (viewableItems.length > 0) {
            setCurrentIndex(viewableItems[0].index);
        }
    }).current;
    const viewConfig = useRef({ viewAreaCoveragePercentThreshold: 50 }).current;

    // Auto scroll
    useEffect(() => {
        const interval = setInterval(() => {
            if (currentIndex < ads.length - 1) {
                slidesRef.current.scrollToIndex({ 
                    index: currentIndex + 1,
                    animated: true
                });
            } else {
                slidesRef.current.scrollToIndex({ 
                    index: 0,
                    animated: true
                });
            }
        }, 5000);

        return () => clearInterval(interval);
    }, [currentIndex]);

    const IndexIndicator = () => (
        <View style={styles.indicatorContainer}>
            {ads.map((_, i) => (
                <View 
                    key={i}
                    style={[
                        styles.indicator,
                        {backgroundColor: i === currentIndex ? theme?.amberGlow : theme?.mistyLight}
                    ]}
                />
            ))}
        </View>
    );

  return (
    <View style={styles.container}>
        <FlatList
            data={ads}
            keyExtractor={(item, index) => index.toString()}
            horizontal
            showsHorizontalScrollIndicator={false}
            renderItem={({ item }) => <ImageComponent image={item} />}
             pagingEnabled
             bounces={false}
             contentContainerStyle={{paddingVertical: 5}}
             onScroll={Animated.event(
                 [{nativeEvent: {contentOffset: {x: scrollX}}}],
                 {useNativeDriver: false}
             )}
             onViewableItemsChanged={viewableItemsChanged}
             viewabilityConfig={viewConfig}
             ref={slidesRef}
        />
        <IndexIndicator />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    paddingVertical: 5,
    paddingLeft: 5,
  },
  image: {
    width: "100%",
    height: "100%",
    borderRadius: 10,
    resizeMode: 'cover',
  },
    imgBox: {
        flex: 1,
        width: width - 10,
        height: height / 5,
        borderRadius: 10,
        overflow: 'hidden',
        paddingHorizontal: 5,
    },
    indicatorContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
    },
    indicator: {
        height: 8,
        width: 8,
        borderRadius: 5,
        margin: 4,
    },
});

export default AdCarousel;