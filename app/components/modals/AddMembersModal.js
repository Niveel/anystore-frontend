import React, {useMemo} from 'react';
import { View, StyleSheet, FlatList, TouchableOpacity } from 'react-native';

import AppText from '../AppText';
import { useTheme } from '../../utils/ThemeContext';
import SearchInput from '../SearchInput';
import PopupModal from './PopupModal';
import UserCard from '../UserCard';


const AddMembersModal = ({visible, groupName, searchQuery, onChangeQueryText, searchResults, addedMembers, disabled, addMemberToGroup,closeModal}) => {

    const {theme} = useTheme();

    const memoisedSearchResults = useMemo(() => searchResults, [searchResults]);

  return (
    <>
      <PopupModal
        visible={visible}
        closeModal={closeModal}
      >
        <View style={[styles.memberBox, {backgroundColor: theme?.midnight,}]}>
              <AppText style={{fontSize: 18, fontWeight: 'bold', marginBottom: 10, textAlign: "center"}} color={theme?.misty}>Add members to {groupName}</AppText>
              <View style={{
                marginVertical: 10,
              }}>
                <SearchInput
                  placeholder="Search username"
                  placeholderTextColor={theme?.mistyLight}
                  value={searchQuery}
                  onChangeText={onChangeQueryText}
                />
              </View>

              <FlatList
                data={memoisedSearchResults}
                keyExtractor={result => result?.id?.toString()}
                contentContainerStyle={{
                  paddingBottom: 70,
                }}
                renderItem={({ item }) => (
                  <UserCard
                    disabled={disabled}
                    bgColor={addedMembers.includes(item.id) ? theme?.blackLight : theme?.horizon}
                    onPress={() => {addMemberToGroup(item?.id, item?.username)}}
                    textColor={addedMembers.includes(item.id) ? theme?.misty : theme?.midnight}
                    accessible={true}
                    accessibilityLabel={addedMembers.includes(item.id) ? `${item?.username} already added to group` : `Add ${item?.username} to ${groupName}`}
                    accessibilityHint='Double tap to add this user to the group.'
                    userName={item?.username}
                    userImg={item?.profileImage}
                  />
                )}
              />
            </View>
      </PopupModal>
    </>

  );
}

const styles = StyleSheet.create({
    memberBox: {
        padding: 10,
        height: "100%",
        borderRadius: 10,
    },
});

export default AddMembersModal;