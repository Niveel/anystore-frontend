import React, {useState, useRef, useEffect} from 'react';
import { View, StyleSheet, TouchableOpacity, ScrollView, TouchableWithoutFeedback, KeyboardAvoidingView, TouchableHighlight, FlatList, Alert, TextInput, Keyboard, Image, BackHandler, ToastAndroid, Text } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import axios from 'axios';
import {io} from 'socket.io-client';
import { Audio } from 'expo-av';

import Screen from '../components/Screen';
import AppText from '../components/AppText';
import CustomModal from '../components/CustomModal';
import SearchInput from '../components/SearchInput';
import useAuth from '../auth/useAuth';
import storage from '../auth/storage';
import routes from '../navigation/routes';
import MsgLongPressOptions from '../components/MsgLongPressOptions';
import { useTheme } from '../utils/ThemeContext';
import reportMsg from '../api/reportMsg';
import deleteMsgs from '../api/deleteMsgs';
import flagMessage from '../api/flagMessage'
import DoubleTapTouchableOpacity from '../components/DoubleTapTouchableOpacity';

const receive_sound = '../assets/sounds/receive_sound.wav';
const send_sound = '../assets/sounds/send_sound.mp3';

function ChatroomScreen({route, navigation}) {
  const [menuVisible, setMenuVisible] = useState(false);
  const [menuPosition, setMenuPosition] = useState({ x: 0, y: 0 });
  const [viewMembersModalVisible, setViewMembersModalVisible] = useState(false);
  const [addMembersVisible, setAddMembersVisible] = useState(false);
  const [reportMsgModalVisible, setReportMsgModalVisible] = useState(false);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [groupMembers, setGroupMembers] = useState([]); 
  const [addedMembers, setAddedMembers] = useState([])
  const [selectedMessages, setSelectedMessages] = useState([]);
  const [longPressMsgState, setLongPressMsgState] = useState(false);
  const [receiveSound, setReceiveSound] = useState();
  const [sendSound, setSendSound] = useState();
  const [flaggedMessages, setFlaggedMessages] = useState([]);
  const [toneFlaggedReason, setToneFlaggedReason] = useState('');
  const [showToneFlaggedReasonModal, setShowToneFlaggedReasonModal] = useState(false);
  
  const scrollViewRef = useRef(null)
  const { user } = useAuth();
  const socket = io('https://www.ishopwit.com', {
    transports: ['websocket'],
    reconnection: true,
    reconnectionAttempts: Infinity,
    reconnectionDelay: 1000, // Start with 1 second delay
    reconnectionDelayMax: 5000, // Maximum 5 seconds delay
    timeout: 20000, // 20 seconds connection timeout
    autoConnect: true,
    pingInterval: 25000, // 25 seconds ping interval
    pingTimeout: 60000 // 60 seconds ping timeout
  });

  const { groupName, groupId, setGroups, isCreatedGroup } = route.params;
  const { theme } = useTheme();

  // sounds
  const PlayReceiveSound = async () => {
    const { sound } = await Audio.Sound.createAsync(
        require(receive_sound)
    );
    setReceiveSound(sound);
    await sound.playAsync();
  }

  const PlaySendSound = async () => {
    const { sound } = await Audio.Sound.createAsync(
        require(send_sound)
    );
    setSendSound(sound);
    await sound.playAsync();
  }

  // useEffect to unload sounds when component unmounts
  useEffect(() => {
    return receiveSound && sendSound
      ? () => {
          receiveSound.unloadAsync(); 
          sendSound.unloadAsync();
        }
      : undefined;
  }, [receiveSound, sendSound]);

  // socket message
  socket.on("connect", () => {
    // console.log("Connected to the Socket.IO server");
    socket.emit('joinRoom', groupId);
  });
  
  socket.on('connect_error', (err) => {
    console.log('Connection Error:', err.message);
    socket.connect()
  });
  
  socket.on('disconnect', (reason) => {
    console.log('Disconnected:', reason);
    if (reason) {
      console.log('Attempting to reconnect...');
      socket.connect();
    }
  }); 

  // new message received
  useEffect(() => {
    socket.on("message", (newMessage) => {
      console.log('new message sent:', newMessage); 
      setMessages((prevMessages) => [...prevMessages, newMessage]);
      PlayReceiveSound();
    });
    return () => {
      socket.disconnect();
    };
  }, []);

    // custom functions
    const formatTime = (time) => {
      const date = new Date(time);
      return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true });
    };
    const getLastItemOfArray = (arr) => arr[arr.length - 1];
    const resetSelectedMessages = () => setSelectedMessages([]);

    // toasts
    const showReportToast = () => {
      ToastAndroid.show('Messages reported.', ToastAndroid.SHORT);
    }
    const showReportFailToast = () => {
      ToastAndroid.show('Failed to report messages.', ToastAndroid.SHORT);
    }
    const showDeleteMsgToast = () => {
      ToastAndroid.show('Messages deleted.', ToastAndroid.SHORT);
    }
    const showDeleteMsgFailToast = () => {
      ToastAndroid.show('Failed to delete messages.', ToastAndroid.SHORT);
    }
    const showMsgFlaggedToast = () => {
      ToastAndroid.show('Message flagged.', ToastAndroid.SHORT);
    }
    const showMsgUnFlaggedToast = () => {
      ToastAndroid.show('Message flag removed.', ToastAndroid.SHORT);
    }
  
    // network functions 
    const handleMorePress = (event) => {
      setMenuPosition({ x: event.nativeEvent.pageX, y: event.nativeEvent.pageY });
      setMenuVisible(!menuVisible);
    };  

    const addMemberToGroup = async (memberId) => {
      try {
        const response = await axios.post(`https://www.ishopwit.com/api/groups/add-member`, 
        { groupId: groupId, userId: memberId });

        if (response.data) {
          setAddedMembers([...addedMembers, memberId]);
        }
        
      }
      catch (error) {
        console.error('Error adding member:', error);
        if (error.response) {
          // The request was made and the server responded with a status code
          console.error('Response data:', error.response.data);
        } else if (error.request) {
          // The request was made but no response was received
          console.error('No response received:', error.request);
        } else {
          // Something happened in setting up the request that triggered an error
          console.error('Request setup error:', error.message);
        }
      }
    };

    const handleAddMember = () => {
      setMenuVisible(false);
      setAddMembersVisible(true);
    };

    const handleRemoveMember = async (Id) => {
      const token = await storage.getToken();
      try {
        const response = await axios.post(`https://www.ishopwit.com/api/groups/remove-member`, 
        { groupId: groupId, memberId: Id }, { headers: { 'x-token': token } });

        if (response.data) {
          setGroupMembers(prevMembers => prevMembers.filter(member => member.id !== Id));
          setAddedMembers(addedMembers.filter(memberId => memberId !== Id));
        }
      }   

      catch (error) {
        if(error.response) {
          console.error('Response data:', error.response.data);
        } else if (error.request) {
          console.error('No response received:', error.request);
        } else {
          console.error('Request setup error:', error.message);
        }
      }
    };

    const handleViewMembers = () => {
      setMenuVisible(false);
      setViewMembersModalVisible(true);
    };

    const exitGroup = async () => {
      try {
        const response = await axios.post(`https://www.ishopwit.com/api/groups/exit-member`, 
        { groupId: groupId, memberId: user?._id});

        if (response?.data) {
          // Remove the group from the state
          setGroups(prevGroups => ({
            ...prevGroups,
            createdGroups: prevGroups.createdGroups.filter(group => group?._id !== groupId),
            joinedGroups: prevGroups.joinedGroups.filter(group => group?._id !== groupId)
          }));
          navigation.navigate('CritScreen')
        }

      }
      catch (error) {
        console.error('Error exiting group:', error);
        if (error.response) {
          console.error('Response data:', error.response.data);
        } else if (error.request) {
          console.error('No response received:', error.request);
        } else {
          console.error('Request setup error:', error.message);
        }
      }
    }

    const handleBlockUser = () => {
      setMenuVisible(false);
      
      Alert.alert(
        'Block User',
        'Are you sure you want to block user?',
        [
          {
            text: 'No',
            onPress: () => console.log('Cancel Pressed'),
            style: 'cancel'
          },
          { text: 'YES', onPress: () => exitGroup() }
        ],
        { cancelable: true }
      );

    }

    const handleExitGroup = () => {
      setMenuVisible(false);
      
      Alert.alert(
        'Leaving Group',
        'Are you sure you want to exit this group? You will not be able to rejoin unless invited back.',
        [
          {
            text: 'No',
            onPress: () => console.log('Cancel Pressed'),
            style: 'cancel'
          },
          { text: 'YES', onPress: () => exitGroup() }
        ],
        { cancelable: true }
      );

    }

    const deleteGroup = async () => {
      try {
        const response = await axios.post(`https://www.ishopwit.com/api/delete-group`, { groupId: groupId }) 

        if (response.data) {
           // Remove the deleted group from the state
          setGroups(prevGroups => ({
            ...prevGroups,
            createdGroups: prevGroups.createdGroups.filter(group => group._id !== groupId),
            joinedGroups: prevGroups.joinedGroups.filter(group => group._id !== groupId)
          }));
          navigation.navigate('CritScreen')
        }

      } catch (error) {
        console.error('Error deleting group:', error);
      }
    }

    const handleDeleteGroup = () => {
      setMenuVisible(false);
      
      Alert.alert(
        'Delete Group',
        'Are you sure you want to delete this group?',
        [
          {
            text: 'Cancel',
            onPress: () => console.log('Cancel Pressed'),
            style: 'cancel'
          },
          { text: 'OK', onPress: () => {
              deleteGroup()
            } 
          }
        ],
        { cancelable: true }
      );

    }

    const handleSendMsg = async (roomId, message, senderId) => {
      try {
        if (message.trim().length === 0) return;
        console.log('message:', message, 'senderId:', senderId, 'roomId:', roomId)
        const flaggedResult = await flagMessage.flagMessage(message);
        socket.emit('sendMessage', { 
                                    roomId, 
                                    message, 
                                    senderId,
                                    sentiment: flaggedResult?.data?.message
                                  });
        setMessage('');
        Keyboard.dismiss();
        PlaySendSound();

        // fetch messages
        // setTimeout(() => {
        //   fetchMessages();
        // }, 200);

      } catch (error) {
        console.log('Error sending message:', error);

        if (error.response) {
          console.log('Response data:', error.response.data);
        } else if (error.request) {
          console.log('No response received:', error.request);
        } else {
          console.log('Request setup error:', error.message);
        }
      }
    }

    const handleDoubleTapMessage = (msg) => {
      setShowToneFlaggedReasonModal(true)
      setToneFlaggedReason(msg)
    };

    const handleDeleteMessage = async (msgArr) => {
      const selectedMessageIds = msgArr.map(msg => msg?._id)
      setMessages(prevMessages => prevMessages.filter(msg => !selectedMessageIds.includes(msg._id))); 

      try {
        const result = await deleteMsgs.deleteMsgs(selectedMessageIds);

        if (result?.ok) {
          console.log('Deleted messages:', result.data);
          showDeleteMsgToast();
        } else {
          showDeleteMsgFailToast();
          console.error('Failed to delete messages:', result.data);
        }
      } catch (error) {
        console.error('Error deleting messages:', error);
        showDeleteMsgFailToast();
        if(error.response) {
          console.error('Response data:', error.response.data);
        } else if (error.request) {
          console.error('No response received:', error.request);
        } else {
          console.error('Request setup error:', error.message);
        }
      }

      resetSelectedMessages();
    }

    const handleReportMessages = async (msgArr) => {
      const selectedMessages = msgArr.map(msg => msg)
      const lastSelectedMessage = getLastItemOfArray(selectedMessages);
      
      try {
        const result = await reportMsg.reportMsg(user?.email, user?.username.trim(), lastSelectedMessage?.sender?.username, lastSelectedMessage?.content)

        if (result.ok) {
          console.log('Reported message:', result.data);
          showReportToast();
        } else {
          console.log('Could not report message:', result);
          showReportFailToast();
        }
      } catch (error) {
        console.error('Error reporting message:', error);
        showReportFailToast();
        if(error.response) {
          console.error('Response data:', error.response.data);
        } else if (error.request) {
          console.error('No response received:', error.request);
        } else {
          console.error('Request setup error:', error.message);
        }
      }
      resetSelectedMessages();
      setReportMsgModalVisible(false);
    }

    const handleFlagMsg = (msgArr) => {
      // Extract the IDs of the messages to be flagged/unflagged
      const msgIdsToFlag = msgArr.map(msg => msg._id);
      const newFlaggedMessages = flaggedMessages.filter(id => !msgIdsToFlag.includes(id));
      const updatedFlaggedMessages = [
        ...newFlaggedMessages,
        ...msgIdsToFlag.filter(id => !flaggedMessages.includes(id))
      ];
    
      setFlaggedMessages(updatedFlaggedMessages);

      showMsgFlaggedToast();
    }

    const handleUnFlagMsg = (msgArr) => {
      const msgIdsToUnFlag = msgArr.map(msg => msg._id);
      const updatedFlaggedMessages = flaggedMessages.filter(id => !msgIdsToUnFlag.includes(id));

      setFlaggedMessages(updatedFlaggedMessages);

      showMsgUnFlaggedToast();
    }

    const fetchMessages = async () => {
      try {
        const response = await axios.get(`https://www.ishopwit.com/api/group/messages/?groupId=${groupId}`)
        if (response.data) {
          setMessages(response.data);
          // await storeMessagesToStorage(response?.data);
          // await getAllMessagesFromStorage();
        }

      } catch (error) {
        console.error('Error fetching messages from server:', error);
      }
    }

    const handleSelectMessageLongPress = (msg) => {
      setLongPressMsgState(true);
      setSelectedMessages([...selectedMessages, msg]);
    }

    const handleSelectMessage = (msg) => {
      if (longPressMsgState) {
        setSelectedMessages([...selectedMessages, msg]);
        // if the message is already selected, deselect it
        if(selectedMessages.includes(msg)) {
          setSelectedMessages(selectedMessages.filter(message => message !== msg));
        }
        if(selectedMessages.length === 0) setLongPressMsgState(false);
      }
    }

    const fetchGroupMembers = async () => {
      try {
        const response = await axios.get(`https://www.ishopwit.com/api/group/members/?groupId=${groupId}`);

        if (response.data) {
          const updatedMembers = response.data.map(member => {
            return {...member, id: member._id}
          });
          const members = response.data.map(member => member._id);

          if (isCreatedGroup) {
            setGroupMembers([{...user, id: user._id, username: user.username}, ...updatedMembers]);
            setAddedMembers(members);
          } else {
            setGroupMembers(updatedMembers);
            setAddedMembers(members);
          }
        }

      } catch (error) {
        console.error('Error fetching group members:', error);
      }
    }

    // fetch messages
    useEffect(() => { 
      // getAllMessagesFromStorage()
      fetchMessages();
    }, []);

     // Scroll to the bottom when messages change
     useEffect(() => {
      if (scrollViewRef.current) {
          scrollViewRef.current.scrollToEnd({ animated: true });
      }
    }, [messages]);

    // fetch app users
    useEffect(() => {
      const fetchAppUsers = async () => {
        try {
          const response = await axios.get(`https://www.ishopwit.com/api/search/?query=${searchQuery}`);
          // filter out the current user from the search results
          const filteredResults = response.data.filter((result) => result.username.trim() !== user.username.trim());
          setSearchResults(filteredResults);
        } catch (error) {
          console.log('Error fetching members results:', error);
        }
      };
  
      fetchAppUsers();
    }, [searchQuery]);

    useEffect(() => {
      if(viewMembersModalVisible) fetchGroupMembers();
    }, [viewMembersModalVisible]);

    // Effect to handle back button press
    useEffect(() => {
      const backAction = () => {
        if (longPressMsgState) {
          setLongPressMsgState(false); 
          return true; 
        }
        return false; 
      };

      const backHandler = BackHandler.addEventListener('hardwareBackPress', backAction);

      return () => backHandler.remove(); 
    }, [longPressMsgState]); 

    // useEffect to deselect messages when longPressMsgState is false
    useEffect(() => {
      if (!longPressMsgState) {
        setSelectedMessages([]);
      }
    }, [longPressMsgState]); 

    console.log("messages are:", messages)
    // console.log("selected messages are:", selectedMessages)
  return (
    <Screen style={{backgroundColor: theme?.midnight,}}>
        <View style={[styles.header, {backgroundColor: theme?.horizon,}]}>
          <View style={styles.box}>
            <TouchableOpacity 
              onPress={() => navigation.navigate('CritScreen')} 
              style={[styles.backBtn, {backgroundColor: theme?.midnight,}]}
              accessible={true}
              accessibilityLabel="Back"
            >
              <MaterialCommunityIcons name="arrow-left" size={30} color={theme?.amberGlow} />
            </TouchableOpacity>
            <View style={styles.infoBox}>
              <AppText style={styles.groupName} numberOfLines={1}>{groupName}</AppText>
              <AppText>Chatroom</AppText>
            </View>
          </View>
          <View style={[styles.moreList, {
            justifyContent: isCreatedGroup ? 'space-between' : 'flex-end',
            paddingRight: isCreatedGroup ? 10 : 20,
          }]}>
            {isCreatedGroup && 
            <TouchableOpacity 
              onPress={handleAddMember} 
              style={[styles.moreBtn, {backgroundColor: theme?.midnight,}]} 
              activeOpacity={0.8}
              accessible={true}
              accessibilityLabel="Add member"
            >
                <MaterialCommunityIcons name="account-plus" size={30} color={theme?.amberGlow} />
            </TouchableOpacity>}
            <TouchableOpacity 
              onPress={handleMorePress} 
              style={[styles.moreBtn, {backgroundColor: theme?.midnight,}]} 
              activeOpacity={0.8}
              accessible={true}
              accessibilityLabel="More options"
            >
                <MaterialCommunityIcons name="dots-vertical" size={30} color={theme?.amberGlow} />
            </TouchableOpacity>
          </View>

          {/* longPressing messages options */}
          {selectedMessages.length > 0 && <MsgLongPressOptions
            style={{
              position: 'absolute',
              width: "100%",
              height: "100%",
              backgroundColor: theme?.midnight,
              zIndex: 20,
            }}
            messages={selectedMessages}
            deleteMsg={() => handleDeleteMessage(selectedMessages)}
            reportMsg={() => setReportMsgModalVisible(true)}
            deselectMsgs={() => setSelectedMessages([])}
            flagMsg={() => handleFlagMsg(selectedMessages)}
            unFlagMsg={() => handleUnFlagMsg(selectedMessages)}
            isFlagged={selectedMessages.every(msg => flaggedMessages.includes(msg?._id))}
          />}
          {/* end of longPressing messages options */}
        </View>

            {menuVisible && (
              <View style={[styles.menuContainer, { top: menuPosition.y + 10, left: menuPosition.x - 150, backgroundColor: theme?.midnight, zIndex: 3, elevation: 5, backgroundColor: theme?.midnight, }]}>
                <TouchableHighlight 
                  style={styles.menuItem} 
                  onPress={handleViewMembers}
                  underlayColor={theme?.blackLight}
                >
                  <AppText style={styles.menuItemText} color={theme?.amberGlow}>View Members</AppText>
                </TouchableHighlight>
                {!isCreatedGroup && <TouchableHighlight 
                  style={styles.menuItem} 
                  onPress={handleExitGroup}
                  underlayColor={theme?.blackLight}
                >
                  <AppText style={styles.menuItemText} color={theme?.amberGlow}>Exit Group</AppText>
                </TouchableHighlight>}

                {isCreatedGroup &&  <TouchableHighlight 
                  style={styles.menuItem} 
                  onPress={handleDeleteGroup}
                  underlayColor={theme?.blackLight}
                >
                  <AppText style={styles.menuItemText} color={theme?.amberGlow}>Delete Group</AppText>
                </TouchableHighlight>}
                
                {!isCreatedGroup && <TouchableHighlight 
                  style={styles.menuItem} 
                  onPress={handleBlockUser}
                  underlayColor={theme?.blackLight}
                >
                  <AppText style={styles.menuItemText} color={theme?.amberGlow}>Block User</AppText>
                </TouchableHighlight>}
              </View>
            )}

          <TouchableWithoutFeedback onPress={() => {
            setMenuVisible(false)
            Keyboard.dismiss()
            }}>
            <KeyboardAvoidingView 
              style={{ backgroundColor: theme?.midnight, padding: 10, paddingRight: 5, height: "90%", paddingBottom: 70}}
            >
            <ScrollView 
              contentContainerStyle={styles.scrollViewContent}
              ref={scrollViewRef}
              // onPress={()=> setSelectedMessages([])}
            >
              <View style={styles.chatContainer}>
                {/* messages */}
                {
                  messages?.map((msg, index) => {
                    const isCurrentUser = msg?.sender?._id === user?._id || msg?.sender === user?._id;
                    const justifyContent = isCurrentUser ? 'flex-end' : 'flex-start';
                    const selectedMessageIds = selectedMessages.map(msg => msg._id)
                    const msgIsInFlaggedMessages = flaggedMessages.includes(msg?._id);
                  
                    // if the message is a shared product it is treated as a product card
                    if (msg?.isShared) {
                      const product = JSON.parse(msg.content);

                      return (
                        <TouchableHighlight
                          key={msg._id || index}
                          style={[
                            {
                            flexDirection: 'row',
                            justifyContent: justifyContent,
                            marginBottom: 15,
                            marginTop: index === 0 ? 10 : 0,
                          },
                          msg?._id && selectedMessageIds.includes(msg?._id) && {backgroundColor: theme?.mistyLight, borderWidth: 1, borderColor: theme?.amberGlow, borderRadius: 5, padding: 2}
                        ]}
                          onPress={() => {
                            setSelectedMessages([])
                            setMenuVisible(false);
                          }}
                          underlayColor="rgba(0, 0, 0, 0.05)"
                        >
                          <TouchableOpacity
                            style={[
                              {
                                backgroundColor: msgIsInFlaggedMessages 
                                  ? theme?.punch 
                                  : (isCurrentUser ? theme?.amberGlow : theme?.horizon),
                                padding: 10,
                                borderRadius: 5,
                                maxWidth: '80%',
                                minWidth: 80,
                              }
                              
                            ]}
                            onLongPress={() => handleSelectMessageLongPress(msg)}
                            onPress={() => {
                              if(longPressMsgState) {
                                setSelectedMessages([...selectedMessages, msg]);
                                // if the message is already selected, deselect it
                                if(selectedMessages.includes(msg)) {
                                  setSelectedMessages(selectedMessages.filter(message => message !== msg));
                                }
                                return;
                              }
                              navigation.navigate(routes.PRODUCT_DETAILS, product);
                            }}
                          >
                            {/* Render product image and title */}
                            <Image 
                              source={{ uri: product?.imageUrl || "https://img.freepik.com/free-vector/illustration-gallery-icon_53876-27002.jpg?size=626&ext=jpg&ga=GA1.1.1700460183.1713139200&semt=ais" }} 
                              style={{ 
                                width: 200, 
                                height: 250, 
                                marginBottom: 5,
                                borderRadius: 5,
                                resizeMode: 'cover',
                              }} 
                            />
                            <AppText style={{ 
                                color: theme?.white, 
                                fontSize: 16, 
                                fontWeight: 'bold', 
                                textTransform: "capitalize" 
                              }} 
                              numberOfLines={1}
                            >{product?.title}</AppText>
                            {/* time and name */}
                            <View style={{
                              flexDirection: 'row',
                              justifyContent: 'space-between',
                              alignItems: 'center',
                            }}>
                              <AppText 
                                style={{fontSize: 8, fontWeight: 'bold'}} color={theme?.white}>{isCurrentUser ? "You" : msg?.sender?.username}</AppText>
                              <AppText
                                style={{
                                  fontSize: 8,
                                  fontWeight: 'bold',
                                  marginHorizontal: 5,
                                }}
                                color={isCurrentUser ? theme?.horizon : theme?.misty}
                              >
                                {formatTime(msg?.createdAt)}
                              </AppText>
                            </View>
                            {/* end of time and name */}
                          </TouchableOpacity>
                        </TouchableHighlight>
                      );

                    } else {
                      return (
                        <TouchableHighlight 
                          key={msg?._id || index} 
                          accessible={true}
                          accessibilityLabel={`${msg?.content}, Message from ${isCurrentUser ? "you" : msg?.sender?.username || "a group member"} at ${formatTime(msg?.createdAt)}`}
                          accessibilityHint={`${selectedMessages.includes(msg?._id) ? "Message selected" : "Message not selected"}`}
                          onPress={() => {
                            setSelectedMessages([])
                            setMenuVisible(false);
                          }}
                          underlayColor="rgba(0, 0, 0, 0.05)"
                          style={[
                            {
                              flexDirection: 'row', 
                              justifyContent: justifyContent, 
                              marginBottom: 15,
                              marginTop: index === 0 ? 10 : 0,
                            },
                           msg?._id && selectedMessageIds.includes(msg?._id) && {backgroundColor: theme?.mistyLight, borderWidth: 1, borderColor: theme?.amberGlow, borderRadius: 5, padding: 2}
                          ]}>
                          <DoubleTapTouchableOpacity 
                            style={[
                              {
                                backgroundColor: msgIsInFlaggedMessages 
                                  ? theme?.punch 
                                  : (isCurrentUser ? theme?.amberGlow : theme?.horizon),
                                padding: 10, 
                                paddingBottom: 5,
                                borderRadius: 5, 
                                maxWidth: '80%',
                                minWidth: 80,
                              },
                              
                            ]}
                            onLongPress={() => handleSelectMessageLongPress(msg)}
                            onPress={()=> handleSelectMessage(msg)}
                            onDoublePress={() => handleDoubleTapMessage(msg)}
                          >
                            <View style={[styles.flagIndicator, {backgroundColor: msg?.sentiment === "negative" ? "red" : "green", borderRadius: 15, borderWidth: 1, borderBlockColor: theme?.black}]}/>
                            <AppText style={{
                                fontSize: 16, 
                                fontWeight: 'bold',
                                paddingBottom: 6,
                              }}
                              color={isCurrentUser ? theme?.midnight : theme?.white}
                            >{msg?.content}</AppText>
                            {/* time and name */}
                            <View style={{
                              flexDirection: 'row',
                              justifyContent: 'space-between',
                              alignItems: 'center',
                            }}>
                              <AppText 
                                style={{fontSize: 8, fontWeight: 'bold'}} color={theme?.white}>{isCurrentUser ? "You" : msg?.sender?.username}</AppText>
                              <AppText
                                style={{
                                  fontSize: 8,
                                  fontWeight: 'bold',
                                  marginHorizontal: 5,
                                }}
                                color={isCurrentUser ? theme?.horizon : theme?.misty}
                              >
                                {formatTime(msg?.createdAt)}
                              </AppText>
                            </View>
                            {/* end of time and name */}
                          </DoubleTapTouchableOpacity>
                          
                        </TouchableHighlight>
                      )
                    }
                  
                  })
                }
                {/* end of messages */}
              </View>
            </ScrollView>
            {/* Chat input */}
            <View style={[styles.chatInputContainer, { backgroundColor: theme?.horizon,}]}>
              <TextInput
                placeholder='Type your message here...'
                placeholderTextColor={theme?.white}
                style={[styles.chatInput, {backgroundColor: theme?.midnight, color: theme?.white,}]}
                multiline
                autoCapitalize='none'
                value={message}
                onChangeText={text => setMessage(text)}
              />
              <TouchableOpacity 
                style={[styles.sendBtn, {backgroundColor: theme?.midnight,}]} 
                onPress={() => handleSendMsg(groupId, message, user?._id)}
                accessible={true}
                accessibilityLabel="Send message"
                >
                <MaterialCommunityIcons name='send' size={35} color={theme?.amberGlow} />
              </TouchableOpacity>
            </View>
            {/* End of chat input */}
        </KeyboardAvoidingView>
          </TouchableWithoutFeedback>
        
        {/* modals */}
                {/* view members modal */}
        <CustomModal
          visible={viewMembersModalVisible}
          onPress={() => setViewMembersModalVisible(false)}
          onRequestClose={() => setViewMembersModalVisible(false)}
        >
          <View style={[styles.memberBox, {backgroundColor: theme?.midnight,}]}>
            <AppText style={{fontSize: 20, fontWeight: 'bold', marginBottom: 10}} color={theme?.amberGlow}>Members in {groupName}</AppText>
            {!isCreatedGroup && <AppText style={{fontSize: 15, textAlign: "center", marginBottom: 10}}>Group creator is hidden</AppText>}
              <FlatList
                data={groupMembers}
                keyExtractor={member => member?.id?.toString()}
                renderItem={({ item }) => (
                  <View style={[styles.memberList, {backgroundColor: theme?.horizon,}]}>
                    <AppText style={{fontSize: 16}} color={theme?.white}>{item.username}</AppText>
                    {item.id === user._id && <View>
                      <MaterialCommunityIcons name="account" size={24} color={theme?.amberGlow} />
                      <AppText style={{fontSize: 12}} color={theme?.white}>You</AppText>
                    </View>}
                    {isCreatedGroup && item.id !== user._id && <TouchableHighlight
                      style={{
                        backgroundColor: theme?.mistyLight,
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
                              onPress: () => handleRemoveMember(item.id) }
                          ],
                          { cancelable: true }
                        );
                        
                      }}
                    >
                      <MaterialCommunityIcons name="account-remove" size={24} color={theme?.amberGlow} />
                    </TouchableHighlight>}
                  </View>
                )}
              />
          </View>
        </CustomModal>
                {/* end of view members modal */}
                {/* add members modal */}
        <CustomModal
          visible={addMembersVisible}
          onPress={() => setAddMembersVisible(false)}
          onRequestClose={() => setAddMembersVisible(false)}
        >
          <View style={[styles.memberBox, {backgroundColor: theme?.midnight,}]}>
            <AppText style={{fontSize: 18, fontWeight: 'bold', marginBottom: 10, textAlign: "center"}} color={theme?.white}>Add members to {groupName}</AppText>
            <View style={{
              marginVertical: 10,
            }}>
              <SearchInput
                placeholder="Search username"
                placeholderTextColor={theme?.amberGlow}
                value={searchQuery}
                onChangeText={(text) => setSearchQuery(text)}
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
                  disabled={addedMembers.includes(item.id)}
                  onPress={() => {
                    addMemberToGroup(item?.id);
                  }}
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
              {/* end of add members modal */}
              {/* report message modal */}
        <CustomModal
          visible={reportMsgModalVisible}
          onPress={() => setReportMsgModalVisible(false)}
          onRequestClose={() => setReportMsgModalVisible(false)}
        >
          <View style={[styles.memberBox, {backgroundColor: theme?.midnight,}]}>
            <View style={{
              backgroundColor: theme?.horizon,
            }}>
              <AppText style={{fontSize: 18, fontWeight: 'bold', marginBottom: 10, textAlign: "center"}} color={theme?.white}>Report Message</AppText>
              <AppText style={{fontSize: 16, marginBottom: 10, textAlign: "center"}} color={theme?.white}>Are you sure you want to report {`${selectedMessages.length > 1 ? "these messages": "This message"}`}?</AppText>
              <AppText style={{fontSize: 16, marginBottom: 10, textAlign: "center"}} color={theme?.white}>Allow up to 24 hours for us to review and get back to you.</AppText>
            </View>
            <View style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              gap: 10,
              marginTop: 10,
            }}>
              <TouchableOpacity 
                style={{
                  backgroundColor: theme?.punch,
                  padding: 10,
                  borderRadius: 5,
                }}
                onPress={() => {
                  setReportMsgModalVisible(false);
                  setSelectedMessages([]);
                }}
              >
                <AppText style={{fontSize: 16}} color={theme?.amberGlow}>Cancel</AppText>
              </TouchableOpacity>
              <TouchableOpacity 
                style={{
                  padding: 10,
                  borderRadius: 5,
                  backgroundColor: theme?.amberGlow,
                }}
                onPress={() => handleReportMessages(selectedMessages)}
              >
                <AppText style={{ fontSize: 16}} color={theme?.midnight}>Report</AppText>
              </TouchableOpacity>
            </View>
          </View>
        </CustomModal>
              {/* end of report message modal */}
              {/* tone flag reason */}
        <CustomModal
          visible={showToneFlaggedReasonModal}
          onPress={() => setShowToneFlaggedReasonModal(false)}
          onRequestClose={() => setShowToneFlaggedReasonModal(false)}
        >
         <View style={[styles.memberBox, {backgroundColor: theme?.horizon,}]}>
            <View style={{
              backgroundColor: theme?.midnight,
              borderRadius: 10,
              padding: 10,
            }}>
              <AppText style={{fontSize: 18, fontWeight: 'bold', marginBottom: 10, textAlign: "center"}} color={theme?.white}>Flagged message</AppText>
              <AppText style={{fontSize: 16, marginBottom: 10, textAlign: "center"}} color={theme?.white}>{toneFlaggedReason?.content}</AppText>
              <AppText style={{fontSize: 16, marginBottom: 10, textAlign: "center"}} color={theme?.white}>This message has a <Text style={{color: toneFlaggedReason?.sentiment === "negative" ? theme?.punch : theme?.amberGlow}}>{toneFlaggedReason?.sentiment || "neutral"}</Text> tone.</AppText>
              <AppText style={{fontSize: 14, marginBottom: 10, textAlign: "center"}} color={theme?.white}>Messages with abusive/offensive language are not allowed.</AppText>
            </View>
          </View>
        </CustomModal>
              {/* end of flag reason modal */}

        {/* end of modals */}
    </Screen>
  );
}

