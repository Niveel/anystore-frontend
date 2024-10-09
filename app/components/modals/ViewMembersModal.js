import React, {useMemo} from 'react';
import { View, StyleSheet, FlatList, Alert, SafeAreaView } from 'react-native';

import AppText from '../AppText';
import { useTheme } from '../../utils/ThemeContext';
import PopupModal from '../modals/PopupModal';
import UserCard from '../UserCard';

const ViewMembersModal = ({visible, groupName, isCreatedGroup, groupMembers, userId, userImg, removeMember, numOfUsersOnline,closeModal, ...otherProps}) => {

    const {theme} = useTheme();

    const memoisedList = useMemo(() => {
      return groupMembers.sort((a, b) => a.username.localeCompare(b.username));
    }, [groupMembers]);

    // console.log("MEMOISED LIST", memoisedList);

  return (
    <PopupModal 
      visible={visible}
      closeModal={closeModal}
      {...otherProps}
    >
      <SafeAreaView>
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
                    <UserCard 
                      bgColor={theme?.horizon}
                      userName={item.username}
                      userImg={item?.profileImage}
                      isYou={item.id === userId}
                      isAdmin={isCreatedGroup && item.id !== userId}
                      removePress={() => {
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
                    />
                  )}
                />
        </View>
      </SafeAreaView>
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