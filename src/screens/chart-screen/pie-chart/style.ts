import { StyleSheet } from "react-native";
import { RFValue } from "react-native-responsive-fontsize";
import ScreenRatio from "../../../components/constants/ScreenRatio";
import { bold, medium } from "../../../components/constants/fonts";

const styles = StyleSheet.create({
    container:{
        width:"90%",
        alignItems:"center",
        justifyContent:"center",
        padding:5,
        paddingRight:20,
        backgroundColor:"white",
        marginLeft:"5%",
        borderRadius:10,
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
    },
    noData:{
        fontSize:RFValue(12),
        fontWeight:"600",
        color:"black",
        fontFamily: medium
    },
    scrollView: {
        marginTop: 10,
        width: ScreenRatio.width /2.5,
        height:ScreenRatio.height/4.3,
        // backgroundColor:"red",
        position:"absolute",
        left:ScreenRatio.width /1.7
      },
      legendItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 5,
      },
      colorBox: {
        width: 20,
        height: 20,
        marginRight: 10,
        borderRadius:20
      },
      legendText: {
        fontSize: 12,
        color: '#7F7F7F',
        fontFamily:medium
      },
     
});

export default styles