const styles = StyleSheet.create({
  chatControl: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
    position: 'absolute',
    bottom: 0,
    width: "100%",
  },
  box: {
    flexDirection: 'row',
    gap: 10,
    alignItems: 'center',
    width: "70%",
  },
  backBtn: {
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 5,
  },
  flagIndicator: {
    position: 'absolute',
    width: 10,
    height: 10,
    top: 5,
    right: 5,
  },
  header: {
    padding: 5,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 10,
  },
  infoBox: {
    flexDirection: 'column',
    maxWidth: '83%',
  },
  groupName: {
    fontSize: 19,
    fontWeight: 'bold',
  },
  menuContainer: {
    position: 'absolute',
    borderRadius: 5,
    paddingVertical: 5,
    paddingHorizontal: 10,
  },
  menuItem: {
    padding: 8,
    borderRadius: 5,
  },
  menuItemText: {
    fontSize: 16,
  },
  moreBtn: {
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 5,
  },
  moreList: {
    flexDirection: 'row',
    gap: 10,
    alignItems: 'center',
    width: "30%",
  },
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
  scrollViewContent: {
    minHeight: '100%',
  },
  chatContainer: {
    // flexGrow: 1,
    width: '100%',
    height: '100%',
    // paddingHorizontal: 10,
  },
  chatInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingVertical: 10,
    paddingHorizontal: 5,
    paddingRight: 10,
    width: '100%',
    height: 80,
    borderRadius: 5,
    elevation: 5,
  },
  chatInput: {
    width: "80%",
    height: "100%",
    fontSize: 16,
    borderRadius: 5,
    paddingHorizontal: 10,
  },
  sendBtn: {
    padding: 10,
    borderRadius: 5,
    width: "20%",
    alignItems: 'center',
    justifyContent: 'center',
    height: "100%",
  },
});

export default ChatroomScreen;