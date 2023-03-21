import React, { Component } from 'react';
import {
    Text, View, TouchableOpacity, TextInput, ScrollView, Image, Modal, Alert,
    TouchableWithoutFeedback
} from 'react-native';

import { styles } from "../../styles/login/edit_profile";

import AsyncStorage from "@react-native-async-storage/async-storage";

import IconCamera from 'react-native-vector-icons/Entypo';
import IconDelete from 'react-native-vector-icons/Ionicons';
import IconPopup from 'react-native-vector-icons/EvilIcons';

import Constant from "../../util/constatnt_variables";
import WebServiceManager from "../../util/webservice_manager";

class EditProfile extends Component {

    constructor(props) {
        super(props);
        //포커스를 위한 변수
        this.confirmpasswordRef = React.createRef();

        this.passwordRef = React.createRef();
        this.passwordokRef = React.createRef();

        this.photoCameraIcon = React.createRef();
        this.modalPhotoCameraX = null;
        this.modalPhotoCameraY = null;

        this.imageLength = 1; //유효성

        this.loginInfo = { companyNo: null, passwd: null }

        this.state = {
            validForm: false, //유효성
            modal: true,


            passwderror: false,

            userpasswd: '',

            companyNo: '',
            passwd: '',
            passwordok: '',

            cardPopupMenuVisible: false,  //명함 팝업메뉴
            cardImageDetailVisible: false,
            companyImageDetailVisible: false,

            compant: null,
            cardImageURL: null,

            editProfilestatus: 0,

        }
    }

    componentDidMount() {
        this.getLoginInfo().then((value) => {
            this.loginInfo.companyNo = value.companyNo;
            this.loginInfo.userID = value.id;
            this.loginInfo.passwd = value.passwd;
            this.setState({ companyNo: value.companyNo })
            console.log(this.state.companyNo)
            this.callGetCompanyImage(this.loginInfo).then((response) => {
                let reader = new FileReader();
                reader.readAsDataURL(response);
                reader.onloadend = () => {
                    this.setState({ compant: reader.result });
                }
            });
            this.callGetcardImage(this.loginInfo).then((response) => {
                let reader = new FileReader();
                reader.readAsDataURL(response);
                reader.onloadend = () => {
                    this.setState({ cardImageURL: reader.result });
                }
            });
        });
    }

    //사업자등록증 사진을 가져오는 API
    async callGetCompanyImage(loginInfo) {
        let manager = new WebServiceManager(Constant.serviceURL + "/GetCompanyImage", "post");
        manager.addFormData("data", {
            userID: loginInfo.userID, passwd: loginInfo.passwd, id: loginInfo.userID
        });
        console.log("사용자의 유저아이디", loginInfo.userID, "사용자 비밀번호", loginInfo.passwd); 
        let response = await manager.start();
        if (response.ok) {
            return response.blob();
        }
    }

    //명함 사진을 가져오는 API
    async callGetcardImage(loginInfo) {
        let manager = new WebServiceManager(Constant.serviceURL + "/GetNamecardImage", "post");
        manager.addFormData("data", {
            userID: loginInfo.userID, passwd: loginInfo.passwd, id: loginInfo.userID
        });
        let response = await manager.start();
        if (response.ok) {
            return response.blob();
        }
    }

    //사용자 정보를 가져옴
    async getLoginInfo() {
        let obj = await AsyncStorage.getItem('obj')
        let parsed = JSON.parse(obj);
        if (obj !== null) {
            return parsed;
        }
        else {
            return false;
        }
    }

     //현재비밀번호 확인버튼 클릭 시
     passwdOkButtonClicked = () => {
        if (this.state.userpasswd === this.loginInfo.passwd) {
            this.setState({
                modal: !this.state.modal, passwderror:false, editProfilestatus: 1
            });
        }
        else {
            console.log(this.state.userpasswd);
            this.setState({ passwderror: true })
        }
    }


