import React, { Component } from 'react';
import {
    Text, View, TouchableOpacity, TextInput, ScrollView, Image, Modal, Alert,
    StyleSheet
} from 'react-native';

import { styles } from "../../styles/login/edit_profile";
import { template } from '../../styles/template/page_style';

import ImageSelectorPopup from '../../util/popup_image_selector';
import AsyncStorage from "@react-native-async-storage/async-storage";
import Session from '../../util/session';
import FunctionUtil from '../../util/libraries_function';

import IconCamera from 'react-native-vector-icons/Entypo';
import IconDelete from 'react-native-vector-icons/Ionicons';

import Constant from "../../util/constatnt_variables";
import WebServiceManager from "../../util/webservice_manager";

//비밀번호,명함 변경 및 사업자번호,명함 사진을 확인할 수 있는 내정보 수정 페이지
class EditProfile extends Component {
    constructor(props) {
        super(props);
        //포커스를 위한 변수
        this.passwordRef = React.createRef();
        this.passwordokRef = React.createRef();
        this.photoCameraIcon = React.createRef();
        this.modalPhotoCameraX = null;
        this.modalPhotoCameraY = null;

        this.loginInfo = { }

        this.state = {
            validForm: false, //유효성
            passwdError: false, //현재 비밀번호를 입력해야 정보수정을 할 수 있음. 현재 비밀번호 입력이 틀렸을 경우 true

            confirmPasswd: '',
            passwd: '',
            passwordok: '',

            cardPopupMenuVisible: false,  //명함 이미지 선택을 위한 팝업메뉴
            cardImageDetailVisible: false, //명함 자세히
            companyImageDetailVisible: false, //사업자등록증 자세히

            companyNoImageURI: null, //사업자등록증 사진
            cardImageURI: null, //명함 사진
            passwdConfirmModal: true,   //정보수정을 위한 패스워드 입력 창 on/off
            editProfileModal: false,    //취소버튼 클릭 시 모달 뒤의 페이지가 보이는 현상을 수정하기 위해

            //newCardImage:false          //새롭게 명함 이미지를 선택했을 경우 true (이미지 사이즈 줄이고 넣을거냐? 현재 사용하지 않음)
        }
    }

    componentDidMount() {
        FunctionUtil.loginInfo().then((value) => {
            this.loginInfo = { companyNo: value.companyNo, passwd: value.passwd, userID: Session.getUserID() }
            this.callGetCompanyImage().then((response) => {
                let reader = new FileReader();
                reader.readAsDataURL(response);
                reader.onloadend = () => {
                    this.setState({ companyNoImageURI: reader.result });
                }
            });
            this.callGetcardImage().then((response) => {
                let reader = new FileReader();
                reader.readAsDataURL(response);
                reader.onloadend = () => {
                    this.setState({ cardImageURI: reader.result });
                }
            });
        });

    }

    //사업자등록증 사진을 가져오는 API
    async callGetCompanyImage() {
        let manager = new WebServiceManager(Constant.serviceURL + "/GetCompanyImage", "post");
        manager.addFormData("data", {
            userID: this.loginInfo.userID, passwd: this.loginInfo.passwd, id: this.loginInfo.userID
        });//열람하고자 하는 id
        let response = await manager.start();
        if (response.ok) {
            return response.blob();
        }
    }

    //명함 사진을 가져오는 API
    async callGetcardImage() {
        let manager = new WebServiceManager(Constant.serviceURL + "/GetNamecardImage", "post");
        manager.addFormData("data", {
            userID: this.loginInfo.userID, passwd: this.loginInfo.passwd, id: this.loginInfo.userID
        });
        let response = await manager.start();
        if (response.ok) {
            return response.blob();
        }
    }

    //현재비밀번호 확인버튼 클릭 시
    passwdOkButtonClicked = () => {
        if (this.state.confirmPasswd === this.loginInfo.passwd)
            this.setState({ passwdConfirmModal: false, passwdError: false, editProfileModal: true });
        else
            this.setState({ passwdError: true })
    }


