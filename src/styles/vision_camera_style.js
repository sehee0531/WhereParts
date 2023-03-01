import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'black',
    },

    //일반적인 카메라
    viewHeaderLayout:{
        flex: 1,
        justifyContent: 'center',
    },

    viewBodyLayout: {
        flex: 6,
    },

    viewBottomLayout: {
        flex: 1,
        flexDirection: 'row',
        marginTop: 20,
        marginLeft: 30,
        marginRight: 30,
        marginBottom: 30
    },

    // 품번 카메라 디자인
    viewHeaderLayout_item: {
        flex: 3,
        justifyContent: 'center',
    },
    viewBodyLayout_item: {
        flex: 6,
    },
    viewBottomLayout_item: {
        flex: 1,
        flexDirection: 'row',
        marginTop: 20,
        marginLeft: 30,
        marginRight: 30,
        marginBottom: 30
    },
    cutCameraImage_item:{
        position:'absolute',
        top:'44%', 
        left:'15%',
        right:'15%',
        bottom:'44%', 
        zIndex:2, 
        borderWidth:1,
        borderColor:'white',
    },

    // 사업자등록증 카메라 디자인
    viewHeaderLayout_register: {
        flex: 1,
        justifyContent: 'center',
    },
    viewBodyLayout_register: {
        flex: 6,
    },
    viewBottomLayout_register: {
        flex: 1,
        flexDirection: 'row',
        marginTop: 20,
        marginLeft: 30,
        marginRight: 30,
        marginBottom: 30
    },
    cutCameraImage_register:{
        top:'5%', 
        left:'10%',
        right:'10%',
        bottom:'5%',
        position:'absolute',
        zIndex:2, 
        borderWidth:1, 
        borderColor:'white',
    },

    // 명함 카메라 디자인
    viewHeaderLayout_photo: {
        flex: 2.5,
        justifyContent: 'center',
    },
    viewBodyLayout_photo: {
        flex: 6,
    },
    viewBottomLayout_photo: {
        flex: 1,
        flexDirection: 'row',
        marginTop: 20,
        marginLeft: 30,
        marginRight: 30,
        marginBottom: 30
    },
    cutCameraImage_photo:{
        position:'absolute',
        top:'30%', 
        left:'10%',
        right:'10%',
        bottom:'30%',
        zIndex:2, 
        borderWidth:1, 
        borderColor:'white',
    },

    image: {
        flex: 1,
        width: 80,
        height: 50,
        justifyContent: 'flex-start',
        alignItems: 'flex-end',
    },
    viewStyle: {
        flex: 1,
    },
    touchableStyle: {
        flex: 1,
        width: 80,
        height: 50,
        margin: 5,
    },

    pictureLayout:{
        flex:1,
        alignItems:'flex-start',
        justifyContent:'center',
      },
    cameraLayout: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    putLayout: {
        flex: 1,
        alignItems: 'flex-end',
        justifyContent: 'center',
    },

    btn_picture: {
        width: 40,
        height: 40,
        alignItems: 'center',
        justifyContent: 'center',
    },
    
    btn_camera: {
        width: 65,
        height: 65,
        //backgroundColor:"#C0C0CE",
        backgroundColor: "white",
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 50,
    },
    btn_put: {
        width: 60,
        height: 35,
        backgroundColor: "#F1F1F3",
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 10,
    },
    text:{
        fontSize:15,
        color:"black",
      },

});

export default styles;