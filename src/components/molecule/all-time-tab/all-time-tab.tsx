import { View, Text } from 'react-native'
import React, { FC } from 'react'
import styles from './style'
import Animated, { FadeIn, ZoomIn } from 'react-native-reanimated'

const AllTimeTab:FC<any> = ({filterAllTime}) => {
  return (
    <View style={styles.container}>
      <Animated.View style={styles.box} entering={FadeIn}>
            <Text style={styles.title}>Total : ₹ 100</Text>
      </Animated.View>
    </View>
  )
}

export default AllTimeTab