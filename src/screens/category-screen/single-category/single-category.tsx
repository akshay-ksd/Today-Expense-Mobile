import { View, Text } from 'react-native'
import React, { FC, useEffect } from 'react'
import styles from './style'
import Icons from "react-native-vector-icons/Ionicons"
import Ripple from "react-native-material-ripple"
import { bold } from '../../../components/constants/fonts'
import Animated, { FadeInLeft, FadeInUp, FlipInEasyY, SlideInLeft, SlideInRight, SlideInUp, useAnimatedStyle, useSharedValue, withTiming, ZoomIn, ZoomInDown, ZoomInEasyDown, ZoomInEasyUp, } from 'react-native-reanimated'

const SingleList: FC<any> = ({ item, selectLit, index }) => {
    const AnimatedRipple = Animated.createAnimatedComponent(Ripple);

    const colorValue = useSharedValue("#fff");

    const animatedStyle = useAnimatedStyle(() => {
        return {
            backgroundColor: colorValue.value
        };
    });

    // useEffect(() => {
    //     setTimeout(() => {
    //         colorValue.value = withTiming("white", { duration: 1000 })
    //     }, 500);
    // }, [])

   

    const Footer:any = {
        0: <View style={{ height: 100 }} />
    }
    return (
        <Animated.View style={[styles.container]}>
            {/* {
                Footer[index]
            } */}
            <AnimatedRipple style={[styles.box, animatedStyle]} onPress={() => selectLit(item)} disabled={item?.date ? false : true}>
                <View style={styles.iconContainer}>
                    <Animated.View >
                        <Icons name={"radio-button-on"} size={8} color={"black"} />
                    </Animated.View>
                    <Text style={styles.title}>{item?.description}</Text>
                </View>
                <Text style={[styles.title, { color: "black", marginLeft: 0, fontWeight: "700", fontFamily: bold }]}>₹ {parseInt(item?.expense).toFixed(2)}</Text>
            </AnimatedRipple>
            
        </Animated.View>

    )
}

export default SingleList