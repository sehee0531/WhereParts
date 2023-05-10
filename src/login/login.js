import React, { Component } from 'react';
import { Text, View, TouchableOpacity, TextInput, Alert, ScrollView, PermissionsAndroid } from 'react-native';

import { styles } from "../styles/login/login";
import Constant from "../util/constatnt_variables";
import WebServiceManager from "../util/webservice_manager";
import SplashScreen from 'react-native-splash-screen';
import IconRadio from 'react-native-vector-icons/MaterialIcons';

import FunctionUtil from '../util/libraries_function';
import Session from '../util/session';
import messaging from '@react-native-firebase/messaging';

class Login extends Component {

    constructor(props) {
        super(props);
        this.idRef = React.createRef(); //다음을 눌렀을 경우 포커싱 이동을 위함
        this.passwordRef = React.createRef();
        this.loginButtonRef = React.createRef();
        this.deviceToken = '';

        this.state = {
            companyNo: '', //사업자번호
            passwd: '', //비밀번호
            id: '', //userID
            validForm: false, //유효성 검사

            autoLoginChecked: false,
            rememberIdChecked: false,
            loginValid: false
        }     
    }

    //자동로그인
    componentDidMount() {
        SplashScreen.hide();
        
        this.focusListener = this.props.navigation.addListener('focus', () => {
            this.onValueChange();
            this.setState({companyNo:"",passwd:"",autoLoginChecked: false,rememberIdChecked: false}) 
        });
        //퍼미션 설정되었는지 확인
        this.requestPermission();
        //현재 설정된 로그인에 대한 정보 얻어와 실제 로그인 진행
        this.autoLogin();
        //알림메시지 처리
        this.handleFCMMessage();
    }

    componentWillUnmount () {
        this.focusListener();
    }

    async requestPermission() {
        try {
            const granted = await PermissionsAndroid.requestMultiple([PermissionsAndroid.PERMISSIONS.CAMERA,
            PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
            PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
            PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE
            ]).then((result) => {
                if (result['android.permission.CAMERA'] &&
                    result['android.permission.ACCESS_FINE_LOCATION'] &&
                    result['android.permission.READ_EXTERNAL_STORAGE'] &&
                    result['android.permission.WRITE_EXTERNAL_STORAGE'] === 'granted') {
                    console.log('모든 권한 획득')
                }
                else {
                    console.log('거절된 권한있음')
                }
            });

            //push notification 퍼미션이 허용되어 있으면 토큰을 가져옴 (안드로이드 12까지는 알림이 무조건 허용되어 있음 13부터는 퍼미션 물어봄)
            const authStatus = await messaging().requestPermission();
            const enabled = authStatus === messaging.AuthorizationStatus.AUTHORIZED || authStatus === messaging.AuthorizationStatus.PROVISIONAL;

            //알림 권한이 설정되어 있으면...
            if (enabled) {
                const token = await messaging().getToken();
                //푸시 토큰 표시         
                console.log('fcm token:', token);
                console.log('Authorization status:', authStatus);
                this.deviceToken = token;

            } else {
                console.log('fcm auth fail');
            }
        } catch (err) {
            console.warn(err);
        }
    }

    //AsyncStorage에 저장된 정보를 기반으로 어떻게 로그인할지 정하고 로그인 실행
    autoLogin() {
        FunctionUtil.getLoginType().then((response) => {  
            console.log('login info ', response);
            const {companyNo,passwd,detailLogin} = response;
            //자동로그인으로 설정된 경우
            if (detailLogin == 1) {
                this.setState({ autoLoginChecked: true });
                const loginInfo = {
                    companyNo: companyNo,
                    passwd: passwd,
                    deviceToken: "",
                    detailLogin:1,
                    isAutoLogin:true
                }
                this.login(loginInfo);
            }
            //id저장이 선택된 경우
            else if (response.detailLogin == 2) {
                // 패스워드만 입력
                this.setState({ companyNo: companyNo, rememberIdChecked: true });
            }
        });
    }

    loginButtonClicked = () => { // 로그인 버튼 눌렀을 때 호출되는 함수
        const loginInfo = {
            companyNo: this.state.companyNo.replace(/-/g, ''),
            passwd: this.state.passwd,
            deviceToken: this.deviceToken,
            detailLogin:this.getDetailLogin(),
            isAutoLogin:false
        }
        this.login(loginInfo);
    }