    //수정완료 버튼을 눌렀을 때
    goModifyUser = () => {
        this.callModifyUserAPI().then((response) => {
            console.log('response message =', response);
            if (this.state.passwd !== this.state.passwordok)
                this.setState({ passwderror: true })
            else if (this.state.passwd == this.state.passwordok) {
                this.setState({ passwderror: false })
                if (response.success == 1) {
                    AsyncStorage.clear();
                    Alert.alert('정보 수정이 완료되었습니다', '로그인 창에서 재로그인 해주세요', [
                        { text: '확인', onPress: () => { this.props.navigation.navigate("Login") } },
                    ]);
                }
                else {
                    Alert.alert('정보 수정을 실패하였습니다.');
                }
            }
        })
    }

    //명함사진과 비밀번호를 수정하는 API
    async callModifyUserAPI() {
        let manager = new WebServiceManager(Constant.serviceURL+"/ModifyUser", "post");
        const formData = { userID: this.loginInfo.userID, passwd: this.state.passwd };
        manager.addFormData("data", formData);
        manager.addBinaryData("file1", { uri: this.state.cardImageURI, type: "image/jpeg", name: "file1" });
        let response = await manager.start();
        if (response.ok)
            return response.json();
    }

    //명함 사진 URL
    cardImageInfo = (cardImageURI) => {
        this.setState({ cardImageURI: cardImageURI });
        this.onValueChange();
    }

    // 명함 카메라로 이동
    goNamecardCameraScreen = () => {
        this.setState({ cardPopupMenuVisible: false });
        this.props.navigation.navigate('SignUpCamera', { onResultListener: this.cardImageInfo, cutImageStyle: "nameCard" });
    }
    // 명함 갤러리로 이동
    goNamecardGalleryScreen = () => {
        this.setState({ cardPopupMenuVisible: false });
        this.props.navigation.navigate('SignUpGallery', { onResultListener: this.cardImageInfo });
    }
    //명함 사진 삭제 함수
    removeCardImageClicked = () => {
        this.setState({ cardImageURI: "" });
        this.onValueChange();
    }

    //유효성 검사
    onValueChange = (value) => {
        this.setState(value, () => {
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
            if (this.state.cardImageURI == "") {
                isValidForm = false;
            }
            this.setState({ validForm: isValidForm });
        })

    }
    getViewSize = (event) => {
        this.photoCameraIcon.current.measure((fx, fy, width, height, px, py) => {
            this.modalPhotoCameraX = px + width - (width);
            this.modalPhotoCameraY = py + height - (height / 10);
        })
    }


    //명함 자세히보기
    cardImageModal = () => {
        this.setState({cardImageDetailVisible: !this.state.cardImageDetailVisible});
    }
    //사업자등록증 사진 자세히보기 
    companyImageModal = () => {
        this.setState({companyImageDetailVisible: !this.state.companyImageDetailVisible});
    }

