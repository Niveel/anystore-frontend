import React, {useState} from 'react';
import { View, StyleSheet, TouchableWithoutFeedback, Keyboard } from 'react-native';

import SearchInput from './SearchInput';
import CustomHeader from './CustomHeader';
import CodeSearch from './CodeSearch';
import { useTheme } from '../utils/ThemeContext';

const HomeHeader = ({setSearchText, handleSearch, handleSearchByImage, handleFavorite, handleCart, handleNotification, showIcons, title}) => {
  const [headerHeight, setHeaderHeight] = useState(0);
    const { theme } = useTheme();

    const handleHeaderLayout = (event) => {
      const { height } = event.nativeEvent.layout;
      setHeaderHeight(height); 
    };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View 
        style={[styles.container, {backgroundColor: theme?.midnight}]}
        onLayout={handleHeaderLayout}
      >
          <CustomHeader 
              showIcons={showIcons}
              title={title}
              handleFavorite={handleFavorite}
              handleCart={handleCart}
              handleNotification={handleNotification}
          />
          <SearchInput
              autoCapitalize="none"
              autoCorrect={false}
              placeholder="Search Products by Keyword"
              placeholderTextColor={theme?.misty}
              onChangeText={text => setSearchText(text)}
              searchPress={handleSearch}
              keyboardType="default"
              onSubmitEditing={handleSearch}
              iconColor={theme?.misty}
              cameraSearchPress={handleSearchByImage}
          />
          <CodeSearch />
      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 10,
    paddingBottom: 10,
    
  }
});

export default HomeHeader;