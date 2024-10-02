import React, { useState, useEffect, useMemo } from 'react';
import { View, StyleSheet, Keyboard, TouchableWithoutFeedback, TouchableOpacity, FlatList, ActivityIndicator, Alert, BackHandler, Dimensions, Text } from 'react-native';
import axios from 'axios';

import Screen from '../components/Screen';
import AppText from '../components/AppText';
import useAuth from '../auth/useAuth';
import SearchInput from '../components/SearchInput';
import { useTheme } from '../utils/ThemeContext';
import AppButton from '../components/AppButton';
import ShareGroupCard from '../components/ShareGroupCard';
import PopupModal from '../components/modals/PopupModal';
import Icon from '../components/Icon';
import CritTabLoader from '../components/loaders/CritTabLoader';

const {width} = Dimensions.get('window');

const ShareScreen = ({navigation, route}) => {
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [tabOption, setTabOption] = useState("created");
  const [shareList, setShareList] = useState([]);
  const [sharedSuccessful, setSharedSuccessful] = useState(null);
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [shareLoading, setShareLoading] = useState(false);

  const product = route.params;
  const { user } = useAuth();
  const userId = user?._id;
  const { theme } = useTheme();

  useEffect(() => {
    fetchGroups();
  }, []);

  const fetchGroups = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`https://www.ishopwit.com/api/user/groups/?userId=${userId}`)
  
      if(response.data) {
        setGroups(response.data);
        setLoading(false);
      }

    } catch (error) {
      console.error('Error fetching groups:', error);
    }
  }

  const handleSendProductToGroup = () => {  
    setShareLoading(true);
  
    // array of API requests for each group
    const shareRequests = shareList.map(groupId => {
      return axios.post(`https://www.ishopwit.com/api/share-to-group`, {
        groupId: groupId,
        content: JSON.stringify(product), 
        senderId: userId,
      });
    });
  
    // Promise.all to send all requests concurrently
    Promise.all(shareRequests)
      .then((responses) => {
        setSharedSuccessful(true);
      })
      .catch((error) => {
        console.error('Error sending product to groups:', error);
        setSharedSuccessful(false);
      })
      .finally(() => {
        setShowFeedbackModal(true);
        setShareLoading(false);
      });
  };
  

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

  const addThisToShareList = (groupId) => {
    if(shareList.includes(groupId)) {
      setShareList(prev => prev.filter(id => id !== groupId));
      return;
    }
    setShareList(prev => [...prev, groupId]);
  }

  const handleCloseFeedbackModal = () => {
    setShowFeedbackModal(false);
    navigation.goBack();
  }

  // handleBackButton pressed
  useEffect(() => {
    const backAction = () => {
      if(shareList.length > 0) {
        Alert.alert("Discard changes?", "Are you sure you want to go back? Any unsaved changes will be lost.", [
          {
            text: "No",
            onPress: () => null,
            style: "cancel"
          },
          { text: "Yes", onPress: () => navigation.goBack() }
        ]);
        return true;
      }
      return false;
    };
    const backHandler = BackHandler.addEventListener("hardwareBackPress", backAction);
    return () => backHandler.remove();
  }, [shareList]);

  const createdGroups = useMemo(() => {
    return groups?.createdGroups?.sort((a, b) => a.groupName.localeCompare(b.groupName));
  }, [groups?.createdGroups]);
  const joinedGroups = useMemo(() => {
    return groups?.joinedGroups?.sort((a, b) => a.groupName.localeCompare(b.groupName));
  }, [groups?.joinedGroups]);

  return (
    <Screen style={[styles.screen, {backgroundColor: theme?.midnight,}]}>
      <CritTabLoader visible={shareLoading} />
      {/* modal for shared completed feedback */}
      <PopupModal
        visible={showFeedbackModal}
        closeModal={handleCloseFeedbackModal}
      >
        <View style={styles.sharedFeedbackBox}>
          <View style={styles.feedbackWrapper}>
            <Icon 
              iconName={sharedSuccessful ? `check-circle-outline` : `close-circle-outline`}
              size={width /2}
              color={sharedSuccessful ? theme?.horizon : theme?.punch}
            />
            <Text style={styles.feedbackBigText}>{sharedSuccessful ? `Products shared successfully`: `There was an issue sharing the product. Please try again.`}</Text>
            <AppText style={styles.feedbackSmallText}>The product to shared has been sent to the group(s) you selected successfully.</AppText>
            <AppButton
              title="OK"
              color={theme?.horizon}
              textColor={theme?.white}
              onPress={handleCloseFeedbackModal}
              width='40%'
            />
          </View>
        </View>
      </PopupModal>

      {/* end of modal for shared completed feedback */}
      {loading && 
        <ActivityIndicator 
          animating={loading} 
          size="large" 
          color={theme?.horizon} 
        />}
      <TouchableWithoutFeedback
        onPress={() => {
          Keyboard.dismiss();
        }}
      > 
        <View style={styles.wrapper}>
        {/* search */}
        <View style={styles.search}>
          <SearchInput 
            placeholder="Search Group" 
            placeholderTextColor={theme?.amberGlow} 
            autoCapitalize="none"
            autoCorrect={false}
            value={searchQuery}
            onChangeText={handleOnSearch}
          />
        </View>
        {/* end of search */}
        <View style={[styles.container, {backgroundColor: theme?.midnight,}]}>
          <View style={styles.counter}>
            <AppText style={{color: theme?.amberGlow, fontSize: 12}}>{shareList.length} groups selected</AppText>
          </View>
          {/* tab */}
          <View style={styles.tabBar}>
            <AppButton
              width='40%'
              height={40}
              textColor={tabOption === "created" ? theme?.midnight : theme?.misty}
              color={tabOption === "created" ? theme?.misty : theme?.mistyLight}
              title="Created groups"
              textStyle={{fontSize: 12}} 
              style={{borderRadius: 30}}
              onPress={() => setTabOption("created")}
            />
            <AppButton 
              width='40%'
              height={40}
              textColor={tabOption === "joined" ? theme?.midnight : theme?.misty}
              color={tabOption === "joined" ? theme?.misty : theme?.mistyLight}
              title="Joined groups"
              textStyle={{fontSize: 12}}
              style={{borderRadius: 30}}
              onPress={() => setTabOption("joined")}
            />
          </View>
          {/* end of tab */}
          {/* body */}
          <View style={styles.body}>
            {
              tabOption === "created" ? (
                <FlatList
                  data={createdGroups}
                  keyExtractor={(group) => group?._id}
                  showsVerticalScrollIndicator={false}
                  renderItem={({item}) => (
                    <ShareGroupCard 
                      groupName={item?.groupName}
                      members={item?.users?.length}
                      groupImage={item?.groupImage}
                      addThisToShareList={() => addThisToShareList(item?._id)}
                      addedToShareList={shareList.includes(item?._id)}
                    />
                  )}
                />
              ) : (
                <FlatList
                  data={joinedGroups}
                  keyExtractor={(group) => group?._id}
                  showsVerticalScrollIndicator={false}
                  renderItem={({item}) => (
                    <ShareGroupCard 
                      groupName={item?.groupName}
                      members={item?.users?.length}
                      groupImage={item?.groupImage}
                      addThisToShareList={() => addThisToShareList(item?._id)}
                      addedToShareList={shareList.includes(item?._id)}
                    />
                  )}
                />
              )
            }
            <View style={styles.btnWrapper}>
              <AppButton
                style={{
                  borderWidth: 2,
                  borderColor: theme?.horizon,
                }}
                color={theme?.white}
                textColor={theme?.horizon}
                width='40%'
                title='Cancel'
                onPress={()=> navigation.goBack()}
              />
              {shareList.length > 0 && <AppButton
                color={theme?.horizon}
                textColor={theme?.white}
                width='40%'
                title='Share'
                onPress={handleSendProductToGroup}
              />}
            </View>
          </View>
          {/* end of body */}
        </View>
        </View>
      </TouchableWithoutFeedback>
    </Screen>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 10,
    flex: 1,
  },
  screen: {
    paddingTop: 0,
  },
  wrapper: {
    flex: 1,
  },
  search: {
    padding: 10,
  },
  tabBar: {
    flexDirection: "row",
    marginBottom: 10,
    gap: 10,
  },
  body: {
    flex: 1,
    justifyContent: "space-between",
  },
  btnWrapper: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 10,
    paddingBottom: 20,
  },
  counter: {
    padding: 5,
    justifyContent: "center",
    alignItems: "flex-end",
  },
  sharedFeedbackBox: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  feedbackWrapper: {
    height: "70%",
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    gap: 20,
  }, 
  feedbackBigText: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    textTransform: "uppercase",
    letterSpacing: 1.2,
  },
  feedbackSmallText: {
    fontSize: 16,
    textAlign: "center",
  },
});

export default ShareScreen;
