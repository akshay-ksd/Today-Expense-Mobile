import { View, Text } from 'react-native'
import React, { useState } from 'react'
import styles from './style'
import WebView from 'react-native-webview'
import { ActivityIndicator } from 'react-native-paper'
import Animated, { ZoomIn } from 'react-native-reanimated'

const WebViewScreen = ({ url }: any) => {
    const [loading, setLoading] = useState(true); // Initialize loading state

    return (
        <Animated.View style={styles.container} entering={ZoomIn.duration(500)}>
            {loading && (
                <ActivityIndicator
                    size="large"
                    color="#0000ff"
                    style={styles.loadingIndicator} // Add this to position the indicator
                />
            )}
            <WebView
                source={{ uri: url }}
                style={styles.container}
                onLoadStart={() => setLoading(true)} // Show indicator when loading starts
                onLoadEnd={() => setLoading(false)}
            />
        </Animated.View>
    )
}

export default WebViewScreen