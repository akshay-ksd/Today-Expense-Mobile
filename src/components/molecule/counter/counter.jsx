import React, { useRef, useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, Animated } from 'react-native';

const RollingCounter = ({ endValue }) => {
  const [data, setData] = useState([]);
  const flatListRef = useRef(null);
  const scrollY = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const numbers = Array.from({ length: endValue + 1 }, (_, i) => i);
    setData(numbers);
    animateScroll(numbers.length - 1);
  }, [endValue]);

  const animateScroll = (index) => {
    Animated.timing(scrollY, {
      toValue: index * 60, // Assuming item height is 60
      duration: 1000,
      useNativeDriver: true,
    }).start();
  };

  const renderItem = ({ item }) => (
    <View style={styles.item}>
      <Text style={styles.text}>{item}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Animated.FlatList
        ref={flatListRef}
        data={data}
        renderItem={renderItem}
        keyExtractor={(item) => item.toString()}
        style={styles.list}
        scrollEnabled={true} // Disable user scrolling
        // onLayout={() => {
        //   flatListRef.current.scrollToOffset({
        //     offset: scrollY,
        //     animated: false,
        //   });
        // }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 30, // Height of the visible part of the counter
    overflow: 'hidden',
  },
  list: {
    flexGrow: 1,
  },
  item: {
    height: 30, // Height of each item
    justifyContent: 'center',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  text: {
    fontSize: 10,
    fontWeight: 'bold',
    color: 'black',
  },
});

export default RollingCounter;
