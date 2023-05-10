//Home Style
import { Dimensions, StyleSheet } from 'react-native';
const ScreenHeight = Dimensions.get('window').height;
const ScreenWidth = Dimensions.get('window').width;
export const styles = StyleSheet.create({ //export를 해주어야 다른 곳에서 사용할 수 있음

  //Home
  home_total_view: {
    flex: 1,
    backgroundColor: '#FFFF',
    paddingHorizontal: '2%'
  },
  home_title_view: {
    width: ScreenWidth,
    height: 200,
    paddingTop: '6%',
    backgroundColor: '#0066FF',
    position: 'absolute',
  },
  home_searchbar_view: { //home TextInput
    flexDirection: 'column',
    width: ScreenWidth,
    position: 'absolute',
    alignItems: 'center',
    backgroundColor: "#0066FF",
  },

  //타이틀
  title_total_view: {
    marginTop: "5%",
  },
  main_title_view: {
    width: '100%',
    paddingLeft: '5%',
    marginBottom: '3%',
  },
  sub_title_view:{
    paddingLeft:'5%'
  },
  carIcon_view: {
    width: 50,
    height: 50,
    backgroundColor: '#D6DFF5',
    borderRadius: 40
  },

  main_title_text: {
    fontWeight: '600',
    color: 'white',
    fontSize:25,
  },
  sub_title_text: {
    color: 'white',
    fontSize: 15,
  },
  description_text: {
    fontFamily: 'Pretendard-Regular',
    fontSize: 10,
    color: '#FFF',
    lineHeight: 21,
  },

  //검색창
  search_section_view:{
    flexDirection: 'row',
    marginTop: '6%',
    marginBottom: '3%' 
  },
  searchbar_view: {
    borderWidth: 1,
    borderColor: '#E3E6ED',
    borderRadius: 10,
    width: '75%',
    height: 45,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },

  search_input_text: { //Home TextInput 안에 글씨
    flex: 1,
    backgroundColor: 'white',
    paddingLeft: 5,
    borderRadius: 10,
    fontSize: 14,
  },
  camera_search_button: {
    marginLeft: 10,
    width: 50,
    height: 45,
    backgroundColor: '#D6DFF5',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
  },

  //sort 정렬바
  sort_section_view:{
    flexDirection: 'row', 
    backgroundColor: 'white', 
    marginTop:'2%',
  },
  goods_total_quantity_view:{
    flex: 1,
    marginLeft: '5%',
    flexDirection: 'row',
    alignItems: 'center'
  },
  sort_dropdown_view:{
    flex: 1,
    flexDirection: 'row',
    height:40,
    justifyContent: 'flex-end',
    alignItems:'center',
    dropdown_width:{
      width:150
    },
  },
//////////////////////////////////////////////////////////////////////////////////////
  //list
  listItem_view: { //공통부분
    width: ScreenWidth / 2.2,
    borderWidth: 1.5,
    borderRadius: 10,
    borderColor: '#D9D9D9',
    padding: '3%',
    marginBottom: '5%',
    marginLeft: '3%',
  },
  productTop_view: {
    //borderWidth:1,
    flexDirection: 'row',
    borderColor: '#D9D9D9',
    //paddingBottom: 8,
    //paddingTop: 10,
  },
  productImage_view: {
    width: ScreenWidth / 6.5,
    height: ScreenWidth / 6.5,
    product_image: {
      flex: 1,
      borderRadius: 10,
    }
  },

  productInfoLeft_view: {
    width: '100%',
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderColor:'#D9D9D9',
    paddingBottom:3,
  },
  productInfoRight_view: {
    flex: 1,
    height: ScreenWidth / 6.5,
    alignItems: 'flex-end',
    justifyContent: 'flex-end',
    paddingVertical: 3,
  },
  itemDetail_text: {
    fontSize: 12,
    fontFamily: '200',
    color: '#0066FF',
    textAlign: 'right',
  },
  itemName_text: {
    fontSize: 14,
    fontFamily: 'Pretendard-Medium',
    color: '#000000',
  },
  itemPrice_text: {
    fontSize: 14,
    fontFamily: 'Pretendard-Medium',
    color: '#000000',
  }
});