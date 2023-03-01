
import { Dimensions, StyleSheet } from 'react-native';
export const styles = StyleSheet.create({ //export를 해주어야 다른 곳에서 사용할 수 있음
 
 
  /* 상품 상세보기 */
  modalView: {
    width: "100%",
    height: "100%",
    backgroundColor: 'white',
    shadowColor: '#000',
    borderRadius:6,
  },
  modalTobbar:{
    height:'9%',
    flexDirection:'row',
    alignItems:'center',
    borderBottomColor: '#E6E6E6',
    borderBottomWidth:1, //
    justifyContent: 'flex-end',
    paddingVertical:3,
    paddingHorizontal:5,
    backgroundColor:'#E0F0FF',
    //backgroundColor:'white',
  },
  //상품 TabBar
  modalCloseButton:{ 
    alignItems:'center',
    
  },

  tabBarButton:{
    width:"20%",
    height:"70%",
    //borderWidth:1,
    //borderColor:'#E6E6E6',
    borderRadius:5,
    alignItems:'center',
    justifyContent:'center',
    marginRight:10,
    backgroundColor:'white',
    //backgroundColor:'#E0F0FF',
  },
  tabBarText:{
    fontFamily: 'Pretendard-SemiBold',
    fontSize: 15,
  },

  wrap: { //모달 //
    flex: 1,
    backgroundColor: '#FFF',
  },

 //상품 상세보기
  productDetailView: { 
    flex: 1,
    backgroundColor: '#FFF',  
  },
 
  //이미지 
  productImage:{
    //borderWidth:1,
    flex:1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal:"5%",
    },
  slideImageView: { 
    alignItems:'center',
    justifyContent:'center',
    //borderWidth:1, 
    borderRadius:10,
    height: 280,
    width: 280,
    marginVertical:"5%",
    //backgroundColor:'white',
  },
    allImagesImage: {
     
      width: 280,
      height: 280,
      borderRadius:10,
    },

    //상품 설명 부분
    productDetail: { 
        borderTopWidth:1,
        marginHorizontal:20,
        paddingBottom:30,
        //borderRadius:10,
        padding: 20,
        borderColor: '#E6E6E6',
        borderBottomWidth:1,
    },
    //인증업체
    certificationMark: { 
        width: 64,
        backgroundColor: '#E8EEF0',
        borderRadius: 4,
        marginBottom: 15,
    },
    certificationMarkText: {
        fontFamily: 'Pretendard-SemiBold',
        fontSize: 12,
        color: '#000',
        textAlign: 'center',
    },

    //부품 이름, 번호
    detailProductNumber: {
        //borderWidth:1,
        flexDirection:'row',
        alignItems: 'center',
    }, 
    detailProductNumberText: {
        fontSize: 17,
        fontFamily: 'Pretendard-SemiBold',
        color: '#0066FF',
        paddingLeft:'5%'
    },

    //detailProductName: {}, 
    detailProductNameText: {
        fontSize: 24,
        fontFamily: 'Pretendard-SemiBold',
        color: '#000000',
    },

    //가격
    detailPriceWrap: {
        //borderWidth:1,
        marginTop: 3,
        flexDirection: 'row',
        alignItems: 'flex-end',
    },

    //detailPrice: {},s
    detailPriceText: {
        fontFamily: 'Pretendard-Bold',
        fontSize: 22,
        color: '#000',
       // lineHeight: 28,
    },
    detailUnit: {
        marginLeft: 2,
    },
    detailUnitText: {
        fontFamily: 'Pretendard-Regular',
        fontSize: 15,
        color: '#000',
        lineHeight: 28,
    },

    quantityView: {
        marginLeft: 'auto',
    },
    remaining: {
        marginLeft: 'auto',
        marginBottom: 5,
        flexDirection: 'row',
        alignItems:'center',
    },
    remainingText: {
        fontSize: 13,
        fontFamily: 'Pretendard-Regular',
        color: '#949CA1',
    },
    selectQuantityView: {
        borderRadius: 6,
        borderColor: '#D4D4D4',
        borderWidth: 1,
        flexDirection: 'row',
        alignItems: 'center',
    },
    quantityItemText: {
        fontFamily: 'Pretendard-Medium',
        fontSize: 18,
        color: '#000',
      },
    quantityItem: {
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

    // 상품 정보
    toggleDetailView: {
        //borderWidth:1,
        
        paddingVertical:15,
        paddingHorizontal:35,
    },
    toggleDetailTitle: {
        //borderWidth:1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 15,
    },
    toggleDetailTitleText: {
        fontFamily: 'Pretendard-SemiBold',
        fontSize: 16,
        color: '#000',
    },
    toggleDetailTitleIcon: {},
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
    toggleDetailItemValue: {},
    toggleDetailItemValueText: {
      fontFamily: 'Pretendard-Regular',
      fontSize: 15,
      color: '#000000',
      lineHeight: 20,
    
    },
    toggleDetailTextArea: {
    marginTop: 15,
    marginBottom: 50,
    },
    toggleDetailTextAreaText: {
    fontFamily: 'Pretendard-Regular',
    fontSize: 15,
    color: '#000000',
    lineHeight: 25,
    },

    /*
  pagination: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  paginationItem: {
    width: 12,
    height: 12,
    backgroundColor: '#FFF',
    borderColor: '#E4E4E4',
    borderWidth: 1,
    margin: 3,
    borderRadius: 6,
  },
  paginationItemActive: {
    width: 36,
    backgroundColor: '#000',
    borderWidth: 0,
  },
*/
 
 

  detailHashTags: {  
    marginTop: 15,
    flexDirection: 'row',
    flexWrap: 'wrap',
    //borderWidth:1,
  },
  detailHashTag: { 
    marginRight: 8,
  },
  detailHashTagText: { 
    fontSize: 14,
    fontFamily: 'Pretendard-Medium',
    //color: '#BCBFC4',
    
  },
  
  modalBottomBar:{
    flexDirection:'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderColor:'#E4E4E4',
    //borderTopWidth:1,
    borderWidth:1,
    height:'10%',
    paddingHorizontal:20,
  },
  pickView:{
    flex:1,
    //borderWidth:1,
    height:'100%',
    justifyContent: 'center',
    alignItems: 'flex-end',
  },
  buyView:{
    flex:2,
    height:'100%',
    //borderWidth:1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buyButton: {
    justifyContent: 'center',
    alignItems: 'center',
    height: '70%',
    width:"80%",
    borderRadius:5,
    backgroundColor: '#0066FF',
  },
  buyButtonText: {
    fontFamily: 'Pretendard-SemiBold',
    fontSize: 18,
    color: '#FFF',
  },
  pickButton:{
    backgroundColor:"white",
    marginRight:10,
    alignItems:'center',
    justifyContent:'center',
  },


  input: { //Home TextInput 안에 글씨
    backgroundColor: 'white',
    width: "80%",
    marginLeft: 5,
    paddingVertical: 10,
    paddingHorizontal: 40,
    borderRadius: 10,
    fontSize: 14,
    marginTop: 5,
    marginBottom: 5,
  },
  searchBarStyle: { //home TextInput
    flexDirection: 'column',
    width: "100%",
    position: 'absolute',
    alignItems: 'center',
    backgroundColor: "#1E90FF",
    borderwidth:5,
  },

  //sort 정렬
  row: { // 가로정렬
    borderColor: "red",
    backgroundColor: 'white',
    //borderWidth: 1,
    width:"100%",
    paddingTop:"1%",
    paddingRight:"1%",
    alignItems:'flex-end',
  },
  sortText: { //최신순/오래된순 글씨
    fontWeight: 'bold',
    textAlign: 'right',
    color: '#6495ED',
    fontSize: 13,
  },
  
  homeTop: { //홈의 위의 디자인 담당
    width: "100%",
    height: 200,
    backgroundColor: '#0076D1',
    //paddingHorizontal: 30,
    //paddingTop: 40,
    //paddingBottom: 40,
    position: 'absolute',
  },
  textSSTTYYLLE: { // 모달 x버튼
    textAlign: "right",
    fontSize: 20,
  },
  
  // Detail 안에서의 수정한 View style------------------------------------------------------------------------------------------------
  //가격 수정 view style
  editGoodsPriceInput:{
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
  g_rowLayout: {
    flex: 1,
    flexDirection: 'row',
    marginBottom: 10
  },
  item_title: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
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
  keywordView:{ 
    marginTop:10,
  },
  // 상세설명 수정 view style
  editGoodsExplainInput:{
    marginTop:10,
    backgroundColor: 'white',
    width:"100%",
    borderRadius: 10,
    borderColor: '#D1D1D1',
    borderWidth: 2,
  },
  editCompleteButton: {
    justifyContent: 'center',
    alignItems: 'center',
    height: 60,
    width:"85%",
    backgroundColor: '#0066FF',
  },
  editCompleteButtonText: {
    fontFamily: 'Pretendard-SemiBold',
    fontSize: 18,
    color: '#FFF',
  },

  // 해쉬태그 수정 view style
  textInput: { 
    backgroundColor: 'white',
    marginBottom: 15,
    paddingLeft: 20,
    height: 60,
    borderRadius: 10,
    borderColor: '#D1D1D1',
    borderWidth: 2,
    flexDirection: 'row',
  },
  rowLayout: { 
    flex: 1,
    flexDirection: 'row',
    //borderWidth:1,
  },
  textLayout: { 
    flex: 8,
    //borderWidth:1,
  },
  errorMessage: { 
    fontSize: 13,
    color: "#FD9C91",
    marginTop: -15,
  },
  btnLayout: { 
    flex: 2,
    //borderWidth:1,
  },
  btn_tag: { //해시태그 버튼 
   marginTop:5,
    width:45,
    height:45,
    backgroundColor: "#F1F1F3",
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
  },
  tagLayout: {
    flexWrap: 'wrap',
    flexDirection: 'row',
    marginBottom:10,
  },
  tagStyle: { //해시태그 스타일
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