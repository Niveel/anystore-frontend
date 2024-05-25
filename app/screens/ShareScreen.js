import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Keyboard, TouchableWithoutFeedback, TouchableOpacity, ScrollView, ActivityIndicator, Alert } from 'react-native';
import axios from 'axios';

import colors from '../config/colors';
import Screen from '../components/Screen';
import AppText from '../components/AppText';
import useAuth from '../auth/useAuth';
import SearchInput from '../components/SearchInput';

const ShareScreen = ({navigation, route}) => {
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  const product = route.params;
  const { user } = useAuth();
  const userId = user?._id;

  useEffect(() => {
    fetchGroups();
  }, []);

  const fetchGroups = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`https://pacific-sierra-04938-5becb39a6e4f.herokuapp.com/api/user/groups/?userId=${userId}`)
  
      if(response.data) {
        setGroups(response.data);
        setLoading(false);
      }

    } catch (error) {
      console.error('Error fetching groups:', error);
    }
  }

  const handleSendProductToGroup = (groupId) => {
    axios.post(`https://pacific-sierra-04938-5becb39a6e4f.herokuapp.com/api/share-to-group`, {
      groupId: groupId,
      content: JSON.stringify(product),
      senderId: userId,
    })
    .then((response) => {
      if(response.data) {
        Alert.alert(
          "Success",
          "Product shared successfully",
          [
            { text: "OK", onPress: () => navigation.goBack() }
          ]
        )
      }
    })
    .catch((error) => {
      console.error('Error sending product to group:', error);
    });
  }

  const handleOnSearch = (text) => {
    setSearchQuery(text);
    if(!text.trim()) {
      setSearchQuery("");
      fetchGroups();
      return;
    }

    const filteredGroupsCreated = groups?.createdGroups?.filter(group => group?.groupName.toLowerCase().includes(text.toLowerCase()));
    const filteredGroupsJoined = groups?.joinedGroups?.filter(group => group?.groupName.toLowerCase().includes(text.toLowerCase()));

    if(filteredGroupsCreated.length || filteredGroupsJoined.length) {
      setGroups({
        createdGroups: filteredGroupsCreated,
        joinedGroups: filteredGroupsJoined,
      });
    } else {
      setGroups({
        createdGroups: [],
        joinedGroups: [],
      });
    }
  }

  const createdGroups = groups?.createdGroups;
  const joinedGroups = groups?.joinedGroups;

  return (
    <Screen style={styles.screen}>
      <ActivityIndicator animating={loading} size="large" color={colors.amberGlow} />
      <TouchableWithoutFeedback
        onPress={() => {
          Keyboard.dismiss();
        }}
      > 
        <>
        {/* search */}
        <View style={styles.search}>
          <SearchInput 
            placeholder="Search Group" 
            placeholderTextColor={colors.amberGlow} 
            autoCapitalize="none"
            autoCorrect={false}
            value={searchQuery}
            onChangeText={handleOnSearch}
          />
        </View>
        {/* end of search */}
        <View style={styles.container}>
          {/* groups */}
          <ScrollView>
            <View>
              {createdGroups && createdGroups?.length > 0 && (
                <View>
                  <AppText style={{ color: colors.white, marginVertical: 10 }}>Created Groups</AppText>
                  {createdGroups?.map((group) => (
                    <TouchableOpacity 
                      key={group?._id} 
                      style={styles.item} 
                      onPress={() => handleSendProductToGroup(group?._id)}
                    >
                      <AppText style={{ color: colors.white, fontWeight: "bold" }}>{group?.groupName}</AppText>
                    </TouchableOpacity>
                  ))}
                </View>
              )}
              {
                // if there are no groups
                createdGroups?.length === 0 && joinedGroups?.length === 0 && (
                  <View style={{
                    flex: 1,
                    justifyContent: "center",
                    alignItems: "center",
                  }}>
                    <AppText style={{ color: colors.white }}>You have not created or joined any group yet. Please create a group in <AppText style={{color: colors.amberGlow}}>crit</AppText> and add a member/members before you can share.</AppText>
                  </View>
                )
              }
              {joinedGroups && joinedGroups?.length > 0 && (
                <View>
                  <AppText style={{ color: colors.white, marginVertical: 10 }}>Joined Groups</AppText>
                  {joinedGroups?.map((group) => (
                    <TouchableOpacity 
                      key={group?._id} 
                      style={styles?.item}
                      onPress={() => handleSendProductToGroup(group?._id)}
                    >
                      <AppText style={{ color: colors.white, fontWeight: "bold" }}>{group?.groupName}</AppText>
                    </TouchableOpacity>
                  ))}
                </View>
              )}
            </View>
          </ScrollView>
        </View>
        </>
      </TouchableWithoutFeedback>
    </Screen>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.midnight,
    padding: 10,
  },
  item: {
    width: "65%",
    height: 50,
    backgroundColor: colors.amberGlow,
    marginVertical: 10,
    borderRadius: 5,
    alignItems: "center",
    justifyContent: "center",
  },
  itemInner: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  screen: {
    backgroundColor: colors.midnight,
    padding: 10,
    paddingTop: 0,
  },
  header: {
    backgroundColor: colors.midnight,
    padding: 10,
  },
  text: {
    color: colors.midnight,
    fontSize: 25,
    textTransform: "capitalize",
    fontWeight: "700",
    letterSpacing: 1,
  },
});

export default ShareScreen;
