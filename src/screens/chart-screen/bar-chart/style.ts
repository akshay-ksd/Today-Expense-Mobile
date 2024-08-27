import { StyleSheet } from "react-native";
import { RFValue } from "react-native-responsive-fontsize";
import { medium } from "../../../components/constants/fonts";

const styles = StyleSheet.create({
    container:{
        width:"90%",
        // height:"30%",
        alignItems:"center",
        justifyContent:"center",
        backgroundColor:"white",
        marginLeft:"5%",
        borderRadius:10,
        marginTop:"3%",
        borderBottomWidth:1,
        borderColor:"#f2f2f2"
        // shadowColor: "#000",
        // shadowOffset: {
        //     width: 0,
        //     height: 2,
        // },
        // shadowOpacity: 0.25,
        // shadowRadius: 3.84,

        // elevation: 5,
        // overflow:"hidden"
    },
    noData:{
        fontSize:RFValue(12),
        fontWeight:"600",
        color:"black",
        fontFamily:medium
    }
});

export default styles