    login(loginInfo){
        //console.log('로그인 정보 =',loginInfo);
        FunctionUtil.goLogin(loginInfo).then((success) => {
            //console.log("로그인 성공 여부 = ", success);
            //console.log("저장된 Session = ", Session.getUserInfoItem());
            //console.log("로그인 되었는지 = ", Session.isLoggedin());
            if (success == false) { //회원정보가 없을 경우
                Alert.alert('아이디 비밀번호를 확인해주세요', '',);
                return;
            }
            else if (Session.getPageInfoItem() != null) {
                this.props.navigation.navigate(Session.getNextPage(),{ saleState: 2 });
            }
            else {
                this.props.navigation.navigate('TabHome');
            }
        });
    }

    //아무것도 체크안한 상태 --0, 자동로그인 체크 --1, id기억 체크 --2
    autoLoginCheckButtonChecked = () => {
        this.setState({ autoLoginChecked: !this.state.autoLoginChecked });
        if (this.state.rememberIdChecked) {
            this.setState({ rememberIdChecked: false });
        }
    }
    rememberIdCheckButtonChecked = () => {
        this.setState({ rememberIdChecked: !this.state.rememberIdChecked });
        if (this.state.autoLoginChecked) {
            this.setState({ autoLoginChecked: false });
        }
    }

    getDetailLogin() {
        if (this.state.autoLoginChecked)
            return 1;
        if (this.state.rememberIdChecked)
            return 2;
        else
            return 0;
    }

    //입력값 유효성 검사
    onValueChange = (value) => {
        this.setState(value, () => {
            let isValidForm = true;
            if (this.state.companyNo.replace(/-/g, '').trim().length < 10) { // 조건 필요시 추가
                isValidForm = false;
            }
            if (this.state.passwd.trim().length == 0) {
                isValidForm = false;
            }

            console.log("isValidForm", isValidForm);
            this.setState({ validForm: isValidForm });
        });
    }

    registerUserButtonClicked = () => {
        this.props.navigation.navigate('SignUp'); //회원가입 버튼 눌렀을 경우
    }

    async callSetReadNotiAPI(id) {
        let manager = new WebServiceManager(Constant.serviceURL + "/SetReadNoti?id=" + id);
        let response = await manager.start();
        if (response.ok)
            return response.json();
    }

    backGroundNotiOkButtonClicked = (message) => {
        const isLoggedin = Session.isLoggedin();
        this.callSetReadNotiAPI(message.data.id).then((response) => {
            console.log(response);
        });
        if (isLoggedin == true) {
            if (message.data.kind == "buy")
                this.props.navigation.navigate("BuyList");
            else if (message.data.kind == "sell")
                this.props.navigation.navigate("SalesList", { saleState: 2 });
        }
        else {
            if (message.data.kind == "buy") {
                let pageInfo = { prevPage: "MyPage", nextPage: "BuyList" }
                Session.setPageInfoItem(pageInfo);
            }
            else if (message.data.kind == "sell") {
                pageInfo = { prevPage: "MyPage", nextPage: "SalesList" }
                Session.setPageInfoItem(pageInfo);
            }
        }
    }

    foreGroundNotiOkButtonClicked = (message) => {
        const isLoggedin = Session.isLoggedin();
        this.callSetReadNotiAPI(message.data.id).then((response) => {
            console.log(response);
        });
        if (isLoggedin == true) {
            if (message.data.kind == "buy")
                this.props.navigation.navigate("BuyList");
            else if (message.data.kind == "sell")
                this.props.navigation.navigate("SalesList", { saleState: 2 });
        }
        else {
            if (message.data.kind == "buy") {
                let pageInfo = { prevPage: "MyPage", nextPage: "BuyList" }
                Session.setPageInfoItem(pageInfo);
            }
            else if (message.data.kind == "sell") {
                pageInfo = { prevPage: "MyPage", nextPage: "SalesList" }
                Session.setPageInfoItem(pageInfo);
            }
        }
    }

