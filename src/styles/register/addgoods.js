import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  addgoods_total_view:{
    flex: 1,
    backgroundColor: '#FFFF',
    paddingHorizontal: '4%',
},
/* addgoods_content_view:{
    borderWidth: 1, 
    borderRadius: 15, 
    borderColor:'#D1D1D1',
    paddingHorizontal: '2%', 
    paddingVertical:'2%',
    marginBottom: '2%',
}, */
addgoods_textInput_style:{
    fontSize:15,
    height:30,
    padding:0
},
addgoods_quantity_btn:{
    width:35,
    height:35, 
    backgroundColor: 'white', 
    borderWidth: 0.7, 
    borderColor: '#D1D1D1' 
},
  //View
  row_view: {
    flex: 1,
    flexDirection: 'row',
  },
  background_view: {
    flex: 1,
    backgroundColor: 'black',
  },
  center_view: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modal_view: {
    flex: 1,
    width: 390,
    height: 580,
    margin: 5,
  },
  image_modal_view: {
    flex: 1,
    width: 360,
    height: 500,
    justifyContent: 'flex-start',
    alignItems: 'flex-end',
  },
  image_view: {
    width: 60,
    height: 60,
    marginRight: 10,
    justifyContent: 'flex-start',
    alignItems: 'flex-end',
    borderRadius: 10,
    marginTop: 10,
  },
  imageDelete_view: {
    top: -2,
    right: -1,
    position: 'absolute',
  },
  camera_modal_view: {
    width: 170,
    height: 45,
    borderWidth: 1,
    borderRadius: 10,
    backgroundColor: 'white',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  hashtag_view: {
    flexWrap: 'wrap',
    flexDirection: 'row',
    marginBottom: 10,
  },
  hashtag_add_view: { //해시태그 스타일
    alignSelf: 'flex-start',
    flexDirection: 'row',
    height: 35,
    paddingLeft: 10,
    paddingRight: 10,
    marginRight: 10,
    marginBottom: 10,
    backgroundColor: "#E9E9F1",
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 30,
  },
  modal_search_view: {
    height: 380,
    width: 300,
    margin: 20,
    backgroundColor: 'white',
    borderColor:'#D1D1D1',
    borderWidth:1,
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
  },
  modal_button:{
    borderWidth:1,
    borderColor:'#D1D1D1',
    borderRadius:10,
    width:'30%',
    height:40,
    marginHorizontal:'3%',
    marginVertical:'2%',
    alignItems:'center',
    justifyContent:'center',
  },
  //text
  btn_text: {
    fontFamily: "Cochin",
    fontSize: 16,
    color: "white",
    alignItems:'center',
  },
  modal_text:{
    fontFamily: "Cochin",
    fontSize: 16,
    color:'#949CA1',
    alignItems:'center',
    marginBottom:'3%'
  },
  camera_text: {
    fontFamily: "Cochin",
    fontSize: 13,
    color: "gray",
    marginBottom: 5
  },
  errormessage_text: {
    fontSize: 13,
    color: "#FD9C91",
    marginTop: -15,
  },
  productinf_text: {
    fontFamily: "Cochin",
    fontSize: 17,
    color: "black",
    marginBottom: 10,
    marginTop: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },

  //textInput 모으기
 /*  product_textInput: {
    backgroundColor: 'white',
    marginBottom: 15,
    paddingHorizontal: 10,
    height: 55,
    borderRadius: 10,
    borderColor: '#D1D1D1',
    borderWidth: 1,
  }, */
  sales_quantity_textInput: { // 판매개수
    backgroundColor: "white",
    width:'13%',
    alignItems: 'center',
    justifyContent: 'center',
    borderColor: '#D1D1D1',
    borderWidth: 0.7,
    borderRadius: 10,
    height: 35,
  },
  status_textInput: {
    backgroundColor: 'white',
    marginBottom: 20,
    marginTop: 10,
    paddingHorizontal: 10,
    //paddingVertical: 10,
    height: 60,
    borderRadius: 10,
    borderColor: '#D1D1D1',
    borderWidth: 1,
  },
  textDetailInput: {
    backgroundColor: 'white',
    marginBottom: 15,
    paddingHorizontal: 10,
    height: 100,
    borderRadius: 10,
    borderColor: '#D1D1D1',
    borderWidth: 1,
  },

  //버튼 모으기
  camera_btn: {
    width: 60,
    height: 60,
    backgroundColor: "#F1F1F3",
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
    marginRight: 10,
    marginTop: 10,
  },
  add_btn: {
    width: 40,
    height: 40,
    backgroundColor: "black",
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
  },
  activate_btn: {
    height: 50,
    backgroundColor: "#1E90FF",
    alignItems: 'center',
    justifyContent: 'center'
  },
});