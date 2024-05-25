import React, {useState} from 'react';
import { View, StyleSheet, TextInput, TouchableWithoutFeedback, Keyboard } from 'react-native';

import Screen from '../components/Screen';
import colors from '../config/colors';
import AppText from '../components/AppText';
import AppInput from '../components/AppInput';
import AppButton from '../components/AppButton';
import SearchInput from '../components/SearchInput';
import routes from '../navigation/routes';
import chatGroup from '../api/chatGroup';
import useAuth from '../auth/useAuth';

function ShareTitleScreen({navigation, route}) {
    const [title, setTitle] = useState(''); 
    const product = route?.params
    const {user} = useAuth()
    const userId = user?._id
    
    const handleSubmit = async () => {
      if(title.length === 0) return alert('Please enter a title');
      const response = await chatGroup.createGroup(title, userId)
      if(response.ok) {
          navigation.navigate(routes.SHARE_SCREEN, {title: title, product: product, groupId: response.data._id})
      }
    }
  return (
    <Screen style={styles.screen}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={styles.container}>
              <AppText style={{color: colors.amberGlow, marginVertical: 20}}>Enter chat group name. This will create a group where you can chat with users.</AppText>
              <SearchInput
                autoCapitalize="none"
                autoCorrect={false}
                placeholder="Search products by Keyword"
                placeholderTextColor={colors.misty}
                onChangeText={text => setTitle(text)}
              />
              <AppButton
                title="Share"
                color={colors.amberGlowLight}
                onPress={handleSubmit}
                style={{marginTop: 20, alignSelf: "center"}}
                width='50%'
              />
          </View>
      </TouchableWithoutFeedback>
    </Screen>
  );
}

const styles = StyleSheet.create({
  input: {
    width: '100%',
    height: 50,
    backgroundColor: colors.amberGlow,
    borderRadius: 5,
    paddingHorizontal: 15,
    color: colors.midnight,
    fontSize: 16,
    fontWeight: 'bold',
    textTransform: 'uppercase',
    marginBottom: 20,
  },
  screen: {
    backgroundColor: colors.midnight,
    padding: 10,
    paddingTop: 0,
  },
  container: {
    padding: 10,
    width: '100%',
    height: '100%',
  },
});

export default ShareTitleScreen;