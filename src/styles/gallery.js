import {StyleSheet, Dimensions} from 'react-native';

const ScreenHeight=Dimensions.get('window').height;
const ScreenWidth=Dimensions.get('window').width;
export const styles = StyleSheet.create({
 

viewHeaderLayout:{
    flex:1,
    flexDirection:'row',
    marginLeft:30,
    marginRight:20,
    marginTop:20
},
viewBodyLayout:{
    flex:10,
    marginRight:"0.5%"
},
viewBottomLayout:{
    flex:1,
},

textLayout:{
    flex:1
},
btnLayout:{
    flex:1,
    alignItems:'flex-end',
    justifyContent:'flex-start',
},

btn_put:{
    width:ScreenWidth/5,
    height:ScreenWidth/9, 
    backgroundColor:"#F1F1F3",
    
    alignItems:'center',
    justifyContent:'center',
    borderRadius: 10,
  },
  image:{
    width:(ScreenWidth/3)-3,
    height:(ScreenWidth/3)-3,
    alignSelf:'center',
    marginHorizontal:"0.3%",
    marginVertical:"0.5%"

  },
  text:{
    fontFamily:"Cochin",
    fontSize:15,
    color:"black",
    
  },
  overlay:{
    position:"absolute",
    justifyContent: 'flex-start',
    alignItems: 'flex-end',
    paddingTop:5,
    paddingRight:5,
    width:"100%",
    height :"100%",
    backgroundColor : "rgba(0,0,0,0.6)",
    top:0,
  },
 
 
}
)