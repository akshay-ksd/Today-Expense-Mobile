import { StyleSheet } from "react-native";
import { RFValue } from "react-native-responsive-fontsize";
import ScreenRatio from "../../constants/ScreenRatio";
import { bold, medium } from "../../constants/fonts";

const styles = StyleSheet.create({
    container:{
        height:"100%",
        width:"100%",
        backgroundColor:'rgba(58,58,58,0.2)',
       
        alignItems:"center",
        justifyContent:"center",
    },
    box:{
        width:"70%",
        height:ScreenRatio.height/3,
        backgroundColor:"white",
        borderRadius:5,
        alignItems:"center",
        padding:"5%",
        justifyContent:"space-evenly"
    },
    title:{
        fontSize:RFValue(14),
        fontWeight:"600",
        color:"#fff",
        fontFamily:bold
    },
    input:{
        fontSize:RFValue(14),
        fontWeight:"400",
        color:"black",
        width:"90%",
        borderBottomWidth:1,
        borderColor:"#d3d3d3",
        fontFamily:medium
        // marginTop:"5%"
    },
    button:{
        width:"90%",
        height:"20%",
        backgroundColor:"black",
        alignItems:"center",
        justifyContent:"center",
        marginTop:"5%",
        borderRadius:5
    }
});

export default styles