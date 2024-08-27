import { StyleSheet } from "react-native";
import { RFValue } from "react-native-responsive-fontsize";
import { bold } from "../../constants/fonts";

const styles = StyleSheet.create({
    container:{
        width:"100%",
        height:50,
        flexDirection:"row",
        paddingHorizontal:"5%",
        alignItems:"center",
    },
    title:{
        fontSize:RFValue(16),
        fontWeight:"500",
        color:"black",
        fontFamily:bold
    }
});

export default styles