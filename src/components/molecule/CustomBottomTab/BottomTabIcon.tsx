import React from 'react';
import {View} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Animated, {useSharedValue, useAnimatedStyle, withTiming, withRepeat} from 'react-native-reanimated';
import usePopup from '../../../service/zustand/usePopup';
import useFilterType from '../../../service/zustand/filterType';

interface Props {
  route: string;
  isFocused: boolean;
}

const BottomTabIcon = ({route, isFocused}: Props) => {
  const pulse = useSharedValue(1);
  const rotate = useSharedValue("0deg")
  const isPopup = usePopup((state:any)=>state.isPopup)
  const filterType = useFilterType((state:any) => state?.filterType)

  if (isFocused && filterType == "Daily" && route === 'Home'&&isPopup == false) {
    pulse.value = withRepeat(withTiming(1.2, {duration: 500}), -1, true);
  } else {
    pulse.value = withTiming(1);
  }

  if(isPopup){
    rotate.value = withTiming("45deg")
  }else{
    rotate.value = withTiming("0deg")
  }

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{scale: pulse.value},{rotate:rotate.value}],
    };
  });

  const renderIcon = (route: string, isFocused: boolean) => {
    switch (route) {
      case 'Home':
        return (
          <Animated.View style={animatedStyle}>
            <Ionicons name={isFocused && filterType == "Daily"? 'add' : 'home-outline'} size={isFocused && filterType == "Daily" ? 30 : 24} color={isFocused && filterType == "Daily" ? '#fff' : '#ffffff'} />
          </Animated.View>
        );
      case 'ChartScreen':
        return (
          <Ionicons name='pie-chart-outline' size={24} color={isFocused ? '#000' : '#ffffff'} />
        );
      case 'Profile':
        return (
          <Ionicons name='person-outline' size={24} color={isFocused ? '#000' : '#ffffff'} />
        );
      default:
        return null;
    }
  };

  return <View>{renderIcon(route, isFocused)}</View>;
};

export default BottomTabIcon;
