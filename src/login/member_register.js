import React, { Component } from 'react';
import { Text, View, TouchableOpacity, TextInput, Alert, ScrollView, PermissionsAndroid, Keyboard } from 'react-native';

import { styles } from "../styles/login/login";

import Constant from "../util/constatnt_variables";
import WebServiceManager from "../util/webservice_manager";
import AsyncStorage from "@react-native-async-storage/async-storage";
import SplashScreen from 'react-native-splash-screen';
import IconRadio from 'react-native-vector-icons/MaterialIcons';

class Login extends Component {

    constructor(props) {
        super(props);
        this.idRef = React.createRef(); //다음을 눌렀을 경우 포커싱 이동을 위함
        this.passwordRef = React.createRef();
        this.loginInfo = { companyNo: null, passwd: null };

        this.parsed = null;

        this.state = {
            companyNo: '', //사업자번호
            passwd: '', //비밀번호
            id: '', //userID
            validForm: false, //유효성 검사

            detailLogin: 0,
            autoLoginChecked: false,
            rememberIdChecked: false,
        }
    }

    //자동로그인
    componentDidMount() {
        SplashScreen.hide();

        this.keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', this.keyboardDidShow);
        this.keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', this.keyboardDidHide);

        this.requestPermission();

        this.availableLogIn().then(() => {
        });
    }

    componentWillUnmount() {
        this.keyboardDidShowListener.remove();
        this.keyboardDidHideListener.remove();
        //BackHandler.removeEventListener("hardwareBackPress", this.backPressed);
    }

    keyboardDidShow = () => {
        console.log('Keyboard Shown');
    }

    keyboardDidHide = () => {
        console.log('Keyboard Hide');
        this.onValueChange();
    }

    async requestPermission() {
        try {
            const granted = await PermissionsAndroid.requestMultiple([PermissionsAndroid.PERMISSIONS.CAMERA,
            PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION, PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE, PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE
            ]).then((result) => {
                if (result['android.permission.CAMERA'] && result['android.permission.ACCESS_FINE_LOCATION'] && result['android.permission.READ_EXTERNAL_STORAGE'] && result['android.permission.WRITE_EXTERNAL_STORAGE'] === 'granted') {
                    console.log('모든 권한 획득')
                }
                else {
                    console.log('거절된 권한있음')
                }
            })
        } catch (err) {
            console.warn(err);
        }
    }

    //로그인 정보가 앱에 저장되어 있다면...(자동로그인,id기억 관리)
    async availableLogIn() {
        const obj = await AsyncStorage.getItem('obj');
        if (obj !== null) {
            const loginInfo = JSON.parse(obj);
            this.parsed = loginInfo;
            this.loginInfo.companyNo = loginInfo.companyNo;
            this.loginInfo.passwd = loginInfo.passwd;
            if (this.parsed.detailLogin == 0) {
                return false;
            }
            if (this.parsed.detailLogin == 1) {
                this.callLoginAPI(this.loginInfo).then((response) => {
                    console.log("재로그인 성공", response);
                    this.props.navigation.navigate('TabHome');
                })
            }
            if (this.parsed.detailLogin == 2) {
                this.setState({ companyNo: loginInfo.companyNo });
            }
            else {
                return false;
            }
        }
        else {
            return false; //null 값일 경우 false
        }
    }

    //입력값 유효성 검사
    onValueChange = () => {
        let isValidForm = true;
        if (this.state.companyNo.trim().length == 0) { // 조건 필요시 추가
            isValidForm = false;
        }
        if (this.state.passwd.trim().length == 0) {
            isValidForm = false;
        }
        console.log("isValidForm", isValidForm);
        this.setState({ validForm: isValidForm });
    }



    loginButtonClicked = () => { // 로그인 버튼 눌렀을 때 호출되는 함수
        this.loginInfo.companyNo = this.state.companyNo;
        this.loginInfo.passwd = this.state.passwd;
        
        this.callLoginAPI(this.loginInfo).then((response) => {
            if (response.id == "0") { //회원정보가 없을 경우 
                //this.passwordRef.clear();
                Alert.alert('아이디 비밀번호를 확인해주세요', '',);
                return false;
            }
            else {
                const obj = {
                    companyNo: this.state.companyNo, //사업자번호
                    id: response.id, //userId
                    passwd: this.state.passwd, //비밀번호
                    detailLogin: this.state.detailLogin
                }
                console.log("자동로그인 성공");
                AsyncStorage.setItem('obj', JSON.stringify(obj));
                console.log(response);
                this.props.navigation.navigate('TabHome');
                this.setState({passwd:'',companyNo:''});
            }
        })
    }



    async callLoginAPI(loginInfo) { //사업자번호와 비밀번호를 서버로 보내주는 API
        let manager = new WebServiceManager(Constant.serviceURL + "/Login", "post");
        manager.addFormData("data", {
            companyNo: loginInfo.companyNo, passwd: loginInfo.passwd
        });
        let response = await manager.start();
        if (response.ok) {
            return response.json();
        }
    }

    registerUserButtonClicked = () => {
        this.props.navigation.navigate('SignUp'); //회원가입 버튼 눌렀을 경우
    }

    autoLoginRadioButtonChecked = () => {
        this.setState({ autoLoginChecked: true, rememberIdChecked: false, detailLogin: 1 });
    }

    rememberIdRadioButtonChecked = () => {
        this.setState({ autoLoginChecked: false, rememberIdChecked: true, detailLogin: 2 });

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
                                        onSubmitEditing={() => { this.passwordRef.focus(); }}
                                        onChangeText={(value) => this.setState({ companyNo: value })}
                                        onEndEditing={(event) => this.onValueChange()}
                                        value={this.state.companyNo}
                                    />
                                </View>
                                <View style={styles.textInput_view}>
                                    <Text>비밀번호</Text>
                                    <TextInput
                                        ref={(c) => { this.passwordRef = c; }}
                                        onChangeText={(value) => this.setState({ passwd: value })}
                                        onEndEditing={(event) => this.onValueChange()}
                                        secureTextEntry={true}
                                        value={this.state.passwd}
                                    />
                                </View>
                                <View style={{ flexDirection: 'row', marginTop: "-5%" }}>
                                    <TouchableOpacity style={{ flexDirection: 'row' }} activeOpacity={0.8} onPress={this.autoLoginRadioButtonChecked}>
                                        <IconRadio name={this.state.autoLoginChecked ? "check-circle" : "panorama-fish-eye"} size={20} color={'lightgrey'} style={{ paddingTop: 5 }} />
                                        <Text style={[styles.default_text, styles.radio_btn_text]}> 자동로그인  </Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity style={{ flexDirection: 'row' }} activeOpacity={0.8} onPress={this.rememberIdRadioButtonChecked}>
                                        <IconRadio name={this.state.rememberIdChecked ? "check-circle" : "panorama-fish-eye"} size={20} color={'lightgrey'} style={{ paddingTop: 5 }} />
                                        <Text style={[styles.default_text, styles.radio_btn_text]}> id기억  </Text>
                                    </TouchableOpacity>
                                </View>
                                <Text style={[styles.default_text, styles.login_guide_text]}>자동로그인 체크 이후에는 자동으로 로그인 됩니다.</Text>

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