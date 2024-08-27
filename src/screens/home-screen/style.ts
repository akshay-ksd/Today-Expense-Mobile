import { StyleSheet } from "react-native";
import { medium } from "../../components/constants/fonts";

const styles = StyleSheet.create({
    container: {
        height: "100%",
        width: "100%",
        backgroundColor: "white"
    },
    calender: {
        height: "100%",
        width: "100%",
        position: "absolute",
        bottom: 0,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: 'rgba(58,58,58,0.3)'
    },
    center: {
        alignItems: 'center',
        justifyContent: 'center',
        flex: 1,
    },
    emptyText: {
        color: 'gray',
        fontSize: 12,
        fontFamily:medium
    },
    footer: {
        height: 150,
      },
});

export default styles