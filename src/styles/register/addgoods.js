import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
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
    height: 400,
    width: 300,
    margin: 20,
    backgroundColor: 'lightgrey',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
  },

  //text
  btn_text: {
    fontFamily: "Cochin",
    fontSize: 16,
    color: "white",
    alignItems:'center'
  },
  camera_text: {
    fontFamily: "Cochin",
    fontSize: 13,
    color: "gray",
    marginBottom: 15
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
    marginBottom: 15,
    marginTop: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },

  //textInput 모으기
  product_textInput: {
    backgroundColor: 'white',
    marginBottom: 15,
    paddingHorizontal: 20,
    paddingVertical: 10,
    height: 70,
    borderRadius: 10,
    borderColor: '#D1D1D1',
    borderWidth: 2,
  },
  sales_quantity_textInput: { // 판매개수
    flex: 2,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: "white",
    borderColor: '#D1D1D1',
    borderWidth: 2,
    borderRadius: 10,
    height: 55,
  },
  status_textInput: {
    backgroundColor: 'white',
    marginBottom: 20,
    marginTop: 10,
    paddingHorizontal: 20,
    paddingVertical: 10,
    height: 75,
    borderRadius: 10,
    borderColor: '#D1D1D1',
    borderWidth: 2,
  },
  textDetailInput: {
    backgroundColor: 'white',
    marginBottom: 50,
    marginTop: 10,
    paddingHorizontal: 20,
    paddingVertical: 10,
    height: 140,
    borderRadius: 10,
    borderColor: '#D1D1D1',
    borderWidth: 2,
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
    width: 50,
    height: 50,
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