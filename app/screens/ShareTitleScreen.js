import React, {useState} from 'react';
import { View, StyleSheet, TouchableWithoutFeedback, Keyboard } from 'react-native';

import Screen from '../components/Screen';
import AppText from '../components/AppText';
import AppButton from '../components/AppButton';
import SearchInput from '../components/SearchInput';
import routes from '../navigation/routes';
import chatGroup from '../api/chatGroup';
import useAuth from '../auth/useAuth';
import { useTheme } from '../utils/ThemeContext';

function ShareTitleScreen({navigation, route}) {
    const [title, setTitle] = useState(''); 
    const product = route?.params
    const {user} = useAuth()
    const userId = user?._id
    const { theme } = useTheme();
    
    const handleSubmit = async () => {
      if(title.length === 0) return alert('Please enter a title');
      const response = await chatGroup.createGroup(title, userId)
      if(response.ok) {
          navigation.navigate(routes.SHARE_SCREEN, {title: title, product: product, groupId: response.data._id})
      }
    }
  return (
    <Screen style={[styles.screen, {backgroundColor: theme?.midnight,}]}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={styles.container}>
              <AppText style={{marginVertical: 20}} color={theme?.amberGlow}>Enter chat group name. This will create a group where you can chat with users.</AppText>
              <SearchInput
                autoCapitalize="none"
                autoCorrect={false}
                placeholder="Search products by Keyword"
                placeholderTextColor={theme?.misty}
                onChangeText={text => setTitle(text)}
              />
              <AppButton
                title="Share"
                color={theme?.amberGlowLight}
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
  screen: {
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