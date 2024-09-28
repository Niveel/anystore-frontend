import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';

import AppText from './AppText';
import Icon from './Icon';
import { useTheme } from '../utils/ThemeContext';

const List = ({icon, title="list item", iconColor,accessibilityLabel, clickable=true, onPress, ...otherProps}) => {
    const {theme} = useTheme()

    iconColor = iconColor || theme.horizon
  return (
    <TouchableOpacity 
        style={[styles.container, {backgroundColor: theme.white, shadowColor: theme.black, }]}
        onPress={onPress}
        accessibilityLabel={accessibilityLabel}
        activeOpacity={clickable ? 0.6 : 0.97}
        {...otherProps}
    >
        {icon && <View style={styles.icon}>
            <Icon name={icon} size={30} color={iconColor} />
        </View>}
        <View>
            <AppText style={styles.text}>{title}</AppText>
        </View>
        {clickable && <View style={styles.arrow}>
            <Icon name="chevron-right" size={35} color={iconColor} />
        </View>}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    height: 60,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    elevation: .2,
    shadowOffset: {
        width: 0,
        height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    borderRadius: 10,
    paddingVertical: 5,
    paddingHorizontal: 10,
  },
  icon: {
    marginLeft: 6,
  },
});

export default List;