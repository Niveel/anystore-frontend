import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Text, TouchableOpacity, ScrollView } from 'react-native';
import axios from 'axios';
import { Audio } from 'expo-av';

import Screen from '../components/Screen';
import AppButton from '../components/AppButton';
import SearchInput from '../components/SearchInput';
import AppText from '../components/AppText'; 
import CustomModal from '../components/CustomModal';
import chatGroupApi from '../api/chatGroup';
import useAuth from '../auth/useAuth';
import { useBarcodePolicy } from '../config/BarcodeContext';
import { useTheme } from '../utils/ThemeContext';

const open_sound = '../assets/sounds/open_sound.mp3';

function FriendlyScreen({navigation}) {
  const [modalVisible, setModalVisible] = useState(false);
  const [groups, setGroups] = useState([]);
  const [groupName, setGroupName] = useState('');
  const [tabOption, setTabOption] = useState("Created")
  const [sound, setSound] = useState();

  const { user } = useAuth();
  const { barcodeCameraAllow } = useBarcodePolicy();
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
  }, []);

  // permission modal
  useEffect(() => {
    openModal();
  }, [barcodeCameraAllow]);


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
    if(!barcodeCameraAllow){
      setModalVisible(false);
      navigation.navigate('BarcodePolicyScreen');
    } 
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
    <Screen style={[styles.screen, {backgroundColor: theme?.midnight,}]}>
      <View style={[styles.heading, {backgroundColor: theme?.horizon,}]}>
        <Text style={[styles.headingText, {color: theme?.amberGlow,}]}>GROUPS</Text>
        <TouchableOpacity style={[styles.button, {backgroundColor: theme?.amberGlow,}]} onPress={() => {
          openModal()
          setModalVisible(true);
          PlayOpenSound();
          }}>
          <AppText style={styles.buttonText} color={theme?.midnight}>Create group</AppText>
        </TouchableOpacity>
      </View>
          {/* tab */}
          <View style={styles.tab}>
            <TouchableOpacity 
              onPress={()=>setTabOption("Created")}
              style={{
                backgroundColor: tabOption === "Created" ? theme?.amberGlow : theme?.mistyLight,
                padding: 10,
                borderRadius: 5,
              }}
              accessible={true}
              accessibilityLabel="Groups created tab"
            >
              <AppText color={tabOption === "Created" ? theme?.midnight : theme?.amberGlowLight}>Groups Created</AppText>
            </TouchableOpacity>
            <TouchableOpacity 
              onPress={()=>setTabOption("Joined")}
              style={{
                backgroundColor: tabOption === "Joined" ? theme?.amberGlow : theme?.mistyLight,
                padding: 10,
                borderRadius: 5,
              }}
              accessible={true}
              accessibilityLabel="Groups joined tab"
            >
              <AppText style={{color: tabOption === "Joined" ? theme?.midnight : theme?.amberGlowLight}}>Groups Joined</AppText>
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
                  <AppText style={{ color: theme?.white }}>You have not created any group yet.</AppText>
                </View>
              )
            }
            {
              groups?.createdGroups?.map((group) => (
                <TouchableOpacity key={group._id} style={[styles.groupCard, {backgroundColor: theme?.mistyLight,}]} onPress={()=>{
                  openChat(group.groupName, group._id, true)
                  PlayOpenSound();
                }}>
                  <AppText style={styles.name} numberOfLines={1}>{group.groupName}</AppText>
                  <AppText style={[styles.date, {color: theme?.amberGlow,}]}>{formatDate(group.createdAt)}</AppText>
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
                    <AppText style={{ color: theme?.white }}>You have not joined any group yet.</AppText>
                  </View>
                )
              }
              {
                groups?.joinedGroups?.map((group) => (
                  <TouchableOpacity key={group?._id} style={[styles.groupCard, {backgroundColor: theme?.mistyLight,}]} onPress={()=>{
                    openChat(group?.groupName, group?._id, false)
                    PlayOpenSound();
                  }}>
                    <AppText style={styles.name} numberOfLines={1}>{group.groupName}</AppText>
                    <AppText style={[styles.date, {color: theme?.amberGlow,}]}>{formatDate(group.createdAt)}</AppText>
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
        onRequestClose={() => setModalVisible(false)}
      >
        <SearchInput
          placeholder="Enter group name"
          placeholderTextColor={theme?.amberGlow}
          value={groupName}
          maxLength={25}
          onChangeText={(text) => setGroupName(text)}
          style={[styles.input, {color: theme?.amberGlow,}]}
        />
        <AppButton
            title="Create"
            color={theme?.amberGlowLight}
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
    padding: 10,
    borderRadius: 5,
  },
  buttonText: {
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
    fontSize: 12,
  },
  groupCard: {
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
    padding: 10,
    borderRadius: 5,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headingText: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  input: {
    borderRadius: 5,
    height: 50,
    paddingHorizontal: 15,
  },
  screen: {
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
