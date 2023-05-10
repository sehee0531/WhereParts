import { StyleSheet, Dimensions } from 'react-native';
const ScreenHeight = Dimensions.get('window').height;
const ScreenWidth = Dimensions.get('window').width;

export const styles = StyleSheet.create({
  //View
  //주문상품
  orderItem_view:{
    borderWidth: 1,
    borderRadius: 5,
    borderColor: "lightgray",
    paddingHorizontal:10,
    marginTop:10,
  },
  orderItemBody_view:{
    flexDirection: 'row', 
    paddingVertical:'2%',
    borderWidth:0, 
    borderBottomWidth:1, 
    borderColor:'#D9D9D9',
    //marginVertical:'2%'
  },
  productImage: {
    flex: 1,
    borderRadius: 6,
  },
  orderInfo_view:{
    flexDirection: 'column',
    alignItems:'flex-end',
    flex:4,
  },

  orderItemBottom_view:{
    flexDirection: 'row',
    paddingVertical:'2%',
  },
  itemPrive_view:{
    justifyContent:'center',
    flex:1
  },
  itemQuantity_view:{
    width:"auto",
    borderRadius: 6,
    borderColor: '#D4D4D4',
    borderWidth: 1,
    flexDirection: 'row',
   justifyContent:'center'
  },
  
  address_view: {
    alignItems: 'flex-start',
    justifyContent: 'center',
    backgroundColor: "#F1F1F3",
    borderRadius: 10,
    height: 45,
    width: "100%",
    marginBottom: 15,
  },
  //Text


  text: {
    fontFamily: "Cochin",
    fontSize: 15,
    color: "black",

    goodsName_text: {
      fontSize: 16,
      color: 'black',
      borderBottomWidth : 1,
      paddingBottom:3, 
      borderColor:'#D9D9D9'
    },
    price_text:{
      fontSize: 18,
      color:'black',
    },
  
    buyButtonText: {
      fontFamily: 'Pretendard-SemiBold',
      fontSize: 18,
      color: '#FFF',
    },
    number_text: {
      //borderWidth:1,
      width: '60%',
      alignItems: 'flex-start',
      justifyContent: 'center',
      backgroundColor: "#F1F1F3",
      borderRadius: 10,
      height: 45,
      marginBottom: 15,
      marginRight: 15,
  
    },
   
    title: {
      fontFamily: "Cochin",
      fontSize: 18,
      fontWeight:"bold",
      color: "black",
      marginBottom: 15,
    },
    quantityItemText: {
      fontFamily: 'Pretendard-Medium',
      fontSize: 18,
      color: '#000',
    },
    btn_text: {
      fontFamily: "Cochin",
      fontSize: 15,
      color: "white",
    },
  },

 

  //btn
  payment_btn:{
    justifyContent: 'center',
    alignItems: 'center',
    height: 50,
    width: "auto",
    backgroundColor: '#0066FF', 
  },
  address_btn: {
    //borderWidth:1,
    width: '36%',
    height: 45,
    backgroundColor: "black",
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 15,
  },

 
  quantity_btn: {
    width: 36,
    height: 36,
    justifyContent: 'center',
    alignItems: 'center',
  },
  quantityCount: {
    borderColor: '#D4D4D4',
    borderLeftWidth: 1,
    borderRightWidth: 1,
  },

  //pay_complete
  goodsInfoView:{
    height:'30%',
    backgroundColor:'gray'
  },
  payInfoView:{
    flex:2,
  },

  //address
 
  container: {
    flex: 1,
    marginTop: 30,
  },
  rowLayout: {
    flex: 1,
    flexDirection: 'row',
    //borderWidth:1,
  },
  textInput: {
    backgroundColor: '#F1F1F3',
    marginBottom: 15,
    marginRight: 15,
    paddingHorizontal: 10,

    height: 45,
    width: "100%",
    borderRadius: 10,
    borderColor: '#F1F1F3',
    borderWidth: 1,
  },
 
  deliver_view:{
    marginBottom:20,
    paddingBottom:10,
    borderBottomWidth:1,
    borderColor:'lightgray',
  },
})