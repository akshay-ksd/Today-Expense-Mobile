import { StyleSheet } from "react-native";
import ScreenRatio from "../../../components/constants/ScreenRatio";
import { RFValue } from "react-native-responsive-fontsize";
import { bold, medium, semi_bold } from "../../../components/constants/fonts";

const styles = StyleSheet.create({
    container:{
        width:ScreenRatio.width,
        height:ScreenRatio.height/14,
        alignItems:"center",
        justifyContent:"center"
    },
    box:{
        width:"90%",
        height:"95%",
        flexDirection:"row",
        alignItems:"center",
        justifyContent:"space-between",
        borderBottomWidth:1,
        borderColor:"#f2f2f2"
    },
    details:{ 
        width:"50%",
        height:"100%",
        flexDirection:"row",
        alignItems:"center"
    },
    title:{
        fontSize:RFValue(12),
        fontWeight:"500",
        color:"black",
        fontFamily: semi_bold
    }
});

export default styles