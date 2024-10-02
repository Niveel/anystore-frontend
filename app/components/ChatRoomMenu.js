import React from 'react';
import { View, StyleSheet, TouchableHighlight } from 'react-native';

import { useTheme } from '../utils/ThemeContext';
import AppText from './AppText';

const ChatRoomMenu = ({py, px, viewMembers, isCreatedGroup, exitGroup, deleteGroup, blockUser, setGroupImage }) => {

  const { theme } = useTheme();

  return (
    <View style={[styles.menuContainer, { top: py + 10, left: px - 150, backgroundColor: theme?.midnight, zIndex: 3, elevation: 5, backgroundColor: theme?.midnight, }]}>
          <TouchableHighlight 
            style={styles.menuItem} 
            onPress={viewMembers}
            underlayColor={theme?.blackLight}
          >
            <AppText style={styles.menuItemText} color={theme?.misty}>View Members</AppText>
          </TouchableHighlight>
          {/* joined groups menu */}
          {!isCreatedGroup && <TouchableHighlight 
            style={styles.menuItem} 
            onPress={exitGroup}
            underlayColor={theme?.blackLight}
          >
            <AppText style={styles.menuItemText} color={theme?.misty}>Exit Group</AppText>
          </TouchableHighlight>}

          {/* created group menu */}
          {isCreatedGroup &&  <TouchableHighlight 
            style={styles.menuItem} 
            onPress={deleteGroup}
            underlayColor={theme?.blackLight}
          >
            <AppText style={styles.menuItemText} color={theme?.misty}>Delete Group</AppText>
          </TouchableHighlight>}

          {/* created group menu */}
          {isCreatedGroup &&  <TouchableHighlight 
            style={styles.menuItem} 
            onPress={setGroupImage}
            underlayColor={theme?.blackLight}
          >
            <AppText style={styles.menuItemText} color={theme?.misty}>Set Group Image</AppText>
          </TouchableHighlight>}
          
          {/* joined groups menu */}
          {!isCreatedGroup && <TouchableHighlight 
            style={styles.menuItem} 
            onPress={blockUser}
            underlayColor={theme?.blackLight}
          >
            <AppText style={styles.menuItemText} color={theme?.misty}>Block User</AppText>
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
        zIndex: 3,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
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