import { StyleSheet } from "react-native";
import { RFValue } from "react-native-responsive-fontsize";
import colors from "../../../components/constants/colors";
import { semi_bold } from "../../../components/constants/fonts";

const styles = StyleSheet.create({
    container: {
        width: "100%",
        height: "13%",
        // backgroundColor: "#f2f2f2",
        borderBottomLeftRadius: 30,
        borderBottomRightRadius: 30,
        paddingHorizontal: "5%",
    },
    title: {
        fontSize: RFValue(18),
        fontWeight: "500",
        color: "black",
        fontFamily:semi_bold
    },
    tab: {
        width: "100%",
        // height: "50%",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingHorizontal:"2%",
    },
    box: {
        padding: 10,
        alignItems: "center",
        justifyContent: "center",
        borderRadius: 10,
        backgroundColor: colors.black,
        paddingHorizontal: 15,
        // shadowColor: "#000",
        // shadowOffset: {
        //     width: 0,
        //     height: 2,
        // },
        // shadowOpacity: 0.25,
        // shadowRadius: 3.84,

        // elevation: 5,
    },
    labelText: {
        fontSize: RFValue(12),
        color: "white",
        fontWeight: "500"
    }
});

export default styles