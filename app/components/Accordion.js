import React, { useState, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Animated, ScrollView , TouchableHighlight} from 'react-native';

import Icon from './Icon';
import colors from '../config/colors';

const Accordion = ({ title, content }) => {
  const [isExpanded, setExpanded] = useState(false);
  const animation = useRef(new Animated.Value(0)).current;

  const toggleAccordion = () => {
    setExpanded(!isExpanded);
    Animated.timing(animation, {
      toValue: isExpanded ? 0 : 1,
      duration: 300,
      useNativeDriver: false,
    }).start();
  };

  const contentHeight = animation.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 120], 
  });

  return (
    <View style={styles.container}>
      <TouchableHighlight 
        onPress={toggleAccordion} 
         
        underlayColor={colors.mistyLight}
      >
        <View style={styles.header}>
          <Text style={styles.title}>{title}</Text>
          <Icon
            name={isExpanded ? 'chevron-up' : 'chevron-down'}
            size={24}
            color={colors.amberGlowLight}
          />

        </View>
      </TouchableHighlight>

      <Animated.View style={[styles.content, { height: contentHeight }]}>
        <ScrollView style={styles.scrollView}>
          <Text style={styles.text}>{content}</Text>
        </ScrollView>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderColor: colors.amberGlowLight,
    borderWidth: 2,
    borderRadius: 5,
    overflow: 'hidden',
    width: "100%",
    // backgroundColor: colors.horizon,
  },
  header: {
    padding: 15,
    backgroundColor: colors.midnightLight,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.amberGlow,
    letterSpacing: 1,
  },
  content: {
    overflow: 'hidden',
    backgroundColor: colors.horizon,
  },
  scrollView: {
    padding: 10,
  },
  text: {
    fontSize: 16,
    color: colors.white,
    fontWeight: 'bold',
    letterSpacing: 1,
    paddingBottom: 20,
  },
});

export default Accordion;
