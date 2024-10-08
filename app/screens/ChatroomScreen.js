import React, {useState, useRef, useEffect, useCallback} from 'react';
import { StyleSheet, TouchableWithoutFeedback, KeyboardAvoidingView, Alert, Keyboard, BackHandler, ToastAndroid, Platform, Dimensions, FlatList, TouchableOpacity, View } from 'react-native';
import axios from 'axios';
import {io} from 'socket.io-client';
import { Audio } from 'expo-av';
import * as ImagePicker from 'expo-image-picker';

// custom imports
import Screen from '../components/Screen';
import useAuth from '../auth/useAuth';
import storage from '../auth/storage';
import routes from '../navigation/routes';
import { useTheme } from '../utils/ThemeContext';
import reportMsg from '../api/reportMsg';
import deleteMsgs from '../api/deleteMsgs';
import flagMessage from '../api/flagMessage'
import ToneFlagModal from '../components/modals/ToneFlagModal';
import ReportMsgModal from '../components/modals/ReportMsgModal';
import AddMembersModal from '../components/modals/AddMembersModal';
import ViewMembersModal from '../components/modals/ViewMembersModal';
import ChatInput from '../components/ChatInput';
import MessageBubble from '../components/MessageBubble';
import MessageProductBubble from '../components/MessageProductBubble';
import ChatRoomHeader from '../components/ChatRoomHeader';
import ChatRoomMenu from '../components/ChatRoomMenu';
import Icon from '../components/Icon';
import DescriptionModal from '../components/modals/DescriptionModal';
import AppText from '../components/AppText';
import AppButton from '../components/AppButton';
import groupProfileImage from '../api/groupProfileImage';

const receive_sound = '../assets/sounds/receive_sound.wav';
const send_sound = '../assets/sounds/send_sound.mp3';
const { height: screenHeight } = Dimensions.get('window');

