import {StyleSheet} from 'react-native';
import ScreenRatio from '../../components/constants/ScreenRatio';
import { RFValue } from 'react-native-responsive-fontsize';
import { bold } from '../../components/constants/fonts';

const styles = StyleSheet.create({
  container: {
    height: '100%',
    width: '100%',
    backgroundColor:"white"
  },
  header:{
    width:"100%",
    height:50,
    justifyContent:"space-between",
    paddingHorizontal:"5%",
    flexDirection:"row",
    alignItems:"center"
  },
  headerTitle:{
    fontSize:RFValue(16),
    fontWeight:"600",
    color:"black",
    fontFamily: bold
  }
});
export default styles;
