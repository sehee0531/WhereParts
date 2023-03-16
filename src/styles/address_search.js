import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  total_container:{
    flex:1,
    backgroundColor:'white',
    
   },
   container:{
       flex:1,
       marginTop:30,
       marginLeft:15,
       marginRight:15,
   },
    textInput:{
       backgroundColor:'#F1F1F3',
       marginBottom: 15,
       paddingHorizontal: 5,
       height: 55,
       borderRadius: 10,
       borderColor:'#F1F1F3',
       //borderWidth: 1,
    },
    rowLayout: {
        flex: 1,
        flexDirection: 'row',
        alignContent:'center',
        justifyContent:'center'
      },
    flex1:{
      flex:1,
      marginBottom:5,
      //borderWidth:1,
    },
    viewHeader:{
      flex: 1,
      
    },
    viewBody:{
      //borderWidth:1,
      flex: 8,
      marginTop:25,
    },
    viewBottom:{
      flex:1,
      paddingTop:15,
      //borderWidth:1,
    },
    inputStyle:{
      borderColor:'#BDBDBD',
      borderWidth:1,
      borderRadius: 5,
      height: 50,
      paddingHorizontal:'2%'      
    },
    input:{
      width:'90%',
    
      
    },
    search:{
      alignContent:'center',
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
      borderWidth:1,
      height: 105,
      paddingHorizontal:'2%'
    },
    titleLayout:{
      flex:2.5,
      //borderWidth:1,
      flexDirection:'column'
    },
    addressLayout:{
      flex:10,
      paddingLeft:10,
    },
    numberLayout:{
      flex:3,
      paddingLeft:10,
     
      justifyContent:'center'
    },
   
});