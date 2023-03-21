//Home Style
import { Dimensions, StyleSheet } from 'react-native';
export const styles = StyleSheet.create({ //export를 해주어야 다른 곳에서 사용할 수 있음

  //Home
  //타이틀 
  homeTop_view: { //홈의 위의 디자인 담당
    width: "100%",
    height: 200,
    backgroundColor: '#113AE2',
    position: 'absolute',
  },
  title_view: { 
    marginTop:"8%",
    padding:20,
  },
    
  row_view: {
    flexDirection: 'row',
  },
  title_text: {
    fontSize: 25,
    lineHeight: 30,
  },
  titleRegular_text: {
    fontFamily: 'Pretendard-Regular',
    color: '#E9E9E9',
  },
  titleBold_text: {
    fontFamily: 'Pretendard-SemiBold',
    color: '#FFF',
  },
  description_text: {
    fontFamily: 'Pretendard-Regular',
    fontSize: 10,
    color: '#FFF',
    lineHeight: 21,
  },

  //검색창
  searchBar_view: { //home TextInput
    flexDirection: 'column',
    width: "100%",
    position: 'absolute',
    alignItems: 'center',
    backgroundColor: "#113AE2",
  
  },
  searchSection:{
    marginTop:'1%',
    borderRadius:10,
    width:'75%',
    height:'80%',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',

  },
  search_input: { //Home TextInput 안에 글씨
    flex:1,
    backgroundColor: 'white',
    paddingLeft:0,
    borderRadius:10,
    fontSize: 14,
  },
  cameraSearch_button: { //공통사용

    marginLeft: 10,
    width: 54,
    height: 54,
    backgroundColor: '#0066FF',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
  },

  //sort 정렬바
  sortBar_view: { // 가로정렬
    backgroundColor: 'white',
    width:"100%",
    paddingVertical:"1%",
    paddingRight:"4%",
    
    flexDirection:'row',
    paddingTop:5
  },
  
  sortBar_text: { //최신순/오래된순 글씨
    fontWeight: 'bold',
    textAlign: 'right',
    color: '#6495ED',
    fontSize: 13,
  },
  

  //list
  listItem_view: { //공통부분
    flexDirection: 'row',
    alignItems: 'center',
    //borderWidth:1,
    backgroundColor:'white',
    paddingHorizontal:10,
    paddingVertical:5,
    marginHorizontal:10,
    marginVertical:5,
    borderColor:"#D1D1D1",
    borderRadius:10,
  },
  productImage_view: {
    borderColor: '#E9E9E9',
    borderStyle: 'solid',
    overflow: 'hidden',
  },
  product_image: {
    flex:1,
    margin:5,
    width: 80,
    height: 80,
    borderRadius: 6,
  },
  productInfo_view: {
    flex:3,
    height:70,
    flexDirection:'row',
    marginLeft:10,
    marginTop:5,
    marginBottom:5,
    marginRight:15,
  },
  productInfoLeft_view:{
    flex:4,
    height:70,
  },
  productInfoRight_view:{
    flex:2,
    alignItems:'flex-end',
  },
  itemDetail_text:{
    fontsize:15,
    fontFamily:'Pretendard-SemiBold'
  },
  itemName_text: {
    fontSize: 20,
    fontWeight: 'bold',
    fontFamily: 'Pretendard-Medium',
    color: '#000000',
  },
});