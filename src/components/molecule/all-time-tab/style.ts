import { StyleSheet } from "react-native";
import { RFValue } from "react-native-responsive-fontsize";

const styles = StyleSheet.create({
    container:{
        width:"100%",
        height:60,
        alignItems:"center",
        justifyContent:"center",
        marginTop:"5%"
    },
    box:{
        width:"95%",
        height:"90%",
        borderRadius:10,
        backgroundColor:"#f2f2f2",
        justifyContent:"center",
        padding:"5%"
    },
    title:{
        fontSize:RFValue(14),
        fontWeight:"600",
        color:"black"
    }
});

export default styles