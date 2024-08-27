import { StyleSheet } from "react-native";
import { RFValue } from "react-native-responsive-fontsize";
import { semi_bold } from "../../../components/constants/fonts";

const styles = StyleSheet.create({
    container:{
        width:"100%",
        alignItems:"center",
        justifyContent:"center",
        paddingHorizontal:"7%",
        backgroundColor:"white",
        zIndex:0,
        marginVertical:"2%",
        // transform:[{rotate:"-180deg"}]
    },
    title:{
        fontSize:RFValue(10),
        fontWeight:"600",
        color:"black",
        marginLeft:"10%",
        fontFamily:semi_bold
    },
    iconContainer:{
        height:"100%",
        flexDirection:"row",
        alignItems:"center"
    },
    box:{
        width:"100%",
        height:40,
        flexDirection:"row",
        alignItems:"center",
        justifyContent:"space-between",
        paddingHorizontal:"7%",
        paddingRight:"10%",
        backgroundColor:"white",
        // elevation:1,
        borderRadius:10,
        borderBottomWidth:1,
        borderColor:"#f2f2f2",
        // transform:[{rotate:"180deg"}]
    }
});

export default styles