    //수정완료 버튼을 눌렀을 때
    goImageUpload = () => {
        this.callModifyUserAPI().then((response) => {
            console.log('response message =', response);
            if (this.state.passwd !== this.state.passwordok) {
                this.setState({ passwderror: true })
            }
            if (this.state.passwd === this.state.passwordok) {
                this.setState({ passwderror: false })
                if (response.success == "1") {
                    const obj = {
                        companyNo: this.loginInfo.companyNo,
                        id: this.loginInfo.userID,
                        passwd: this.state.passwd,
                    }
                    AsyncStorage.setItem('obj', JSON.stringify(obj));
                    Alert.alert('정보 수정이 완료되었습니다', '로그인 창에서 재로그인 해주세요', [
                        { text: '확인', onPress: () => { this.props.navigation.navigate("Login") } },
                    ]);
                }
            }
            else {
                Alert.alert('정보 수정을 실패하였습니다.');
            }
        })
    }

    //명함사진과 비밀번호를 수정하는 API
    async callModifyUserAPI() {
        let manager = new WebServiceManager("http://203.241.251.177/wparts/ModifyUser", "post");
        const formData = { userID: this.loginInfo.userID, passwd: this.state.passwd };
        manager.addFormData("data", formData);
        manager.addBinaryData("file1", { uri: this.state.cardImageURL, type: "image/jpeg", name: "file1" });
        let response = await manager.start();
        if (response.ok)
            return response.json();
    }

    //명함 사진 URL
    cardImageInfo = (cardImageURI) => {
        this.setState({ cardImageURL: cardImageURI });
        this.imageLength++;
        this.onValueChange();
    }

    // 명함 카메라로 이동
    goPhotoCameraScreen = () => {
        this.props.navigation.navigate('BusinessCardCamera', { onResultListener: this.cardImageInfo });
    }
    // 명함 갤러리로 이동
    goPhotoGalleryScreen = () => {
        this.props.navigation.navigate('PhotoGallery', { onResultListener: this.cardImageInfo })
    }

    //명함 사진 삭제 함수
    photoRemoveClicked = () => {
        this.setState({ cardImageURL: "" });
        this.imageLength--;
        this.onValueChange();
    }

    //유효성 검사
    onValueChange = () => {
        let isValidForm = true;
        if (this.state.passwd.trim().length == 0) {
            isValidForm = false;
        }
        if (this.state.passwordok.trim().length == 0) {
            isValidForm = false;
        }
        if (this.state.passwd != this.state.passwordok) {
            isValidForm = false;
            this.setState({ passwderror: true });
        }
        if (this.state.passwd == this.state.passwordok) {
            this.setState({ passwderror: false });
        }
        if (this.imageLength == 0) {
            isValidForm = false;
        }
        console.log("imageLength", this.imageLength);
        this.setState({ validForm: isValidForm });
    }


    getViewSize = (event) => {
        this.photoCameraIcon.current.measure((fx, fy, width, height, px, py) => {
            this.modalPhotoCameraX = px + width - (width);
            this.modalPhotoCameraY = py + height - (height / 10);
            // console.log('location:',fx,fy,width,height,px,py)
        })
    }


    //명함 자세히보기
    cardImageModal = () => {
        this.setState({
            cardImageDetailVisible: !this.state.cardImageDetailVisible
        });
    }

    //사업자등록증 사진 자세히보기 
    companyImageModal = () => {
        this.setState({
            companyImageDetailVisible: !this.state.companyImageDetailVisible
        });
    }

    //취소버튼 클릭 시 마이페이지로 이동
    goMypage = () => {
        this.props.navigation.pop();
    }

