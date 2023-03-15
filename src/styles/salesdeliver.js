import { StyleSheet ,Dimensions} from 'react-native';
const ScreenHeight=Dimensions.get('window').height;
const ScreenWidth=Dimensions.get('window').width;

export const styles = StyleSheet.create({
    total_container:{
        flex:1,
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
        flex: 1,
        //margin: 5,
        width: 75,
        height: 65,
        borderRadius: 6,
      },
    //아이템 상세내역
    topContainer:{
        flex:2.5,
        flexDirection:"column",
        backgroundColor:'#FFFF',
        borderColor: '#D1D1D1',
    },

    //배송선택
    bodyContainer:{
        flex:7,
        marginTop:'3%',
        marginBottom:'5%',
        padding:20,
        //borderWidth:1,
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
        backgroundColor: "#1E90FF",
        alignItems: 'center',
        justifyContent: 'center'
    },
    btn_text: {
        fontFamily: "Cochin",
        fontSize: 18,
        color: "white",
    },

   
});