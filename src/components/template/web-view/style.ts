import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
    container:{
        flexGrow:1
    },
    loadingIndicator: {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: [{ translateX: -25 }, { translateY: -25 }],
      },
});

export default styles