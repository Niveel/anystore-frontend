import React, { useEffect, useState, useMemo } from 'react';
import { View, StyleSheet, Text, TouchableOpacity, FlatList, } from 'react-native';
import axios from 'axios';
import { Audio } from 'expo-av';

import Screen from '../components/Screen';
import AppButton from '../components/AppButton';
import SearchInput from '../components/SearchInput';
import AppText from '../components/AppText'; 
import chatGroupApi from '../api/chatGroup';
import useAuth from '../auth/useAuth';
import { useTheme } from '../utils/ThemeContext';
import CustomHeader from '../components/CustomHeader';
import PopupModal from '../components/modals/PopupModal';
import Icon from '../components/Icon';
import GroupCard from '../components/GroupCard';
import routes from '../navigation/routes';

const open_sound = '../assets/sounds/open_sound.mp3';

function FriendlyScreen({navigation}) {
  const [modalVisible, setModalVisible] = useState(false);
  const [groups, setGroups] = useState([]);
  const [groupName, setGroupName] = useState('');
  const [tabOption, setTabOption] = useState("Created")
  const [sound, setSound] = useState();

  const { user } = useAuth();
  const userId = user?._id;
  const { theme } = useTheme();

  // sound
  const PlayOpenSound = async () => {
    const { sound } = await Audio.Sound.createAsync(
        require(open_sound)
    );
    setSound(sound);
    await sound.playAsync();
  }

  // Unload sound when component unmounts
  useEffect(() => {
      return sound
        ? () => {
            sound.unloadAsync();
          }
        : undefined;
    }, [sound]);

  // Fetch groups 
  useEffect(() => {
    fetchGroups();
  }, [groups]);

  const fetchGroups = async () => {
    try {
      const response = await axios.get(`https://www.ishopwit.com/api/user/groups/?userId=${userId}`)
  
      if(response.data) {
        setGroups(response.data);
      }

    } catch (error) {
      console.log('Error fetching groups:', error);
      if (error.response) {
        console.log('Error response:', error.response.data);
      } else if (error.request) {
        console.log('Error request:', error.request);
      } else {
        console.log('Error message:', error.message);
      }
    }
  }

  const formatDate = (date) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(date).toLocaleDateString(undefined, options);
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

  const sortedGroupsCreated = useMemo(() => {
    return groups?.createdGroups?.sort((a, b) => new Date(b?.createdAt) - new Date(a?.createdAt));
  }, [groups?.createdGroups]);

  const sortedGroupsJoined = useMemo(() => {
    return groups?.joinedGroups?.sort((a, b) => new Date(b?.createdAt) - new Date(a?.createdAt));
  }, [groups?.joinedGroups]);

  return (
    <Screen style={[styles.screen, {backgroundColor: theme?.midnight,}]}>
      <CustomHeader title='crit' showIcons />
      {/* header for crit */}
      <View style={{backgroundColor: "transparent"}}>
        <View style={{paddingHorizontal: 10}}>
          <View style={[styles.heading, {backgroundColor: theme?.horizon,}]}>
            <TouchableOpacity
              onPress={() => navigation.navigate(routes.HOME)}
            >
              <Icon name="arrow-left-circle-outline" size={35} color={theme?.white} />
            </TouchableOpacity>
            <Text style={[styles.headingText, {color: theme?.white,}]}>Manage Groups</Text>
            <TouchableOpacity style={[styles.button, {backgroundColor: theme?.white,}]} onPress={() => {
              setModalVisible(true);
              PlayOpenSound();
              }}>
              <Icon name="plus" size={30} color={theme?.horizon} />
            </TouchableOpacity>
          </View>
        </View>
            {/* tab */}
            <View style={styles.tab}>
              <TouchableOpacity 
                onPress={()=>setTabOption("Created")}
                style={{
                  backgroundColor: tabOption === "Created" ? theme?.misty : theme?.mistyLight,
                  padding: 10,
                  borderRadius: 45,
                  paddingHorizontal: 20,
                }}
                accessible={true}
                accessibilityLabel="Groups created tab"
              >
                <AppText 
                  color={tabOption === "Created" ? theme?.white : theme?.text}
                  style={{fontSize: 12}}
                >Groups Created</AppText>
              </TouchableOpacity>
              <TouchableOpacity 
                onPress={()=>setTabOption("Joined")}
                style={{
                  backgroundColor: tabOption === "Joined" ? theme?.misty : theme?.mistyLight,
                  padding: 10,
                  borderRadius: 45,
                  paddingHorizontal: 20,
                }}
                accessible={true}
                accessibilityLabel="Groups joined tab"
              >
                <AppText 
                  color={tabOption === "Joined" ? theme?.white : theme?.text}
                  style={{fontSize: 12}}
                >Groups Joined</AppText>
              </TouchableOpacity>
            </View>
            {/* end of tab */}
      </View>
      {/* end of header for crit */}
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
                <AppText>You have not created any group yet.</AppText>
              </View>
            )
          }
          <FlatList 
            data={sortedGroupsCreated}
            keyExtractor={(item) => item?._id}
            showsVerticalScrollIndicator={false}
            renderItem={({item}) => (
              <GroupCard 
                groupName={item.groupName}
                groupId={item._id}
                date={formatDate(item.createdAt)}
                onPress={()=>{
                  openChat(item.groupName, item._id, true)
                  PlayOpenSound();
                }}
              />
            )}
          />
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
                  <AppText style={{ color: theme?.white }}>You have not joined any group yet.</AppText>
                </View>
              )
            }
            <FlatList 
              data={sortedGroupsJoined}
              keyExtractor={(item) => item?._id}
              showsVerticalScrollIndicator={false}
              renderItem={({item}) => (
                <GroupCard 
                  groupName={item.groupName}
                  groupId={item._id}
                  date={formatDate(item.createdAt)}
                  onPress={()=>{
                    openChat(item.groupName, item._id, false)
                    PlayOpenSound();
                  }}
                />
              )}
            />
          </View>
        )}

      </View>

      {/* create group modal */}
      <PopupModal 
        visible={modalVisible} 
        closeModal={() => setModalVisible(false)}
      >
        <View style={{paddingVertical: 20}}>
          <SearchInput
            placeholder="Enter group name"
            placeholderTextColor={theme?.mistyLight}
            value={groupName}
            maxLength={25}
            onChangeText={(text) => setGroupName(text)}
            style={[styles.input, {color: theme?.amberGlow,}]}
            inputStyle={{paddingHorizontal: 15}}
            onSubmitEditing={handleCreateGroup}
          />
          <AppButton
            title="Create"
            color={theme?.horizon}
            style={{
                marginTop: 50,
                alignSelf: "center",
                borderRadius: 50,
            }}
            width='50%'
            onPress={handleCreateGroup}
            textColor={theme?.white}
        />
        </View>
      </PopupModal>
    </Screen>
  );
}

const styles = StyleSheet.create({
  button: {
    padding: 5,
    borderRadius: 50,
  },
  body: {
    width: '100%',
    height: '90%',
    padding: 10,
  },
  createdGroups: {
    paddingBottom: 115,
  },
  head: {
    marginBottom: 20,
  },
  joinedGroups: {
    paddingBottom: 115,
  },
  heading: {
    marginVertical: 10,
    padding: 10,
    borderRadius: 5,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headingText: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  input: {
    // borderRadius: 5,
    height: 60,
    // paddingHorizontal: 25,
  },
  screen: {
    paddingTop: 0,
  },
  tab: {
    flexDirection: 'row',
    marginBottom: 10,
    paddingVertical: 5,
    paddingHorizontal: 10,
    gap: 10,
  },
});

export default FriendlyScreen;
