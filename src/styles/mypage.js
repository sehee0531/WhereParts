import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
   
   
    //내정보 부분
    viewHeaderLayout:{
        flex:5,
        backgroundColor:"#EDEDED",
        //borderWidth:1,
       
    },
    container:{
        flex:1,
       // borderWidth:1,
        marginTop:60,
        marginLeft:30,
        marginRight:30,
        marginBottom:10,
    },
    rowLayout:{
        flexDirection: 'row',
        flex:1,
    },
    item1:{
        flex:1,
        alignItems: 'center',
    },
    name_text:{
        fontWeight: 'bold',
        fontFamily: "Cochin",
        fontSize: 25,
        color:"black",
        marginBottom:5,
    },
    number_text:{
        fontWeight: 'bold',
        fontFamily: "Cochin",
        fontSize: 20,
        color: "#325AFB",
        marginBottom:5,
       
    },
    item2:{
        flexDirection: 'row',
        flex:1,
        justifyContent: 'center',
        marginTop:10,
    },
    btn:{
        width:90,
        height: 90,
        backgroundColor: "white",
        borderColor:"#D1D1D1",
        borderWidth:2,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 10,
        marginRight:20,
        
    },
    btn_text:{
        fontFamily: "Cochin",
        fontSize: 15,
        color: "black",
        marginTop:10,
    },
    btn_pay:{
        width:90,
        height: 90,
        backgroundColor: "white",
        borderColor:"#D1D1D1",
        borderWidth:2,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 10,
        marginRight:10,
    },
   
 
    //설정 부분
    viewBodyLayout:{
        flex:5,
        //borderWidth:1,
    },
    btn_select:{
        height:55,
        borderBottomWidth:1,
        paddingHorizontal:30,
        alignItems:'center',
        borderColor:"#D1D1D1",
        flexDirection: 'row',
    },
    btn_select_text:{
        fontFamily: "Cochin",
        fontSize: 15,
        color: "black",
    },
    textView:{
        flex:9,
        flexDirection: 'row',
    },
    iconView:{
        flex:1,
        alignItems:'flex-end',
    },
    //로그아웃 버튼
    viewBottomLayout:{
        flex:1,
    },

    btn_logout: {
        height: 45,
        backgroundColor: "#1E90FF",
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 30,
        marginLeft:30,
        marginRight:30,
    },
    btn_logout_text: {
        fontFamily: "Cochin",
        fontSize: 18,
        color: "white",
    },
})