    //알림이 올 경우 
    handleFCMMessage = () => {
        //Foreground 상태에서 알림이 오면 Alert 창 보여줌
        const unsubscribe = messaging().onMessage(async remoteMessage => {
            console.log('foreground 상태에서 알림을 받았습니다.');
            Alert.alert(remoteMessage.notification.title, remoteMessage.notification.body, [
                { text: '취소', onPress: () => { } },
                { text: '확인', onPress: () => this.foreGroundNotiOkButtonClicked(remoteMessage) }],
                { cancelable: false });
            return false;

        });

        //Background 상태에서 알림창을 클릭한 경우 해당 페이지로 이동         
        messaging().onNotificationOpenedApp(remoteMessage => {
            console.log('Notification caused app to open from background state:', remoteMessage);
            this.backGroundNotiOkButtonClicked(remoteMessage);
        });
    }

    render() {
        return (
            <>
                <View style={styles.total_container}>
                    <ScrollView>
                        <View style={styles.container}>
                            <View style={styles.itemLayout_view}>
                                <View style={styles.header_textLayout_view}>
                                    <Text style={[styles.default_title_text, styles.where_title_text]}>WHERE</Text>
                                    <Text style={[styles.default_title_text, styles.parts_title_text]}>PARTS</Text>
                                </View>
                                <View style={styles.textInput_view}>
                                    <Text>사업자번호</Text>
                                    <TextInput
                                        ref={(c) => { this.idRef = c; }}
                                        returnKeyType="next"
                                        keyboardType="number-pad"
                                        onSubmitEditing={() => { this.passwordRef.focus(); }}
                                        onChangeText={(value) => { this.onValueChange({ companyNo: value.replace(/(\d{3})(\d{2})(\d)/, "$1-$2-$3") })}}
                                        value={this.state.companyNo}
                                    />
                                </View>
                                <View style={styles.textInput_view}>
                                    <Text>비밀번호</Text>
                                    <TextInput
                                        ref={(c) => { this.passwordRef = c; }}
                                        returnKeyType="next"
                                        onChangeText={(value) => this.onValueChange({ passwd: value })}
                                        secureTextEntry={true}
                                        value={this.state.passwd}
                                    />
                                </View>
                                <View style={{ flexDirection: 'row', marginTop: "-5%" }}>
                                    <TouchableOpacity style={{ flexDirection: 'row' }} activeOpacity={0.8} onPress={this.autoLoginCheckButtonChecked}>
                                        <IconRadio name={this.state.autoLoginChecked ? "check-circle" : "panorama-fish-eye"} size={20} color={'lightgrey'} style={{ paddingTop: 5 }} />
                                        <Text style={[styles.default_text, styles.radio_btn_text]}> 자동로그인  </Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity style={{ flexDirection: 'row' }} activeOpacity={0.8} onPress={this.rememberIdCheckButtonChecked}>
                                        <IconRadio name={this.state.rememberIdChecked ? "check-circle" : "panorama-fish-eye"} size={20} color={'lightgrey'} style={{ paddingTop: 5 }} />
                                        <Text style={[styles.default_text, styles.radio_btn_text]}> id기억  </Text>
                                    </TouchableOpacity>
                                </View>
                                <Text style={[styles.default_text, styles.login_guide_text]}>자동로그인 체크 이후에는 보안을 위하여 7일간만 자동으로 로그인 됩니다.</Text>

                            </View>
                        </View>
                        <View style={styles.row_view}>
                            <TouchableOpacity activeOpacity={0.8} style={styles.default_btn}>
                                <Text style={[styles.default_text, styles.pw_signup_text]}>비밀번호 찾기   </Text>
                            </TouchableOpacity>
                            <Text style={[styles.default_text, styles.pw_signup_text]}>|</Text>
                            <TouchableOpacity activeOpacity={0.8} style={styles.default_btn} onPress={this.registerUserButtonClicked}>
                                <Text style={[styles.default_text, styles.pw_signup_text]}>   회원가입</Text>
                            </TouchableOpacity>
                        </View>
                    </ScrollView>
                    {/* 상품 등록하기 버튼 부분*/}
                    {this.state.validForm ?
                        (<TouchableOpacity activeOpacity={0.8} style={[styles.default_btn, styles.enable_login_btn]} onPress={this.loginButtonClicked}>
                            <Text style={[styles.default_text, styles.login_btn_text]}>로그인</Text>
                        </TouchableOpacity>)
                        : (<TouchableOpacity activeOpacity={0.8} style={[styles.default_btn, styles.disable_login_btn]}>
                            <Text style={[styles.default_text, styles.login_btn_text]}>로그인</Text>
                        </TouchableOpacity>)}
                </View>
            </>
        )
    }
}

export default Login;