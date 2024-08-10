import React, { useState } from 'react';
import { TouchableOpacity} from 'react-native';

const DoubleTapTouchableOpacity = ({ onDoublePress,onPress, children, ...otherProps }) => {
  const [lastPress, setLastPress] = useState(0);
  const handlePress = () => {
    const time = new Date().getTime();
    const delta = time - lastPress;
    const DOUBLE_PRESS_DELAY = 300;

    if (delta < DOUBLE_PRESS_DELAY) {
      onDoublePress();
    } else {
      onPress();
    }
    
    setLastPress(time);
  };

  return (
    <TouchableOpacity {...otherProps} onPress={handlePress}>
      {children}
    </TouchableOpacity>
  );
};

export default DoubleTapTouchableOpacity;