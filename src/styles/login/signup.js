import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({

    total_container: {
        flex: 1,
        backgroundColor: 'white',
    },
    container: {
        flex: 1,
        marginTop: 20,
        marginLeft: 30,
        marginRight: 30,
    },
    // View
        // header
        header_textLayout_view: {
            flex: 1,
            marginTop:10,
            marginBottom:10,
        },
        // imageRegister
        imageRegister_btnLayout_view:{
            flex:3,
            marginTop:30,
            marginBottom:50,
            flexDirection: 'row',
            alignContent:'center',
            justifyContent:'center',   
        },
        imageRegister_btn_view: {
            alignItems: 'center',
            justifyContent: 'center',
        },
        imageRegister_image_view:{
            width: 140,
            height: 120,
            borderRadius:10,
        },
        // textInput
        textInputLayout_view: {
            flex: 6,
        },
        textInput_view: {
            backgroundColor: 'white',
            marginBottom: 20,
            paddingHorizontal: 20,
            paddingVertical: 10,
            height: 75,
            borderRadius: 10,
            borderColor: '#D1D1D1',
            borderWidth: 2,
        },
    
    // Button
        // imageRegister
        imageRegister_btn: {
            width: 140,
            height: 120,
            backgroundColor: "#F1F1F3",
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: 10,
            marginLeft: 15,
            marginRight: 15,
        },
        imageDelete_btn: {
            top: -15,
            right: -15,
            position: 'absolute',
        },
        // 회원가입 활성화,비활성화
        default_btn: {
            height: 50,
            alignItems: 'center',
            justifyContent: 'center'
        },
        enable_btn: {
            backgroundColor: "#1E90FF",
        },
        disable_btn:{
            backgroundColor: "#C9CCD1",
        },

    // Text
        // header
        default_text:{
            fontFamily: "Cochin",
            fontSize: 13,
            color: "black",
        },
        main_title_text: {
            fontWeight: 'bold',
            fontSize: 25,
            marginBottom: 0,
        },
        login_guide_text: {
            color: "gray",
            marginTop: 5,
            marginBottom: 0,
        },
        // Image Register
        imageRegister_title_text: {
            fontWeight: 'bold',
            fontSize: 15,
            marginBottom:5,
        },
        // 일반
        signup_btn_text: {
            fontSize: 18,
            color: "white",
        },

    //PopupMenu
    modal_text: {
        fontSize: 15,
        fontFamily: "Cochin",
        color: 'black',
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
    camera_view: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        borderRightWidth: 1,
    },
    gallery_view: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
})