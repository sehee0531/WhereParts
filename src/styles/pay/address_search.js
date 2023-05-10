import { StyleSheet,Dimensions } from 'react-native';
const ScreenHeight=Dimensions.get('window').height;
const ScreenWidth=Dimensions.get('window').width;
export const styles = StyleSheet.create({
  total_container:{
    width:ScreenWidth,
    height:ScreenHeight,
    backgroundColor:'white',
    //borderWidth:1,
   },
   search_view:{
    position:'absolute',
    width:'100%',
    paddingHorizontal:'4%',
    paddingTop:'5%'
    //borderWidth:1,
   },
   content_view:{
    position:'absolute',
    width:'100%',
    height:ScreenHeight*0.65,
    top:ScreenHeight*0.12,
    //borderWidth:1,
    paddingHorizontal:'5%',
   
   },
   page_view:{
    position:'absolute',
    width:'100%',
    top:ScreenHeight*0.83
    //borderWidth:1,
   },
   input:{
    width:'90%'
   },
   search_input:{
    borderColor:'#BDBDBD',  
    borderWidth:1,
    borderRadius: 5,
    height: 45,
    paddingHorizontal:'2%',
  },
  row_layout: {
    flexDirection: 'row',
    alignContent:'center',
    justifyContent:'center'
  },
  search_btn:{
    //borderWidth:1,
    //alignContent:'center',
    justifyContent:'center'
  },

  title: {
    fontFamily: "bold",
    fontSize: 20,
    color: "black",
    marginBottom: 15,
  },

  text:{
    fontWeight: 'Cochin',
    fontSize: 16,
    marginBottom:4,
    color: "black",
  },
  text2:{
    fontWeight: 'Cochin',
    fontSize: 18,
    marginBottom:4,
    color: "black",
    marginBottom:20,
  },
  content:{
    marginTop:5,
    fontWeight: 'Cochin',
    fontSize: 15,
    color: "#747272",
  },
  content2:{
    marginTop:5,
    fontWeight: 'Cochin',
    fontSize: 15,
    color: "#9595E9",
  },

  outputStyle:{
    borderColor:'#909098',
    borderTopWidth:1,
    borderLeftWidth:1,
    borderBottomWidth:1,
    borderRightWidth:1,
    //height: 107,
    paddingHorizontal:'2%',
    paddingVertical:'2%',
    flexDirection:'row'
  },
  address_view:{
    flex:5,
    //borderWidth:1,
  },
  zipNo_view:{
    flex:1,
    borderLeftWidth:0.8,
    borderColor:'#909098',
    alignItems:'center',
    justifyContent:'center'
  },
  roadAddr_view:{
    flexDirection:'row',
  
  }
});