import React, {useMemo} from 'react';
import { View, StyleSheet, FlatList, TouchableOpacity } from 'react-native';

import AppText from '../AppText';
import { useTheme } from '../../utils/ThemeContext';
import SearchInput from '../SearchInput';
import PopupModal from './PopupModal';


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
                renderItem={({ item }) => (
                  <TouchableOpacity 
                    style={{
                      backgroundColor: addedMembers.includes(item.id) ? theme?.blackLight : theme?.horizon,
                      padding: 10,
                      borderRadius: 5,
                      marginBottom: 10,
                    }}
                    disabled={disabled}
                    onPress={() => {addMemberToGroup(item?.id, item?.username)}}
                    accessible={true}
                    accessibilityLabel={addedMembers.includes(item.id) ? `${item?.username} already added to group` : `Add ${item?.username} to ${groupName}`}
                    accessibilityHint='Double tap to add this user to the group.'
                  >
                    <AppText 
                      style={{ 
                        fontSize: 16, 
                        fontWeight: "bold"
                      }}
                      color={addedMembers.includes(item.id) ? theme?.misty : theme?.midnight}
                    >{item?.username}</AppText>
                  </TouchableOpacity>
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