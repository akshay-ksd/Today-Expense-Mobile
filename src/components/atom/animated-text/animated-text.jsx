import { View, Text } from 'react-native'
import React from 'react'
import Animated, { FadeInLeft, ZoomInLeft } from 'react-native-reanimated'

const AnimatedText = ({ text, style }) => {
    return (
        <>
            {text.split('').map((letter, index) => (
                <Animated.Text style={style} key={index} entering={FadeInLeft.duration(1500).delay(index * 50)}>{letter}</Animated.Text>
            ))}
        </>
    )
}

export default AnimatedText