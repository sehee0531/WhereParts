import { Dimensions, StyleSheet } from 'react-native';
export const styles = StyleSheet.create({ //export를 해주어야 다른 곳에서 사용할 수 있음
 
  text:{ //공통
    fontFamily: 'Pretendard-SemiBold',
    fontSize: 15,
    color:'black'
  },
  /* 상품 상세보기 */
  itemDetail_view: {
    width: "100%",
    height: "100%",
    backgroundColor: 'white',
    shadowColor: '#000',
    borderRadius:6,
  },
  //tabBar
  tabBar_view:{
    height:'9%',
    flexDirection:'row',
    alignItems:'center',
    borderBottomColor: '#E6E6E6',
    borderBottomWidth:1, //
    justifyContent: 'flex-end',
    paddingVertical:3,
    marginHorizontal:'5%',
    backgroundColor:'white'
  },
  tabBar_button:{
    width:"20%",
    height:"70%",
    borderRadius:5,
    alignItems:'center',
    justifyContent:'center',
    marginRight:10,
    backgroundColor:'white',
  },
  //상품 상세보기
  itemInfo_view: { 
    flex: 1,
    backgroundColor: 'white',
  },
   //이미지 

   goodsImage_view:{
      justifyContent: 'center',
      alignItems: 'center',
      paddingHorizontal:"5%",
    },
    slideImage_view: { 
      borderRadius:10,
      height: 320,
      width: 280,
      marginVertical:"3%",
    },
    goods_image: {
      width: 280,
      height: 280,
      borderRadius:10,
    },
    goods_modal_image:{
      width: "95%",
      height: 360,
      borderRadius:10,
    },
    goods_modal_view:{
      borderRadius:10,
      height: "100%",
      width: "100%",
      //borderWidth:1,
      marginVertical:"3%",
    },
    //상품 설명 부분
    productInfo_view: { 
        borderTopWidth:1,
        marginHorizontal:'5%',
        paddingBottom:30,
        padding: 20,
        borderColor: '#E6E6E6',
        borderBottomWidth:1,
    },
    //인증업체
    certificationMark_view: { 
        width: 64,
        backgroundColor: '#E8EEF0',
        borderRadius: 4,
        marginBottom: 15,
    },
    certificationMark_text: {
        fontFamily: 'Pretendard-SemiBold',
        fontSize: 12,
        color: '#000',
        textAlign: 'center',
    },
    //부품 이름, 번호
    goodsName_view: {
        flexDirection:'row',
        alignItems: 'center',
    }, 
    //가격
    detailPrice_view: {
        marginTop: 3,
        flexDirection: 'row',
        alignItems: 'flex-end',
    },
    detailUnit_text: {
        fontFamily: 'Pretendard-Regular',
        fontSize: 15,
        color: '#000',
        lineHeight: 28,
    },
    remaining_view: {
        marginLeft: 'auto',
        marginBottom: 5,
        flexDirection: 'row',
        alignItems:'center',
    },
    selectQuantity_view: {
        borderRadius: 6,
        borderColor: '#D4D4D4',
        borderWidth: 1,
        flexDirection: 'row',
        alignItems: 'center',
    },
    quantity_button: {
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

    // 상품 정보///////////////////////////////////////////////////////
    toggleDetail_view: {
        paddingVertical:15,
        paddingHorizontal:35,
    },
    toggleDetailTitle_view: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 15,
      
    },
    toggleDetailItem: {
      marginVertical: 7,
      flexDirection: 'row',
      flexWrap:'wrap',
    },
    toggleDetailItemTItle: {
      width: 85,
    },
    toggleDetailItemTItleText: {
      fontFamily: 'Pretendard-Regular',
      fontSize: 14,
      color: '#949CA1',
      lineHeight: 20,
    },
    toggleDetailTextArea: {
    marginTop: 15,
    marginBottom: 50,
    },
    detailHashTags_view: {  
    marginTop: 15,
    flexDirection: 'row',
    flexWrap: 'wrap',
    //borderWidth:1,
  },
  tabBarBottom_view:{
    flexDirection:'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderColor:'#E4E4E4',
    borderWidth:1,
    height:'10%',
    paddingHorizontal:20,
  },
  pick_view:{
    flex:1,
    //borderWidth:1,
    height:'100%',
    justifyContent: 'center',
    alignItems: 'flex-end',
  },
  buy_view:{
    flex:2,
    height:'100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  buy_button: {
    justifyContent: 'center',
    alignItems: 'center',
    height: '70%',
    width:"80%",
    borderRadius:5,
    backgroundColor: '#0066FF',
  },
  buyButton_text: {
    fontFamily: 'Pretendard-SemiBold',
    fontSize: 18,
    color: '#FFF',
  },
  pick_button:{
    backgroundColor:"white",
    marginRight:10,
    alignItems:'center',
    justifyContent:'center',
  },
  // Detail 안에서의 수정한 View style------------------------------------------------------------------------------------------------
  //가격 수정 view style
  editGoodsPrice_input:{
    backgroundColor: 'white',
    height: 48,
    width:"40%",
    borderRadius: 10,
    borderColor: '#D1D1D1',
    borderWidth: 2,
  },
  editGoodsQuality:{
    justifyContent:'center',
    backgroundColor: 'white',
    height: 40,
    width: "70%",
    borderRadius: 10,
    borderColor: '#D1D1D1',
    borderWidth: 2,
  },
  genuine_view: {
    flex: 1,
    flexDirection: 'row',
    marginBottom: 10
  },
  status_item: {
    flex: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  genuine_row:{
    flex: 1,
    flexDirection: 'row',
  },
  // 상세설명 수정 view style
  editGoodsExplainInput_view:{
    marginTop:10,
    backgroundColor: 'white',
    width:"100%",
    borderRadius: 10,
    borderColor: '#D1D1D1',
    borderWidth: 2,
  },
  // 해쉬태그 수정 view style
  hashTag_input: { 
    backgroundColor: 'white',
    marginBottom: 15,
    paddingLeft: 20,
    height: 60,
    borderRadius: 10,
    borderColor: '#D1D1D1',
    borderWidth: 2,
    flexDirection: 'row',
  },
  textLayout_view: { 
    flex: 8
  },
  btnLayout_view: { 
    flex: 2,
  },
  errorMessage_text: { 
    fontSize: 13,
    color: "#FD9C91",
    marginTop: -15,
  },
  tag_button: { //해시태그 버튼 
   marginTop:5,
    width:45,
    height:45,
    backgroundColor: "#F1F1F3",
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
  },
  tagLayout_view: {
    flexWrap: 'wrap',
    flexDirection: 'row',
    marginBottom:10,
  },
  tagStyle_view: { //해시태그 스타일
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
});