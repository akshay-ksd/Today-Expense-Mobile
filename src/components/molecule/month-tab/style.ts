import { StyleSheet } from "react-native";
import { bold } from "../../constants/fonts";

const styles = StyleSheet.create({
    container:{
        width:"100%",
        height:60,
        alignItems:"center",
        justifyContent:"center",
        marginTop:"3%"
    },
    box:{
        width:"95%",
        height:"90%",
        borderRadius:10,
        backgroundColor:"#f2f2f2",
        padding:"5%",
        // elevation:3,
        flexDirection:"row",
        alignItems:"center",
        justifyContent:"space-between"
    },
    date:{
        width:35,
        height:35,
        borderRadius:5,
        backgroundColor:"black",
        alignItems:"center",
        justifyContent:"center",
        borderWidth:2,
        borderColor:"white"
    },
    dateText:{
        fontSize:14,
        fontWeight:"600",
        color:"white",
        fontFamily:bold
    },
    labelContainer:{
        width:"40%",
        height:"100%",
        flexDirection:"row",
        alignItems:"center",
    },
    totalContainer:{
        width:"25%",
        alignItems:"flex-end"
    }
});

export default styles