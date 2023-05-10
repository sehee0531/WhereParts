import { StyleSheet ,Dimensions} from 'react-native';
const ScreenHeight=Dimensions.get('window').height;
const ScreenWidth=Dimensions.get('window').width;

export const styles = StyleSheet.create({
    total_container:{
        flex:1,
        backgroundColor:'white'
    },
    rowLayout: {
        flex: 1,
        flexDirection: 'row',
    },
    text:{
        fontFamily: "Cochin",
        fontSize: 15,
        color: "black",
    },
    productImage: {
/*         flex: 1, */
        //margin: 5,
        width: ScreenWidth/4.5,
        height:  ScreenWidth/4.5,
        borderRadius: 6,
      },
    //아이템 상세내역
    topContainer:{
        borderWidth:1, 
        padding:'4%',
        flexDirection:"column",
        backgroundColor:'#FFFF',
        borderColor: '#D1D1D1',
    },

    //배송선택
    bodyContainer:{
        marginTop:'2%',
        marginBottom:'5%',
        padding:'4%',
        backgroundColor:'white',
    },
    textInput: {
        backgroundColor: 'white',
        marginBottom: 20,
        paddingHorizontal: 20,
        paddingTop:5,
        height: 70,
        borderRadius: 10,
        borderColor: '#D1D1D1',
        borderWidth: 2,
    },
    textLayout: {
        flex: 6,
    },
    btnLayout: {
        flex: 1,

    },
    btn_camera: {
        width: 50,
        height: 50,
        backgroundColor: "black",
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 10,
        marginTop:5,
    },

    //배송완료 버튼
    bottomContainer:{
        flex:1,
        //borderWidth:1,
        justifyContent: 'flex-end',
    },
    okbtn: {
        height: 50,
        backgroundColor: "#0066FF",
        alignItems: 'center',
        justifyContent: 'center'
    },
    btn_text: {
        fontFamily: "Cochin",
        fontSize: 18,
        color: "white",
    },
    imageView:{
        //borderWidth:1,
        flex:1,
    },
   // item 글자 디자인
  itemNumberText: {
    fontSize: 15,
    color:'blue',
    fontFamily: 'Pretendard-SemiBold',
  },

  itemNameText: {
    fontSize: 17,
    //fontWeight: 'bold',
    fontFamily: 'Pretendard-Medium',
    color: '#000000', 
  },
  itemRegisterDateText: {
    fontSize: 15,
    color:'black'
  },
  itemDistanceText: {
    fontSize: 15,
    fontFamily: 'Pretendard-SemiBold',
  },
  itemPriceText: {
    fontSize: 15,
    //fontWeight: 'bold',
    fontFamily: 'Pretendard-SemiBold',
    color: '#000000',
  },
});