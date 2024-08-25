import React from 'react';
import { View, StyleSheet, TouchableHighlight } from 'react-native';

import { useTheme } from '../utils/ThemeContext';
import AppText from './AppText';

const ChatRoomMenu = ({py, px, viewMembers, isCreatedGroup, exitGroup, deleteGroup, blockUser }) => {

  const { theme } = useTheme();

  return (
    <View style={[styles.menuContainer, { top: py + 10, left: px - 150, backgroundColor: theme?.midnight, zIndex: 3, elevation: 5, backgroundColor: theme?.midnight, }]}>
          <TouchableHighlight 
            style={styles.menuItem} 
            onPress={viewMembers}
            underlayColor={theme?.blackLight}
          >
            <AppText style={styles.menuItemText} color={theme?.amberGlow}>View Members</AppText>
          </TouchableHighlight>
          {!isCreatedGroup && <TouchableHighlight 
            style={styles.menuItem} 
            onPress={exitGroup}
            underlayColor={theme?.blackLight}
          >
            <AppText style={styles.menuItemText} color={theme?.amberGlow}>Exit Group</AppText>
          </TouchableHighlight>}

          {isCreatedGroup &&  <TouchableHighlight 
            style={styles.menuItem} 
            onPress={deleteGroup}
            underlayColor={theme?.blackLight}
          >
            <AppText style={styles.menuItemText} color={theme?.amberGlow}>Delete Group</AppText>
          </TouchableHighlight>}
          
          {!isCreatedGroup && <TouchableHighlight 
            style={styles.menuItem} 
            onPress={blockUser}
            underlayColor={theme?.blackLight}
          >
            <AppText style={styles.menuItemText} color={theme?.amberGlow}>Block User</AppText>
          </TouchableHighlight>}
        </View>
  );
}

const styles = StyleSheet.create({
    menuContainer: {
        position: 'absolute',
        borderRadius: 5,
        paddingVertical: 5,
        paddingHorizontal: 10,
    },
    menuItem: {
        padding: 8,
        borderRadius: 5,
    },
      menuItemText: {
        fontSize: 16,
    },
});

export default ChatRoomMenu;