import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Text, TouchableOpacity, ScrollView } from 'react-native';
import axios from 'axios';

import colors from '../config/colors';
import Screen from '../components/Screen';
import AppButton from '../components/AppButton';
import SearchInput from '../components/SearchInput';
import AppText from '../components/AppText';
import CustomModal from '../components/CustomModal';
import chatGroupApi from '../api/chatGroup';
import useAuth from '../auth/useAuth';

function FriendlyScreen({navigation}) {
  const [modalVisible, setModalVisible] = useState(false);
  const [groups, setGroups] = useState([]);
  const [groupName, setGroupName] = useState('');
  const [tabOption, setTabOption] = useState("Created")

  const { user } = useAuth();
  const userId = user?._id;

  useEffect(() => {
    fetchGroups();
  }, []);

  const fetchGroups = async () => {
    try {
      const response = await axios.get(`https://pacific-sierra-04938-5becb39a6e4f.herokuapp.com/api/user/groups/?userId=${userId}`)
  
      if(response.data) {
        setGroups(response.data);
      }

    } catch (error) {
      console.error('Error fetching groups:', error);
      if (error.response) {
        console.error('Error response:', error.response.data);
      } else if (error.request) {
        console.error('Error request:', error.request);
      } else {
        console.error('Error message:', error.message);
      }
    }
  }

  const formatDate = (date) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(date).toLocaleDateString(undefined, options);
  }
  const openModal = () => {
    setModalVisible(true);
  }
  const handleCreateGroup = () => {
    setModalVisible(false);
    setGroupName('');

    chatGroupApi.createGroup(groupName, userId)
      .then((response) => {
        if(response.ok) {
          const newGroup = response.data;

          // Update createdGroups array
          setGroups(prevGroups => ({
            ...prevGroups,
            createdGroups: [...prevGroups.createdGroups, newGroup]
          }));
          // If the user is also joined to the group, update joinedGroups array
          if (newGroup.members && newGroup.members.includes(userId)) {
            setGroups(prevGroups => ({
              ...prevGroups,
              joinedGroups: [...prevGroups.joinedGroups, newGroup]
            }));
          }
        }
      })
      .catch((error) => {
        console.error('Error creating group:', error);
      });
  }
  const openChat = (name, id, isCreatedGroup) => {
    navigation.navigate('Chatroom', {groupName: name.trim(), groupId: id, setGroups: setGroups, isCreatedGroup: isCreatedGroup});
  }

  const sortedGroupsCreated = groups?.createdGroups?.sort((a, b) => new Date(b?.createdAt) - new Date(a?.createdAt));
  const sortedGroupsJoined = groups?.joinedGroups?.sort((a, b) => new Date(b?.createdAt) - new Date(a?.createdAt));

  return (
    <Screen style={styles.screen}>
      <View style={styles.heading}>
        <Text style={styles.headingText}>GROUPS</Text>
        <TouchableOpacity style={styles.button} onPress={openModal}>
          <AppText style={styles.buttonText}>Create group</AppText>
        </TouchableOpacity>
      </View>
          {/* tab */}
          <View style={styles.tab}>
            <TouchableOpacity 
              onPress={()=>setTabOption("Created")}
              style={{
                backgroundColor: tabOption === "Created" ? colors.amberGlow : colors.mistyLight,
                padding: 10,
                borderRadius: 5,
              }}
              accessible={true}
              accessibilityLabel="Groups created tab"
            >
              <AppText style={{color: tabOption === "Created" ? colors.midnight : colors.amberGlowLight}}>Groups Created</AppText>
            </TouchableOpacity>
            <TouchableOpacity 
              onPress={()=>setTabOption("Joined")}
              style={{
                backgroundColor: tabOption === "Joined" ? colors.amberGlow : colors.mistyLight,
                padding: 10,
                borderRadius: 5,
              }}
              accessible={true}
              accessibilityLabel="Groups joined tab"
            >
              <AppText style={{color: tabOption === "Joined" ? colors.midnight : colors.amberGlowLight}}>Groups Joined</AppText>
            </TouchableOpacity>
          </View>
          {/* end of tab */}
      <ScrollView contentContainerStyle={styles.scrollView}>
        <View style={styles.body}>
          {tabOption === "Created" && (
            <View style={styles.createdGroups}>
              {
              // if there are no created groups
              groups?.createdGroups?.length === 0 && (
                <View style={{
                  flex: 1,
                  justifyContent: "center",
                  alignItems: "center",
                }}>
                  <AppText style={{ color: colors.white }}>You have not created any group yet.</AppText>
                </View>
              )
            }
            {
              groups?.createdGroups?.map((group) => (
                <TouchableOpacity key={group._id} style={styles.groupCard} onPress={()=>openChat(group.groupName, group._id, true)}>
                  <AppText style={styles.name} numberOfLines={1}>{group.groupName}</AppText>
                  <AppText style={styles.date}>{formatDate(group.createdAt)}</AppText>
                </TouchableOpacity>
              ))
            }
          </View>
        )}

          {tabOption === "Joined" && (
            <View style={styles.joinedGroups}>
              {
                // if there are no joined groups
                groups?.joinedGroups?.length === 0 && (
                  <View style={{
                    flex: 1,
                    justifyContent: "center",
                    alignItems: "center",
                  }}>
                    <AppText style={{ color: colors.white }}>You have not joined any group yet.</AppText>
                  </View>
                )
              }
              {
                groups?.joinedGroups?.map((group) => (
                  <TouchableOpacity key={group?._id} style={styles.groupCard} onPress={()=>openChat(group?.groupName, group?._id, false)}>
                    <AppText style={styles.name} numberOfLines={1}>{group.groupName}</AppText>
                    <AppText style={styles.date}>{formatDate(group.createdAt)}</AppText>
                  </TouchableOpacity>
                ))
              }
            </View>
          )}

        </View>
      </ScrollView>
      <CustomModal
        visible={modalVisible}
        onPress={() => setModalVisible(false)}
      >
        <SearchInput
          placeholder="Enter group name"
          placeholderTextColor={colors.amberGlow}
          value={groupName}
          maxLength={25}
          onChangeText={(text) => setGroupName(text)}
          style={styles.input}
        />
        <AppButton
            title="Create"
            color={colors.amberGlowLight}
            style={{
                marginTop: 20,
                alignSelf: "center"
            }}
            width='50%'
            onPress={handleCreateGroup}
        />
      </CustomModal>
    </Screen>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: colors.amberGlow,
    padding: 10,
    borderRadius: 5,
  },
  buttonText: {
    color: colors.midnight,
    fontSize: 15,
    fontWeight: 'bold',
  },
  body: {
    width: '100%',
    height: '90%',
  },
  createdGroups: {
    minHeight: "50%",
    paddingBottom: 155,
  },
  head: {
    marginBottom: 20,
  },
  joinedGroups: {
    paddingBottom: 190,
  },
  date: {
    color: colors.amberGlow,
    fontSize: 12,
  },
  groupCard: {
    backgroundColor: colors.mistyLight,
    padding: 10,
    height: 100,
    justifyContent: "space-between",
    marginVertical: 5,
    borderRadius: 5,
  },
  name: {
    textTransform: 'capitalize',
    fontSize: 20,
  },
  heading: {
    marginVertical: 10,
    backgroundColor: colors.horizon,
    padding: 10,
    borderRadius: 5,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headingText: {
    color: colors.amberGlow,
    fontSize: 24,
    fontWeight: 'bold',
  },
  input: {
    borderRadius: 5,
    height: 50,
    paddingHorizontal: 15,
    color: colors.amberGlow,
  },
  screen: {
    backgroundColor: colors.midnight,
    padding: 10,
  },
  scrollView: {
    minHeight: '100%',
  },
  tab: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
  },
});

export default FriendlyScreen;
