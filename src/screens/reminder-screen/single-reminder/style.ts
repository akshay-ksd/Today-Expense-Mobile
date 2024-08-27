import { StyleSheet } from "react-native";
import ScreenRatio from "../../../components/constants/ScreenRatio";

const styles = StyleSheet.create({
    container:{
        width:ScreenRatio.width,
        height:ScreenRatio.height/10,
        alignItems:"center",
        justifyContent:"center"
    }
});

export default styles