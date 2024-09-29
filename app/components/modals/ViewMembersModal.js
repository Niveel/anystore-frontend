import React, {useMemo} from 'react';
import { View, StyleSheet, FlatList, TouchableHighlight, Alert, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import AppText from '../AppText';
import { useTheme } from '../../utils/ThemeContext';
import PopupModal from '../modals/PopupModal';

const ViewMembersModal = ({visible, groupName, isCreatedGroup, groupMembers, userId, removeMember, numOfUsersOnline,closeModal, ...otherProps}) => {

    const {theme} = useTheme();

    const memoisedList = useMemo(() => {
      return groupMembers.sort((a, b) => a.username.localeCompare(b.username));
    }, [groupMembers]);

  return (
    <PopupModal 
      visible={visible}
      closeModal={closeModal}
      {...otherProps}
    >
      <View style={[styles.memberBox, {backgroundColor: theme?.midnight,}]}>
            <AppText style={{
              fontSize: 20, 
              fontWeight: 'bold', 
              marginBottom: 10, 
              textAlign: "center"

            }} color={theme?.misty}>Members in {groupName}</AppText>
            {!isCreatedGroup && <AppText style={{
              fontSize: 12, 
              textAlign: "center", 
              marginBottom: 10

            }}>Group creator is hidden</AppText>}
            <AppText style={{
              fontSize: 12, 
              textAlign: "right", 
              marginBottom: 10
            }} color={theme?.text}>{numOfUsersOnline} {numOfUsersOnline == 1 ? "User" : "Users"} online</AppText>
              <FlatList
                data={memoisedList}
                keyExtractor={member => member?.id?.toString()}
                showsVerticalScrollIndicator={false}
                renderItem={({ item }) => (
                  <TouchableOpacity 
                    style={[styles.memberList, {
                      backgroundColor: theme?.horizon,
                    }]}
                    activeOpacity={0.9}
                  >
                    <AppText style={{fontSize: 16}} color={theme?.white}>{item.username}</AppText>
                    {item.id === userId && <View>
                      <MaterialCommunityIcons name="account" size={24} color={theme?.midnight} />
                      <AppText style={{fontSize: 12}} color={theme?.white}>You</AppText>
                    </View>}
                    {isCreatedGroup && item.id !== userId && <TouchableHighlight
                      style={{
                        backgroundColor: theme?.misty,
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
                  </TouchableOpacity>
                )}
              />
      </View>
    </PopupModal>
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