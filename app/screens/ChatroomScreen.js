import React, {useState, useRef, useEffect} from 'react';
import { View, StyleSheet, TouchableOpacity, ScrollView, TouchableWithoutFeedback, KeyboardAvoidingView, TouchableHighlight, FlatList, Alert, TextInput, Keyboard, Image } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import axios from 'axios';
import {io} from 'socket.io-client';
import AsyncStorage from '@react-native-async-storage/async-storage';

import Screen from '../components/Screen';
import AppText from '../components/AppText';
import colors from '../config/colors';
import CustomModal from '../components/CustomModal';
import SearchInput from '../components/SearchInput';
import useAuth from '../auth/useAuth';
import storage from '../auth/storage';
import routes from '../navigation/routes';
import {storeMessages, getMessages} from '../utils/socketMessages'

function ChatroomScreen({route, navigation}) {
  const [menuVisible, setMenuVisible] = useState(false);
  const [menuPosition, setMenuPosition] = useState({ x: 0, y: 0 });
  const [viewMembersModalVisible, setViewMembersModalVisible] = useState(false);
  const [addMembersVisible, setAddMembersVisible] = useState(false);
  const [reportMsgModalVisible, setReportMsgModalVisible] = useState(false);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [selectedMessageId, setSelectedMessageId] = useState(null);
  const [selectedMsgToReport, setSelectedMsgToReport] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [groupMembers, setGroupMembers] = useState([]); 
  const [addedMembers, setAddedMembers] = useState([])
  
  const scrollViewRef = useRef(null)
  const { user } = useAuth();
  const socket = io('http://shopwit.eba-g43qxnjk.us-west-2.elasticbeanstalk.com', {
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

  // socket message
  socket.on("connect", () => {
    // console.log("Connected to the Socket.IO server");
    socket.emit('joinRoom', groupId);
  });
  
  socket.on('connect_error', (err) => {
    console.error('Connection Error:', err.message);
    socket.disconnect() // i have to remove this later
  });
  
  socket.on('disconnect', (reason) => {
    console.log('Disconnected:', reason);
    if (reason) {
      console.log('Attempting to reconnect...');
      socket.connect();
    }
  });

  useEffect(() => {
    socket.on("message", (newMessage) => {
      console.log('new message sent:', newMessage); 
      setMessages((prevMessages) => [...prevMessages, newMessage]);
    });
    return () => {
      socket.disconnect();
    };
  }, []);

    const formatTime = (time) => {
      const date = new Date(time);
      return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true });
    };
  
    const handleMorePress = (event) => {
      setMenuPosition({ x: event.nativeEvent.pageX, y: event.nativeEvent.pageY });
      setMenuVisible(!menuVisible);
    };  

    const addMemberToGroup = async (memberId) => {
      try {
        const response = await axios.post(`http://shopwit.eba-g43qxnjk.us-west-2.elasticbeanstalk.com/api/groups/add-member`, 
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
        const response = await axios.post(`http://shopwit.eba-g43qxnjk.us-west-2.elasticbeanstalk.com/api/groups/remove-member`, 
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
      const token = await storage.getToken();
      try {
        const response = await axios.post(`http://shopwit.eba-g43qxnjk.us-west-2.elasticbeanstalk.com/api/groups/exit-member`, 
        { groupId: groupId, memberId: user?._id});

        console.log('exit group response:', response?.data);

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

    const handleExitGroup = () => {
      setMenuVisible(false);
      
      Alert.alert(
        'Exit Group',
        'Are you sure you want to exit this group?',
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
        const response = await axios.post(`http://shopwit.eba-g43qxnjk.us-west-2.elasticbeanstalk.com/api/delete-group`, { groupId: groupId })

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

    const handleSendMsg = (roomId, message, senderId) => {
      try {
        if (message.trim().length === 0) return;
        console.log('message:', message, 'senderId:', senderId, 'roomId:', roomId)
        socket.emit('sendMessage', { roomId, message, senderId });
        setMessage('');
        Keyboard.dismiss();

        // fetch messages
        // setTimeout(() => {
        //   fetchMessages();
        // }, 200);

      } catch (error) {
        console.error('Error sending message:', error);

        if (error.response) {
          console.error('Response data:', error.response.data);
        } else if (error.request) {
          console.error('No response received:', error.request);
        } else {
          console.error('Request setup error:', error.message);
        }
      }
    }

    const handleDeleteMessage = (id) => {
      console.log('deleting message:', id);
      const updatedMessages = messages.filter(msg => msg._id !== id);
      setMessages(updatedMessages);
      setSelectedMessageId(null)
    }

    const fetchMessages = async () => {
      try {
        const response = await axios.get(`http://shopwit.eba-g43qxnjk.us-west-2.elasticbeanstalk.com/api/group/messages/?groupId=${groupId}`)
        if (response.data) {
          setMessages(response?.data);
        }
        // const storedMessages = await getMessages();
        // setMessages(storedMessages);

      } catch (error) {
        console.error('Error fetching messages from server:', error);
      }
    }
    
    // fetch messages
    useEffect(() => { 
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
          const response = await axios.get(`https://pacific-sierra-04938-5becb39a6e4f.herokuapp.com/api/search/?query=${searchQuery}`);
          // filter out the current user from the search results
          const filteredResults = response.data.filter((result) => result.username.trim() !== user.username.trim());
          setSearchResults(filteredResults);
        } catch (error) {
          console.error('Error fetching members results:', error);
        }
      };
  
      fetchAppUsers();
    }, [searchQuery]);

    // fetch group members
    useEffect(() => {
      const fetchGroupMembers = async () => {
        try {
          const response = await axios.get(`https://pacific-sierra-04938-5becb39a6e4f.herokuapp.com/api/group/members/?groupId=${groupId}`);

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

      fetchGroupMembers();
    }, [groupId, groupMembers]);

    // console.log("messages are:", messages)
  return (
    <Screen style={styles.screen}>
        <View style={styles.header}>
          <View style={styles.box}>
            <TouchableOpacity 
              onPress={() => navigation.navigate('CritScreen')} 
              style={styles.backBtn}
              accessible={true}
              accessibilityLabel="Back"
            >
              <MaterialCommunityIcons name="arrow-left" size={30} color={colors.amberGlow} />
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
              style={styles.moreBtn} 
              activeOpacity={0.8}
              accessible={true}
              accessibilityLabel="Add member"
            >
                <MaterialCommunityIcons name="account-plus" size={30} color={colors.amberGlow} />
            </TouchableOpacity>}
            <TouchableOpacity 
              onPress={handleMorePress} 
              style={styles.moreBtn} 
              activeOpacity={0.8}
              accessible={true}
              accessibilityLabel="More options"
            >
                <MaterialCommunityIcons name="dots-vertical" size={30} color={colors.amberGlow} />
            </TouchableOpacity>
          </View>
        </View>

            {menuVisible && (
              <View style={[styles.menuContainer, { top: menuPosition.y + 10, left: menuPosition.x - 150, backgroundColor: colors.midnight, zIndex: 3, elevation: 5 }]}>
                <TouchableHighlight 
                  style={styles.menuItem} 
                  onPress={handleViewMembers}
                  underlayColor="rgba(0, 0, 0, 0.1)"
                >
                  <AppText style={styles.menuItemText}>View Members</AppText>
                </TouchableHighlight>
                {!isCreatedGroup && <TouchableHighlight 
                  style={styles.menuItem} 
                  onPress={handleExitGroup}
                  underlayColor="rgba(0, 0, 0, 0.1)"
                >
                  <AppText style={styles.menuItemText}>Exit Group</AppText>
                </TouchableHighlight>}

                {isCreatedGroup &&  <TouchableHighlight 
                  style={styles.menuItem} 
                  onPress={handleDeleteGroup}
                  underlayColor="rgba(0, 0, 0, 0.1)"
                >
                  <AppText style={styles.menuItemText}>Delete Group</AppText>
                </TouchableHighlight>}
                {/* Add more menu items as needed */}
              </View>
            )}

          <TouchableWithoutFeedback onPress={() => {
            setMenuVisible(false)
            Keyboard.dismiss()
            }}>
            <KeyboardAvoidingView 
              // behavior='padding' 
              // keyboardVerticalOffset={-200} 
              style={{ backgroundColor: colors.midnight, padding: 10, paddingRight: 5, height: "90%", paddingBottom: 70}}
            >
            <ScrollView 
              contentContainerStyle={styles.scrollViewContent}
              ref={scrollViewRef}
              onPress={()=> {
                setSelectedMessageId(null)
                console.log('message deselected')
              }}
            >
              <View style={styles.chatContainer}>
                {/* messages */}
                {
                  messages?.map((msg, index) => {
                    const isCurrentUser = msg?.sender?._id === user?._id || msg?.sender === user?._id;
                    const justifyContent = isCurrentUser ? 'flex-end' : 'flex-start';
                  
                    // if the message is a shared product it is treated as a product card
                    if (msg?.isShared) {
                      const product = JSON.parse(msg.content);

                      return (
                        <TouchableOpacity
                          key={msg._id || index}
                          onPress={() => {
                            navigation.navigate(routes.PRODUCT_DETAILS, product);
                          }}
                          onLongPress={() => setSelectedMessageId(msg?._id)}
                          style={{
                            flexDirection: 'row',
                            justifyContent: justifyContent,
                            marginBottom: 15,
                            marginTop: index === 0 ? 10 : 0,
                          }}
                        >
                          <View
                            style={[
                              {
                                backgroundColor: isCurrentUser ? colors.amberGlowLight : colors.horizon,
                                padding: 10,
                                paddingBottom: 20,
                                borderRadius: 5,
                                maxWidth: '80%',
                                minWidth: 80,
                              },
                              msg?._id === selectedMessageId && {
                                backgroundColor: colors.punch,
                                borderWidth: 1,
                                borderColor: colors.amberGlow,
                                borderRadius: 5,
                                padding: 9,
                                paddingBottom: 19,
                                maxWidth: '80%',
                              },
                            ]}
                          >
                            {/* Render product image and title */}
                            <Image 
                              source={{ uri: product?.imageUrl || "https://img.freepik.com/free-vector/illustration-gallery-icon_53876-27002.jpg?size=626&ext=jpg&ga=GA1.1.1700460183.1713139200&semt=ais" }} 
                              style={{ 
                                width: 200, 
                                height: 240, 
                                marginBottom: 5,
                                borderRadius: 5,
                                resizeMode: 'cover',
                              }} 
                            />
                            <AppText style={{ 
                                color: colors.white, 
                                fontSize: 16, 
                                fontWeight: 'bold', 
                                textTransform: "capitalize" 
                              }} 
                              numberOfLines={1}
                            >{product?.title}</AppText>
                          </View>
                          <AppText
                            style={{
                              color: isCurrentUser ? colors.horizon : colors.misty,
                              position: 'absolute',
                              bottom: 2,
                              fontSize: 10,
                              right: isCurrentUser ? 10 : 'auto',
                              fontWeight: 'bold',
                              marginHorizontal: 10,
                            }}
                          >
                            {formatTime(msg?.createdAt)}
                          </AppText>

                          {msg?._id === selectedMessageId && (
                              <TouchableOpacity
                                  onPress={() => handleDeleteMessage(msg?._id)}
                                  style={{
                                      backgroundColor: colors.amberGlow,
                                      padding: 5,
                                      paddingHorizontal: 10,
                                      borderRadius: 5,
                                      marginTop: 25,
                                      position: "absolute",
                                      right: "50%",
                                      top: "40%",
                                  }}
                              >
                                  <AppText style={{ color: colors.white }}>Delete</AppText>
                              </TouchableOpacity>
                          )}
                        </TouchableOpacity>
                      );

                    } else {
                      return (
                        <TouchableOpacity 
                          key={msg?._id || index} 
                          activeOpacity={0.7}
                          onLongPress={() => {
                            setSelectedMessageId(msg?._id)
                          }}
                          onPress={()=> {
                            setSelectedMessageId(null)
                            setMenuVisible(false)
                          }}
                          style={[
                            {
                              flexDirection: 'row', 
                              justifyContent: justifyContent, 
                              marginBottom: 15,
                              marginTop: index === 0 ? 10 : 0,
                              // set the width of the message box to 80% of the screen width
                            },
                            msg?._id === selectedMessageId && {backgroundColor: colors.mistyLight, borderWidth: 1, borderColor: colors.amberGlow, borderRadius: 5, padding: 2}
                          ]}>
                            {msg?._id === selectedMessageId && (
                              <View
                                style={{
                                  backgroundColor: colors.horizon,
                                  padding: 8,
                                  borderRadius: 5,
                                  position: "absolute",
                                  right: isCurrentUser ? "65%" : "20%",
                                  gap: 5,
                                  top: "2%",
                                  elevation: 5,
                                }}
                              >
                                <TouchableOpacity
                                    onPress={() => handleDeleteMessage(msg?._id)}
                                    style={{
                                        backgroundColor: colors.mistyLight,
                                        padding: 3,
                                        borderRadius: 5,
                                    }}
                                    accessible={true}
                                    accessibilityLabel="Delete message"
                                >
                                    <AppText style={{ color: colors.white, fontSize: 12 }}>Delete <MaterialCommunityIcons 
                                    name='trash-can-outline'
                                    size={10}
                                    color={colors.white}
                                    /></AppText>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    onPress={() => {
                                      setSelectedMsgToReport(msg);
                                      setReportMsgModalVisible(true);
                                    }}
                                    style={{
                                      backgroundColor: colors.mistyLight,
                                      padding: 3,
                                      borderRadius: 5,
                                  }}
                                    accessible={true}
                                    accessibilityLabel="Report message"
                                >
                                    <AppText style={{ color: colors.white, fontSize: 12 }}>Report <MaterialCommunityIcons 
                                    name='flag'
                                    size={10}
                                    color={colors.white}
                                    /></AppText>
                                </TouchableOpacity>
                              </View>
                          )}
                          {/* message content */}
                          <View 
                            style={[
                              {
                                backgroundColor: isCurrentUser ? colors.amberGlow : colors.horizon, 
                                padding: 10, 
                                paddingBottom: 5,
                                borderRadius: 5, 
                                maxWidth: '80%',
                                minWidth: 80,
                              },
                              
                            ]}>
                            <AppText style={{
                              color: isCurrentUser ? colors.midnight : colors.white, 
                              fontSize: 16, 
                              fontWeight: 'bold',
                              paddingBottom: 10,
                            }}>{msg?.content}</AppText>
                            {/* time and name */}
                            <View style={{
                              flexDirection: 'row',
                              justifyContent: 'space-between',
                              alignItems: 'center',
                              backgroundColor: "red",
                            }}>
                              <AppText 
                                style={{
                                  color: colors.white, fontSize: 8, fontWeight: 'bold'
                                }}
                                >{msg?.sender?.username}</AppText>
                              <AppText
                                style={{
                                  color: isCurrentUser ? colors.horizon : colors.misty,
                                  position: 'absolute',
                                  bottom: 2,
                                  fontSize: 8,
                                  right: isCurrentUser ? 10 : 'auto',
                                  fontWeight: 'bold',
                                  marginHorizontal: 10,
                                }}
                              >
                                {formatTime(msg?.createdAt)}
                              </AppText>
                            </View>
                            {/* end of time and name */}
                          </View>
                          
                        </TouchableOpacity>
                      )
                    }
                  
                  })
                }
                {/* end of messages */}
              </View>
            </ScrollView>
            {/* Chat input */}
            <View style={styles.chatInputContainer}>
              <TextInput
                placeholder='Type your message here...'
                placeholderTextColor={colors.white}
                style={styles.chatInput}
                multiline
                autoCapitalize='none'
                value={message}
                onChangeText={text => setMessage(text)}
              />
              <TouchableOpacity style={styles.sendBtn} onPress={() => handleSendMsg(groupId, message, user?._id)}>
                <MaterialCommunityIcons name='send' size={35} color={colors.amberGlow} />
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
          <View style={styles.memberBox}>
            <AppText style={{fontSize: 20, fontWeight: 'bold', color: colors.amberGlow, marginBottom: 10}}>Members in {groupName}</AppText>
            {!isCreatedGroup && <AppText style={{fontSize: 15, textAlign: "center", marginBottom: 10}}>Group creator is hidden</AppText>}
              <FlatList
                data={groupMembers}
                keyExtractor={member => member?.id?.toString()}
                renderItem={({ item }) => (
                  <View style={styles.memberList}>
                    <AppText style={{color: colors.white, fontSize: 16}}>{item.username}</AppText>
                    {item.id === user._id && <View>
                      <MaterialCommunityIcons name="account" size={24} color={colors.amberGlow} />
                      <AppText style={{color: colors.white, fontSize: 12}}>You</AppText>
                    </View>}
                    {isCreatedGroup && item.id !== user._id && <TouchableHighlight
                      style={{
                        backgroundColor: colors.punch,
                        padding: 5,
                        borderRadius: 5,
                      }}
                      underlayColor={colors.midnight}
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
                      <MaterialCommunityIcons name="account-remove" size={24} color={colors.amberGlow} />
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
          <View style={styles.memberBox}>
            <AppText style={{fontSize: 18, fontWeight: 'bold', color: colors.white, marginBottom: 10, textAlign: "center"}}>Add members to {groupName}</AppText>
            <View style={{
              marginVertical: 10,
            }}>
              <SearchInput
                placeholder="Search username"
                placeholderTextColor={colors.amberGlow}
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
                    backgroundColor: addedMembers.includes(item.id) ? colors.midnightLight : colors.amberGlow,
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
                      color: colors.white, 
                      fontSize: 16, 
                      fontWeight: "bold"
                    }}>{item?.username}</AppText>
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
          <View style={styles.memberBox}>
            <View style={{
              backgroundColor: colors.horizon,
            }}>
              <AppText style={{fontSize: 18, fontWeight: 'bold', color: colors.white, marginBottom: 10, textAlign: "center"}}>Report Message</AppText>
              <AppText style={{fontSize: 16, color: colors.white, marginBottom: 10, textAlign: "center"}}>Are you sure you want to report this message?</AppText>
              <AppText style={{fontSize: 16, color: colors.white, marginBottom: 10, textAlign: "center"}}>We will review the message to see if it violates our policy.</AppText>
            </View>
            <View style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              gap: 10,
              marginTop: 10,
            }}>
              <TouchableOpacity 
                style={{
                  backgroundColor: colors.punch,
                  padding: 10,
                  borderRadius: 5,
                }}
                onPress={() => {
                  setReportMsgModalVisible(false);
                  setSelectedMsgToReport(null);
                  setSelectedMessageId(null);
                }}
              >
                <AppText style={{color: colors.amberGlow, fontSize: 16}}>Cancel</AppText>
              </TouchableOpacity>
              <TouchableOpacity 
                style={{
                  backgroundColor: colors.amberGlow,
                  padding: 10,
                  borderRadius: 5,
                }}
                onPress={() => {
                  setReportMsgModalVisible(false);
                  setSelectedMsgToReport(null);
                  setSelectedMessageId(null);
                }}
              >
                <AppText style={{color: colors.midnight, fontSize: 16}}>Report</AppText>
              </TouchableOpacity>
            </View>
          </View>
        </CustomModal>
              {/* end of report message modal */}

        {/* end of modals */}
    </Screen>
  );
}

const styles = StyleSheet.create({
  chatControl: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: colors.punch,
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
    backgroundColor: colors.midnight,
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 5,
  },
  header: {
    backgroundColor: colors.horizon,
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
    backgroundColor: colors.midnight,
    borderRadius: 5,
    paddingVertical: 5,
    paddingHorizontal: 10,
  },
  menuItem: {
    padding: 8,
    borderRadius: 5,
  },
  menuItemText: {
    color: colors.amberGlow,
    fontSize: 16,
  },
  moreBtn: {
    backgroundColor: colors.midnight,
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
    backgroundColor: colors.midnight,
    borderRadius: 5,
  },
  memberList: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: colors.horizon,
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
  },
  screen: {
    backgroundColor: colors.midnight,
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
    backgroundColor: colors.horizon,
    borderRadius: 5,
    elevation: 5,
  },
  chatInput: {
    height: "100%",
    width: "80%",
    backgroundColor: colors.midnight,
    color: colors.white,
    fontSize: 16,
    borderRadius: 5,
    paddingHorizontal: 10,
  },
  sendBtn: {
    backgroundColor: colors.midnight,
    padding: 10,
    borderRadius: 5,
    width: "20%",
    alignItems: 'center',
    justifyContent: 'center',
    height: "100%",
  },
});

export default ChatroomScreen;