    render() {
        return (
            <>
                {/*비밀번호 확인 후 내정보 접근 modal*/}
                <Modal
                    transparent={false}
                    visible={this.state.passwdConfirmModal}
                    onRequestClose={() => this.props.navigation.pop()}
                >
                    <ScrollView>
                        <View style={[inStyle.roundedBoxWrap,{paddingVertical:'6%'}]}>
                            <Text style={[template.titleText,{ color: '#4B89DC'}]}>비밀번호 확인</Text>
                            <Text style={[template.contentText,{color:'#888888'}]}>정보 수정을 위해 현재 비밀번호를 입력해주세요.</Text>

                            <View style={[inStyle.roundedBoxWrap,{ paddingHorizontal: '0%'}]}>
                                <View style={[template.roundedBox, { paddingVertical: '0%', borderWidth: 2 }]}>
                                    <Text>비밀번호</Text>
                                    <TextInput
                                        returnKeyType="done"
                                        onSubmitEditing={this.passwdOkButtonClicked}
                                        secureTextEntry={true}
                                        onChangeText={(value) => this.setState({ confirmPasswd: value })}
                                        value={this.state.confirmPasswd}
                                    />
                                </View>
                                {this.state.passwdError ? (
                                    <Text style={[template.contentText, { marginBottom: '-5%', color: "#FD9C91" }]}>
                                        * 비밀번호가 틀렸습니다.
                                    </Text>
                                ) : null}
                                <View style={{ flexDirection: 'row', marginTop: "7%" }}>
                                    <TouchableOpacity activeOpacity={0.8} style={inStyle.passwdConfirmButton} onPress={() => this.props.navigation.pop()}>
                                        <Text style={template.buttonText}>취소</Text></TouchableOpacity>
                                    <TouchableOpacity activeOpacity={0.8} style={[inStyle.passwdConfirmButton, { marginLeft: "2%" }]} onPress={this.passwdOkButtonClicked}>
                                        <Text style={template.buttonText}>확인</Text></TouchableOpacity>
                                </View>
                            </View>
                            <Text></Text><Text></Text><Text></Text>
                        </View>

                    </ScrollView>
                </Modal>

                {/*비밀번호 확인이 완료 되었으면 내정보 수정*/}
                {this.state.editProfileModal &&
                    <View style={template.baseContainer}>
                        <ScrollView
                            onScroll={event => {
                                this.getViewSize(event.nativeEvent.contentOffset.y)
                            }}
                        >

                            <View style={inStyle.roundedBoxWrap}>
                                <Text style={{fontSize:25,color:'black',fontWeight:'bold'}}>내정보 수정</Text>
                                <Text style={[template.contentText,{color:'#888888'}]}>수정을 위해 아래의 항목을 첨부해주세요.</Text>
                            </View>
                            <View style={[inStyle.roundedBoxWrap,{flexDirection:'row',justifyContent:'center'}]}>
                                {/*사업자 등록증 사진*/}
                                <View style={{alignItems:'center',marginRight:30}}>
                                    <Text style={[template.titleText,{fontSize:15}]}>사업자 등록증</Text>
                                    <TouchableOpacity onPress={this.companyImageModal}>
                                        <Image source={{ uri: this.state.companyNoImageURI }} style={inStyle.imageButton} />
                                    </TouchableOpacity>
                                </View>
                                {/*명함 사진*/}
                                <View style={{alignItems:'center'}}>
                                    <Text style={[template.titleText,{fontSize:15}]}>명함</Text>
                                    <View onLayout={(event) => { this.getViewSize(event) }} ref={this.photoCameraIcon}>
                                        {this.state.cardImageURI == "" ?
                                            (<TouchableOpacity style={inStyle.imageButton} onPress={() => this.setState({ cardPopupMenuVisible: true })}>
                                                <IconCamera name="image-inverted" size={60}></IconCamera>
                                            </TouchableOpacity>) :
                                            (<TouchableOpacity onPress={this.cardImageModal}>
                                                <Image source={{ uri: this.state.cardImageURI }} style={inStyle.imageButton} />
                                                <TouchableOpacity style={{top:-15,right:-15,position:'absolute'}} onPress={this.removeCardImageClicked}>
                                                    <IconDelete name="close-circle" color="black" size={27}></IconDelete>
                                                </TouchableOpacity>
                                            </TouchableOpacity>)}
                                    </View>
                                </View>
                            </View>

                            {/*명함 사진 자세히보기*/}
                            <Modal
                                visible={this.state.cardImageDetailVisible}
                                onRequestClose={this.cardImageModal}>
                                <View style={[template.baseContainer,{alignItems: 'center', justifyContent: 'center' }]}>
                                    <Image source={{ uri: this.state.cardImageURI }} style={{ width: "80%", height: "80%" }} />
                                </View>
                            </Modal>

                            {/*사업자등록증 사진 자세히보기*/}
                            <Modal
                                visible={this.state.companyImageDetailVisible}
                                onRequestClose={this.companyImageModal}>
                                <View style={[template.baseContainer,{alignItems: 'center', justifyContent: 'center' }]}>
                                    <Image source={{ uri: this.state.companyNoImageURI }} style={{ width: "80%", height: "80%" }} />
                                </View>
                            </Modal>

                            <View style={[template.roundedBox,{paddingHorizontal:'5%',borderWidth:0,paddingVertical:'8%'}]}>
                                <View style={inStyle.textInput}>
                                    <Text>사업자 등록번호</Text>
                                    <Text style={[template.smallText,{marginTop:'2%'}]}>{this.loginInfo.companyNo.slice(0, 3)}-{this.loginInfo.companyNo.slice(3, 5)}-{this.loginInfo.companyNo.slice(5, 10)}</Text>
                                </View>

                                <View style={inStyle.textInput}>
                                    <Text>비밀번호</Text>
                                    <TextInput
                                        ref={(c) => { this.passwordRef = c; }}
                                        returnKeyType="next"
                                        onSubmitEditing={() => { this.passwordokRef.focus(); }}
                                        onChangeText={(value) => this.onValueChange({ passwd: value })}
                                        //onEndEditing={(event) => this.onValueChange()}
                                        secureTextEntry={true}
                                    />
                                </View>

                                <View style={inStyle.textInput}>
                                    <Text>비밀번호 확인</Text>
                                    <TextInput
                                        ref={(c) => { this.passwordokRef = c; }}
                                        onChangeText={(value) => this.onValueChange({ passwordok: value })}
                                        //onEndEditing={(event) => this.onValueChange()}
                                        secureTextEntry={true}
                                    />
                                </View>
                                {this.state.passwdError == true ? (
                                    <Text style={[template.contentText, { color: "#FD9C91" }]}>
                                        * 비밀번호를 정확하게 입력해주세요.
                                    </Text>
                                ) : null}
                            </View>
                            {/*명함모달*/}
                            {this.state.cardPopupMenuVisible &&
                                <ImageSelectorPopup x={this.modalPhotoCameraX} y={this.modalPhotoCameraY}
                                    closeCameraPopupMenu={() => this.setState({ cardPopupMenuVisible: false })}
                                    goCameraScreen={this.goNamecardCameraScreen}
                                    goGalleryScreen={this.goNamecardGalleryScreen}
                                />
                            }

                        </ScrollView>
                        {this.state.validForm ?
                            (<TouchableOpacity onPress={this.goModifyUser} activeOpacity={0.8} style={template.activeButton}>
                                <Text style={template.buttonText}>수정완료</Text></TouchableOpacity>)
                            : (<TouchableOpacity activeOpacity={0.8} style={ template.inActiveButton}>
                                <Text style={template.buttonText}>수정완료</Text>
                            </TouchableOpacity>)}
                    </View>
                }
            </>
        )
    }
}
export default EditProfile;

const inStyle = StyleSheet.create({
    roundedBoxWrap:[template.roundedBox, { borderWidth: 0, paddingHorizontal: '5%',paddingVertical:'3%' }],
    passwdConfirmButton: [
        template.roundedBox,
        {
            flex: 1,
            height: '100%',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: "#4B89DC",
            borderRadius: 5,
            flexDirection: 'row',
            paddingHorizontal: '0%',
            paddingVertical: '0.5%',
            borderWidth: 0
        }
    ],
    textInput: [
        template.roundedBox,
        {
            marginTop:'0%',
            marginBottom: 15,
            height: 75,
            borderRadius: 10,
            borderColor: '#D1D1D1',
            borderWidth: 2,
            
        }
    ],
    imageButton: {
        width: 140,
        height: 120,
        backgroundColor: "#F1F1F3",
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 10,
    },
}); 