const keyboardVerticalOffset = Platform.select({
  ios: screenHeight > 700 ? 90 : 70, 
  android: screenHeight > 700 ? 30 : 40, 
});

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
  const [numOfUsersOnline, setNumOfUsersOnline] = useState(1);
  const [replyMessage, setReplyMessage] = useState(null);
  const [showScrollToBottom, setShowScrollToBottom] = useState(false);
  const [groupImage, setGroupImage] = useState(null);
  const [showDeleteGroupModal, setShowDeleteGroupModal] = useState(false);
  const [showExitGroupModal, setShowExitGroupModal] = useState(false);
  const [isProduct, setIsProduct] = useState(false);
  
  const scrollViewRef = useRef(null) 
  const socketRef = useRef(null);
  const swipeBubbleRef = useRef(null)
  const messageRefs = useRef({})
  const { user } = useAuth();
  const { groupName, groupId, setGroups, isCreatedGroup, profileImg } = route.params;
  const { theme } = useTheme();

  // socket connections
  useEffect(() => {
    socketRef.current = io('https://www.ishopwit.com', {
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

    const socket = socketRef.current;

    // new message received
    socket.on("message", (newMessage) => {
      // console.log('new message sent:', newMessage); 
      setMessages((prevMessages) => [...prevMessages, newMessage]);
      PlayReceiveSound();
    });
    // on connection
    socket.on("connect", () => {
      // console.log("Connected to the Socket.IO server");
      socket.emit('joinRoom', { roomId: groupId, userId: user?._id });
    });
    
    // on connection error
    socket.on('connect_error', (err) => {
      console.log('Connection Error:', err.message);
      socket.connect()
    });
    
    // on disconnect
    socket.on('disconnect', (reason) => {
      console.log('Disconnected:', reason);
      socket.emit('leaveRoom', groupId);
      if (reason) {
        console.log('Attempting to reconnect...');
        socket.connect();
      }
    }); 

    // online users
    socket.on('onlineUsers', (users) => {
      console.log('Online users:', users);
      setNumOfUsersOnline(Number(users));
    })

    return () => {
      socket.disconnect();
      socket.off('onlineUsers');
      socket.off('message');
      socket.off('connect');
      socket.off('connect_error');
    }

  }, []);

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

    // custom functions
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
      setMenuVisible(prev => !prev);
    };  

    const addMemberToGroup = async (memberId, memberName) => {
      try {
        const response = await axios.post(`https://www.ishopwit.com/api/groups/add-member`, 
        { groupId: groupId, userId: memberId, groupName: groupName, memberName: memberName });

        if (response.data) {
          setAddedMembers([...addedMembers, memberId]);
          fetchGroups();
        }
        
      }
      catch (error) {
        console.log('Error adding member:', error);
        if (error.response) {
          // The request was made and the server responded with a status code
          console.log('Response error data:', error.response.data);
        } else if (error.request) {
          // The request was made but no response was received
          console.log('No response received:', error.request);
        } else {
          // Something happened in setting up the request that triggered an error
          console.log('Request setup error:', error.message);
        }
      }
    };

    const fetchGroups = async () => {
      try {
        const response = await axios.get(`https://www.ishopwit.com/api/user/groups/?userId=${memberId}`)
    
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
          setShowExitGroupModal(false);
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
          { text: 'Yes', onPress: () => exitGroup() }
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
          setShowDeleteGroupModal(false);
          navigation.navigate('CritScreen')
        }

      } catch (error) {
        console.error('Error deleting group:', error);
      }
    }

    const handleSendMsg = async (roomId, message, senderId) => {
      try {
        if (message.trim().length === 0) return;
        // console.log('message:', message, 'senderId:', senderId, 'roomId:', roomId)
        const flaggedResult = await flagMessage.flagMessage(message);

        const socket = socketRef.current;

        socket.emit('sendMessage', { 
                                    roomId, 
                                    message, 
                                    senderId,
                                    sentiment: flaggedResult?.data?.message,
                                    replyToId: replyMessage ? replyMessage._id : null,
                                    repliedMessage: replyMessage ? replyMessage.content : null, 
                                  });
        clearReply()
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
        }

      } catch (error) {
        console.error('Error fetching messages from server:', error);
      }
    }

    const handleSelectMessageLongPress = (msg) => {
      setIsProduct(msg?.isShared);
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

    // reply functionality
    const clearReply = () => {
      setReplyMessage(null);
    };

    const scrollToMessage = (messageId) => {
      const messageIndex = messages.findIndex(msg => msg._id === messageId);
    
      if (messageIndex !== -1) {
        scrollViewRef.current.scrollToIndex({
          index: messageIndex,
          animated: true,
        });
      } else {
        console.log(`Message ID ${messageId} not found`);
      }
    };

    const updateBubbleRef = useCallback((ref, msgId) => {
      if (ref && replyMessage && msgId === replyMessage._id) {
        swipeBubbleRef.current = ref;
      }
    }, [replyMessage]);

    useEffect(() => {
      if (replyMessage && swipeBubbleRef.current) {
        scrollToEnd()
        swipeBubbleRef.current.close();
        swipeBubbleRef.current = null;
      }
    }, [replyMessage, swipeBubbleRef]);
    // end of reply

    // fetch messages
    useEffect(() => { 
      fetchMessages();
    }, []);

     // Scroll to the bottom when messages change
     const ITEM_HEIGHT = 50;
     const scrollToEnd = () => {
      if (scrollViewRef.current && messages.length > 0) {
        scrollViewRef.current.scrollToOffset({
          offset: messages.length * ITEM_HEIGHT, 
          animated: true,
        });
      }
    }

    // scroll button when user scrolls up past screenHeight
    const handleScroll = (event) => {
      const { contentOffset, layoutMeasurement } = event.nativeEvent;
      const isAtTop = contentOffset.y < layoutMeasurement.height;
  
      // Show the button if the user scrolls up past the height of the screen
      setShowScrollToBottom(isAtTop);
    };

    const scrollToBottom = () => {
      scrollViewRef.current.scrollToOffset({ 
        animated: true, 
        offset: messages.length * ITEM_HEIGHT,  
      });
    };

    // scroll to the end of the messages
     useEffect(() => {
      scrollToEnd()
    }, [messages]);

    // fetch app users
    useEffect(() => {
      const fetchAppUsers = async () => {
        try {
          const response = await axios.get(`https://www.ishopwit.com/api/search/?query=${searchQuery}`);
          // filter out the current user from the search results
          const filteredResults = response.data.filter((result) => result.username.trim() !== user.username.trim());
          setSearchResults(filteredResults);

          // console.log('Search results:', filteredResults);
        } catch (error) {
          console.log('Error fetching members results:', error);
        }
      };
  
      fetchAppUsers();
    }, [searchQuery]);

// fetch group members
    useEffect(() => {
      if(viewMembersModalVisible || addMembersVisible) fetchGroupMembers();
    }, [viewMembersModalVisible, addMembersVisible]);

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
 
    // set group image
    const handleSetGroupImage = async () => {
      const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
  
      if (permissionResult.granted === false) {
        alert("Permission to access camera roll is required!");
        return;
      }
  
      // Launch the image picker
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.5,
      });
  
      if (result.canceled) {
        console.log('User cancelled image picker');
        alert('You have not selected an image');
      } else {
        const selectedImageUri = result.assets[0].uri;
  
        setGroupImage(selectedImageUri); 
        uploadGroupImageToServer(groupId, selectedImageUri);
        setMenuVisible(false)
      }
    };

    const uploadGroupImageToServer = async (groupId, imageUri) => {
      try {
        const response = await groupProfileImage.uploadGroupProfileImage(groupId, imageUri);
  
        if (response.ok) {
          console.log('Group image uploaded successfully:', response.data);
        } else {
          console.log('Error uploading group image:', response.data);
        }
      } catch (error) {
        console.error('Error uploading group image:', error);
      }
    }

    // console.log("messages are:", messages)
    // console.log("selected messages are:", selectedMessages)
  return (
    <Screen >
      {/* header */}
      <ChatRoomHeader 
        navigation={navigation}
        groupName={groupName}
        isCreatedGroup={isCreatedGroup}
        addMember={handleAddMember}
        morePress={handleMorePress}
        selectedMessages={selectedMessages}
        deleteMsg={handleDeleteMessage}
        reportMsg={() => setReportMsgModalVisible(true)}
        deselectMsgs={() => setSelectedMessages([])}
        flagMsg={handleFlagMsg}
        unFlagMsg={handleUnFlagMsg}
        isFlagged={selectedMessages.every(msg => flaggedMessages.includes(msg?._id))}
        numberOfUsersOnline={numOfUsersOnline}
        groupImg={groupImage || profileImg}
        isProduct={isProduct}
      />
      {/* end of header */}
      {/* menu */}
      {menuVisible && (
        <ChatRoomMenu 
          py={menuPosition.y} 
          px={menuPosition.x} 
          viewMembers={handleViewMembers} 
          isCreatedGroup={isCreatedGroup} 
          exitGroup={()=> setShowExitGroupModal(true)} 
          deleteGroup={() => setShowDeleteGroupModal(true)} 
          blockUser={handleBlockUser}
          setGroupImage={handleSetGroupImage}
        />
      )}
      {/* end of menu */}
      {/* main messaging code */}
      <TouchableWithoutFeedback 
        onPress={() => {
        setMenuVisible(false)
        Keyboard.dismiss()
        }}
      >
        <KeyboardAvoidingView
          style={{ 
            flex: 1,
            paddingBottom: 2,
          }}
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          keyboardVerticalOffset={keyboardVerticalOffset}
        >
          {showScrollToBottom && (
            <TouchableOpacity 
              style={[styles.scrollDownBtn, { backgroundColor: theme?.horizon }]} 
              onPress={scrollToBottom}
              activeOpacity={0.7}
            >
              <Icon name="arrow-down" size={24} color="white" />
            </TouchableOpacity>
          )}
          {/* messages list */}
        <FlatList 
          ref={scrollViewRef} 
          data={messages}  
          keyExtractor={(msg, index) => msg?._id || index.toString()} 
          showsVerticalScrollIndicator={false}
          onScroll={handleScroll}
          scrollEventThrottle={16}
          renderItem={({ item: msg, index }) => {

            const isCurrentUser = msg?.sender?._id === user?._id || msg?.sender === user?._id;
            const justifyContent = isCurrentUser ? 'flex-end' : 'flex-start';
            const selectedMessageIds = selectedMessages.map(msg => msg._id);
            const msgIsInFlaggedMessages = flaggedMessages.includes(msg?._id);

            // Check if the message is a shared product
            if (msg?.isShared) {
              const product = JSON.parse(msg.content);

              return (
                <MessageProductBubble
                  key={msg?._id || index}
                  msgPress={() => {
                    setSelectedMessages([]);
                    setMenuVisible(false);
                  }} 
                  justifyContent={justifyContent}
                  index={index}
                  msgId={msg?._id}
                  selectedMessageIds={selectedMessageIds}
                  isCurrentUser={isCurrentUser}
                  msgSenderUsername={msg?.sender?.username}
                  msgTime={msg?.createdAt}
                  selectedMessages={selectedMessages}
                  msgIsInFlaggedMessages={msgIsInFlaggedMessages}
                  longPress={() => handleSelectMessageLongPress(msg)}
                  productPress={() => {
                    if (longPressMsgState) {
                      setSelectedMessages([...selectedMessages, msg]);
                      if (selectedMessages.includes(msg)) {
                        setSelectedMessages(selectedMessages.filter(message => message !== msg));
                      }
                      return;
                    }
                    navigation.navigate(routes.PRODUCT_DETAILS, product);
                  }}
                  productTitle={product?.title}
                  productImageUrl={product?.images[0]}
                />
              );
            } else {
              return (
                <MessageBubble
                  key={msg?._id || index}
                  msgPress={() => {
                    setSelectedMessages([]);
                    setMenuVisible(false);
                  }} 
                  onLayout={(event) => {
                    const { layout } = event.nativeEvent;
                    messageRefs.current[msg?._id] = {
                        offsetTop: layout.y,
                    };
                  }}
                  justifyContent={justifyContent}
                  index={index}
                  msgId={msg?._id}
                  selectedMessageIds={selectedMessageIds}
                  msgContent={msg?.content}
                  isCurrentUser={isCurrentUser}
                  msgSenderUsername={msg?.sender?.username}
                  msgTime={msg?.createdAt}
                  selectedMessages={selectedMessages}
                  msgIsInFlaggedMessages={msgIsInFlaggedMessages}
                  messageLongPress={() => handleSelectMessageLongPress(msg)}
                  selectMessage={() => handleSelectMessage(msg)}
                  doubleTapMessage={() => handleDoubleTapMessage(msg)}
                  msgSentiment={msg?.sentiment}
                  setReplyOnSwipeOpen={() => setReplyMessage(msg)}
                  updateBubbleRef={updateBubbleRef}
                  message={msg}
                  onReplyPress={scrollToMessage}
                />
              );
            }
          }}
          contentContainerStyle={styles.scrollViewContent}
        />
          {/* enf of messages list */}
          {/* Chat input */}
          <ChatInput
            message={message} 
            setMessage={setMessage}
            sendMessage={() => handleSendMsg(groupId, message, user?._id)}
            reply={replyMessage}
            clearReply={clearReply}
          />
          {/* End of chat input */}
    </KeyboardAvoidingView>
      </TouchableWithoutFeedback>
      {/* end of main messaging code */}
        
        {/* modals */}
                {/* view members modal */}
      <ViewMembersModal 
        visible={viewMembersModalVisible}
        closeModal={() => setViewMembersModalVisible(false)}
        groupName={groupName}
        isCreatedGroup={isCreatedGroup}
        groupMembers={groupMembers}
        userId={user?._id}
        removeMember={handleRemoveMember}
        numOfUsersOnline={numOfUsersOnline}
      />
                {/* end of view members modal */}
                {/* add members modal */}
      <AddMembersModal
        visible={addMembersVisible}
        closeModal={() => setAddMembersVisible(false)}
        groupName={groupName}
        searchQuery={searchQuery}
        onChangeQueryText={(text) => setSearchQuery(text)}
        searchResults={searchResults}
        addedMembers={addedMembers}
        disabled={addedMembers.includes(user?._id)}
        addMemberToGroup={addMemberToGroup}
      />
              {/* end of add members modal */}
              {/* report message modal */}
      <ReportMsgModal
        visible={reportMsgModalVisible}
        msgString={selectedMessages.length > 1 ? "these messages" : "this message"}
        reportPress={() => handleReportMessages(selectedMessages)}
        closeModal={() => {
          setReportMsgModalVisible(false);
          setSelectedMessages([]);
        }}
      />
              {/* end of report message modal */}
              {/* tone flag reason */}
      <ToneFlagModal 
        visible={showToneFlaggedReasonModal}
        message={toneFlaggedReason?.content}
        sentimentColor={toneFlaggedReason?.sentiment === "negative" ? theme?.punch : theme?.amberGlow}
        flagReason={toneFlaggedReason?.sentiment}
        closeModal={() => setShowToneFlaggedReasonModal(false)}
      />
              {/* end of flag reason modal */}
        {/* delete group modal */}
        <DescriptionModal
          visible={showDeleteGroupModal}
          closeModal={() => setShowDeleteGroupModal(false)}
          header='Delete Group'
        >
          <AppText>Are you sure you want to delete this group?</AppText>
          <View style={styles.buttonWrapper}>
            <AppButton 
              title='Yes' 
              onPress={deleteGroup} 
              color={theme?.punch}
              textColor={theme?.white}
              width='45%'
            />
            <AppButton 
              title='Cancel' 
              onPress={() => setShowDeleteGroupModal(false)} 
              color={theme?.horizon}
              textColor={theme?.white}
              width='45%'
            />

          </View>
        </DescriptionModal>
        {/* end of delete group modal */}
        {/* exit group modal */}
        <DescriptionModal
          visible={showExitGroupModal}
          closeModal={() => setShowExitGroupModal(false)}
          header='Exit Group'
        >
          <AppText style={{fontSize: 20, marginBottom: 10}}>Are you sure you want to exit this group?</AppText>
          <AppText style={{fontSize: 14}}>You will not be able to join back unless added back.</AppText>
          <View style={styles.buttonWrapper}>
            <AppButton
              title='Yes'
              onPress={exitGroup}
              color={theme?.punch}
              textColor={theme?.white}
              width='45%'
            />
            <AppButton
              title='Cancel'
              onPress={() => setShowExitGroupModal(false)}
              color={theme?.horizon}
              textColor={theme?.white}
              width='45%'
            />
          </View>
        </DescriptionModal>
        {/* end of exit group modal */}

        {/* end of modals */}
    </Screen>
  );
}

const styles = StyleSheet.create({
  scrollViewContent: {
    padding: 5,
  },
  scrollDownBtn: {
    position: 'absolute',
    bottom: 120,
    right: 5,
    padding: 5,
    borderRadius: 30,
    zIndex: 10,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  }
  
});

export default ChatroomScreen;