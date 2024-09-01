import React from 'react';
import { View, StyleSheet, FlatList, TouchableOpacity } from 'react-native';

import CustomModal from '../CustomModal';
import AppText from '../AppText';
import { useTheme } from '../../utils/ThemeContext';
import SearchInput from '../SearchInput';


const AddMembersModal = ({visible, groupName, searchQuery, onChangeQueryText, searchResults, addedMembers, disabled, addMemberToGroup, ...otherProps}) => {

    const {theme} = useTheme();

  return (
    <CustomModal visible={visible} {...otherProps} >
          <View style={[styles.memberBox, {backgroundColor: theme?.midnight,}]}>
            <AppText style={{fontSize: 18, fontWeight: 'bold', marginBottom: 10, textAlign: "center"}} color={theme?.white}>Add members to {groupName}</AppText>
            <View style={{
              marginVertical: 10,
            }}>
              <SearchInput
                placeholder="Search username"
                placeholderTextColor={theme?.amberGlow}
                value={searchQuery}
                onChangeText={onChangeQueryText}
              />
            </View>

            <FlatList
              data={searchResults}
              keyExtractor={result => result?.id?.toString()}
              renderItem={({ item }) => (
                <TouchableOpacity 
                  style={{
                    backgroundColor: addedMembers.includes(item.id) ? theme?.blackLight : theme?.amberGlow,
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
                    color={theme?.white}
                  >{item?.username}</AppText>
                </TouchableOpacity>
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
});

export default AddMembersModal;