    render() {
        const profilestatus = this.state.editProfilestatus;
        return (
            <>
                {/*비밀번호 확인 후 내정보 접근 modal*/}
                <Modal
                    onRequestClose={()=>this.props.navigation.pop()}
                    transparent={false}
                    visible={this.state.modal}
                >
                    <ScrollView>
                        <View style={styles.container}>
                            <View style={styles.header_textLayout_view}>
                                <Text style={[styles.default_text, styles.main_title_text, { color: '#4B89DC' }]}>비밀번호 확인</Text>
                                <Text style={[styles.default_text, styles.login_guide_text]}>정보 수정을 위해 현재 비밀번호를 입력해주세요.</Text>
                            </View>
                            <View style={{ flex: 7 }}>
                                <View style={styles.textInput_view}>
                                    <Text>비밀번호</Text>
                                    <TextInput
                                        secureTextEntry={true}
                                        onChangeText={(value) => this.setState({ userpasswd: value })}
                                        value={this.state.userpasswd}
                                    />
                                </View>
                                {this.state.passwderror == true ? (
                                    <Text style={styles.errorMessage_text}>
                                        * 비밀번호를 정확하게 입력해주세요.
                                    </Text>
                                ) : null}
                                <View style={{ flexDirection: 'row', marginTop: "3%" }}>
                                    <TouchableOpacity activeOpacity={0.8} style={styles.editprofile_btn} onPress={this.goMypage}>
                                        <Text style={[styles.default_text, styles.signup_btn_text]}>취소</Text></TouchableOpacity>
                                    <TouchableOpacity activeOpacity={0.8} style={[styles.editprofile_btn, { marginLeft: "2%" }]} onPress={this.passwdOkButtonClicked}>
                                        <Text style={[styles.default_text, styles.signup_btn_text]}>확인</Text></TouchableOpacity>
                                </View>
                            </View>
                            <Text></Text><Text></Text>
                        </View>

                    </ScrollView>
                </Modal>
                {(profilestatus == 1) &&
                    <View style={styles.total_container}>
                        <ScrollView
                            onScroll={event => {
                                this.getViewSize(event.nativeEvent.contentOffset.y)
                            }}
                        >
                            <View style={styles.container}>
                                <View style={styles.header_textLayout_view}>
                                    <Text style={[styles.default_text, styles.main_title_text]}>내정보 수정</Text>
                                    <Text style={[styles.default_text, styles.login_guide_text]}>수정을 위해 아래의 항목을 첨부해주세요.</Text>
                                </View>
                                <View style={styles.imageRegister_btnLayout_view}>
                                    {/*사업자 등록증 사진*/}
                                    <View style={styles.imageRegister_btn_view}>
                                        <Text style={[styles.default_text, styles.imageRegister_title_text]}>사업자 등록증</Text>
                                        <TouchableOpacity style={styles.imageRegister_btn} onPress={this.companyImageModal}>
                                            <Image source={{ uri: this.state.compant }} style={styles.imageRegister_image_view} />
                                        </TouchableOpacity>
                                    </View>
                                    {/*명함 사진*/}
                                    <View style={styles.imageRegister_btn_view}>
                                        <Text style={[styles.default_text, styles.imageRegister_title_text]}>명함</Text>
                                        <View onLayout={(event) => { this.getViewSize(event) }} ref={this.photoCameraIcon}>
                                            {this.state.cardImageURL == "" ?
                                                (<TouchableOpacity style={styles.imageRegister_btn} onPress={() => this.setState({ cardPopupMenuVisible: true })}>
                                                    <IconCamera name="image-inverted" size={60}></IconCamera>
                                                </TouchableOpacity>) : (<TouchableOpacity style={styles.imageRegister_btn} onPress={this.cardImageModal}>
                                                    <Image source={{ uri: this.state.cardImageURL }} style={styles.imageRegister_image_view} />
                                                    <TouchableOpacity style={styles.imageDelete_btn} onPress={this.photoRemoveClicked}>
                                                        <IconDelete name="close-circle" color="black" size={27}></IconDelete>
                                                    </TouchableOpacity>
                                                </TouchableOpacity>)
                                            }
                                        </View>
                                    </View>
                                </View>

                                {/*명함 사진 자세히보기*/}
                                <Modal
                                    visible={this.state.cardImageDetailVisible}
                                    onRequestClose={() => this.setState({ cardImageDetailVisible: false })}
                                >
                                    <View style={[styles.total_container, { alignItems: 'center', justifyContent: 'center' }]}>

                                        <Image source={{ uri: this.state.cardImageURL }} style={{ width: "80%", height: "80%" }} />

                                    </View>
                                </Modal>

                                {/*사업자등록증 사진 자세히보기*/}
                                <Modal
                                    visible={this.state.companyImageDetailVisible}
                                    onRequestClose={() => this.setState({ companyImageDetailVisible: false })}
                                >
                                    <View style={[styles.total_container, { alignItems: 'center', justifyContent: 'center' }]}>

                                        <Image source={{ uri: this.state.compant }} style={{ width: "80%", height: "80%" }} />

                                    </View>
                                </Modal>

                                {/*명함모달*/}
                                <Modal
                                    animationType='fade'
                                    transparent={true}
                                    visible={this.state.cardPopupMenuVisible}
                                    onRequestClose={() => this.setState({ cardPopupMenuVisible: false })}
                                >
                                    <PopupMenu x={this.modalPhotoCameraX} y={this.modalPhotoCameraY}
                                        closeModal={() => this.setState({ cardPopupMenuVisible: false })}
                                        goCamera={this.goPhotoCameraScreen} goGallery={this.goPhotoGalleryScreen} />
                                </Modal>

                                <View style={styles.textInputLayout_view}>
                                    <View style={styles.textInput_view}>
                                        <Text>사업자 등록번호</Text>
                                        <Text style={{ marginTop: "2%", fontSize: 15 }}>{this.state.companyNo.slice(0, 3)}-{this.state.companyNo.slice(3, 5)}-{this.state.companyNo.slice(5, 10)}</Text>
                                    </View>

                                    <View style={styles.textInput_view}>
                                        <Text>비밀번호</Text>
                                        <TextInput
                                            ref={(c) => { this.passwordRef = c; }}
                                            returnKeyType="next"
                                            onSubmitEditing={() => { this.passwordokRef.focus(); }}
                                            onChangeText={(value) => this.setState({ passwd: value })}
                                            onEndEditing={(event) => this.onValueChange()}
                                            secureTextEntry={true}
                                        />
                                    </View>

                                    <View style={styles.textInput_view}>
                                        <Text>비밀번호 확인</Text>
                                        <TextInput
                                            ref={(c) => { this.passwordokRef = c; }}
                                            onChangeText={(value) => this.setState({ passwordok: value })}
                                            onEndEditing={(event) => this.onValueChange()}
                                            secureTextEntry={true}
                                        />
                                    </View>
                                    {this.state.passwderror == true ? (
                                        <Text style={styles.errorMessage_text}>
                                            * 비밀번호를 정확하게 입력해주세요.
                                        </Text>
                                    ) : null}
                                </View>
                            </View>
                        </ScrollView>
                        {this.state.validForm ?
                            (<TouchableOpacity onPress={this.goImageUpload} activeOpacity={0.8} style={[styles.default_btn, styles.enable_btn]}>
                                <Text style={[styles.default_text, styles.signup_btn_text]}>수정완료</Text></TouchableOpacity>)
                            : (<TouchableOpacity activeOpacity={0.8} style={[styles.default_btn, styles.disable_btn]}>
                                <Text style={[styles.default_text, styles.signup_btn_text]}>수정완료</Text>
                            </TouchableOpacity>)}
                    </View>
                }
            </>
        )
    }
}

class PopupMenu extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        const layout = { flex: 1, left: this.props.x, top: this.props.y };
        return (
            <>
                <TouchableOpacity onPress={this.props.closeModal} style={{ flex: 1 }}>
                    <View style={layout} >
                        <TouchableWithoutFeedback>
                            <View style={styles.camera_modal_view}>
                                <View style={styles.camera_view}>
                                    <TouchableOpacity onPress={this.props.goCamera}>
                                        <View style={{ flexDirection: 'row' }}>
                                            <IconPopup name="camera" size={25} color={'black'} ></IconPopup>
                                            <Text style={styles.modal_text}>카메라   </Text>
                                        </View>
                                    </TouchableOpacity>
                                </View>
                                <View style={styles.gallery_view}>
                                    <TouchableOpacity onPress={this.props.goGallery}>
                                        <View style={{ flexDirection: 'row' }}>
                                            <IconPopup name="image" size={25} color={'black'} ></IconPopup>
                                            <Text style={styles.modal_text}>앨범</Text>
                                        </View>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </TouchableWithoutFeedback>
                    </View>
                </TouchableOpacity>

            </>
        )
    }
}

export default EditProfile;