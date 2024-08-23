import React from 'react';
import { View, StyleSheet, FlatList, TouchableHighlight, Alert } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import CustomModal from '../CustomModal';
import AppText from '../AppText';
import { useTheme } from '../../utils/ThemeContext';

const ViewMembersModal = ({visible, groupName, isCreatedGroup, groupMembers, userId, removeMember, numOfUsersOnline, ...otherProps}) => {

    const {theme} = useTheme();

  return (
    <CustomModal visible={visible} {...otherProps} >
          <View style={[styles.memberBox, {backgroundColor: theme?.midnight,}]}>
            <AppText style={{fontSize: 20, fontWeight: 'bold', marginBottom: 10, textAlign: "center"}} color={theme?.amberGlow}>Members in {groupName}</AppText>
            {!isCreatedGroup && <AppText style={{fontSize: 15, textAlign: "center", marginBottom: 10}}>Group creator is hidden</AppText>}
            <AppText style={{fontSize: 12, textAlign: "right", marginBottom: 10}} color={theme?.text}>{numOfUsersOnline} {numOfUsersOnline == 1 ? "User" : "Users"} online</AppText>
              <FlatList
                data={groupMembers}
                keyExtractor={member => member?.id?.toString()}
                renderItem={({ item }) => (
                  <View style={[styles.memberList, {backgroundColor: theme?.horizon,}]}>
                    <AppText style={{fontSize: 16}} color={theme?.white}>{item.username}</AppText>
                    {item.id === userId && <View>
                      <MaterialCommunityIcons name="account" size={24} color={theme?.amberGlow} />
                      <AppText style={{fontSize: 12}} color={theme?.white}>You</AppText>
                    </View>}
                    {isCreatedGroup && item.id !== userId && <TouchableHighlight
                      style={{
                        backgroundColor: theme?.mistyLight,
                        padding: 5,
                        borderRadius: 5,
                      }}
                      underlayColor={theme?.midnight}
                      onPress={() => {
                        Alert.alert(
                          'Remove Member',
                          `Are you sure you want to remove ${item.username} from the group?`,
                          [
                            {
                              text: 'No',
                              onPress: () => console.log('Cancel Pressed'),
                              style: 'cancel'
                            },
                            { text: 'YES', 
                              onPress: () => removeMember(item.id) }
                          ],
                          { cancelable: true }
                        );
                        
                      }}
                    >
                      <MaterialCommunityIcons name="account-remove" size={24} color={theme?.amberGlow} />
                    </TouchableHighlight>}
                  </View>
                )}
              />
          </View>
        </CustomModal>
  );
}

const styles = StyleSheet.create({
    memberBox: {
        padding: 10,
        height: "100%",
        borderRadius: 10,
    },
    memberList: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 10,
        borderRadius: 5,
        marginBottom: 10,
    },
});

export default ViewMembersModal;