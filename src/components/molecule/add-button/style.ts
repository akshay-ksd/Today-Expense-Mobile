import { StyleSheet } from "react-native";
import colors from "../../constants/colors";

const styles = StyleSheet.create({
    container:{
        width:"100%",
        height: 100,
        position:"absolute",
        bottom:0,
        alignItems:"flex-end",
        paddingHorizontal:"10%"
    },
    add:{
        width:50,
        height:50,
        borderRadius:50,
        backgroundColor:colors.black,
        alignItems:"center",
        justifyContent:"center",
    }
});

export default styles