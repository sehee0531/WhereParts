import React, { Component } from 'react';
import {
    Text, View, TouchableOpacity, TextInput, ScrollView, Image, Modal, Alert,
    TouchableWithoutFeedback
} from 'react-native';

import { styles } from "../../styles/login/signup";

import AsyncStorage from "@react-native-async-storage/async-storage";

import IconCamera from 'react-native-vector-icons/Entypo';
import IconDelete from 'react-native-vector-icons/Ionicons';
import IconPopup from 'react-native-vector-icons/EvilIcons';

import Constant from "../../util/constatnt_variables";
import WebServiceManager from "../../util/webservice_manager";

class EditProfile extends Component {

    constructor(props) {
        super(props);
        this.passwordRef = React.createRef();
        this.passwordokRef = React.createRef();

        this.photoCameraIcon = React.createRef();
        this.modalPhotoCameraX = null;
        this.modalPhotoCameraY = null;

        this.imageLength = 1; //유효성

        this.loginInfo = { companyNo: null, passwd: null }

        this.state = {
            modal:true,
            
            validForm: false, //유효성
            companyNo: '',
            passwd: '',
            passwordok: '',
            cardPopupMenuVisible: false,  //명함 팝업메뉴
            companyNoImageURL: null,
            cardImageURL: null,

        }
    }

    componentDidMount() {
        this.getLoginInfo().then((value) => {
            this.loginInfo.userID = value.id;
            this.loginInfo.passwd = value.passwd;
            this.setState({companyNo:value.companyNo})
            console.log(this.state.companyNo)
            this.callGetCompanyImage().then((response) => {
                let reader = new FileReader();
                reader.readAsDataURL(response);
                reader.onloadend = () => {
                    this.setState({ companyNoImageURL: reader.result });
                }
            });
            this.callGetNamecardImage().then((response) => {
                let reader = new FileReader();
                reader.readAsDataURL(response);
                reader.onloadend = () => {
                    this.setState({ cardImageURL: reader.result });
                }
            });
        });
        
    }

    //사업자등록증 사진을 가져오는 API
    async callGetCompanyImage() {
        let manager = new WebServiceManager(Constant.serviceURL + "/GetCompanyImage", "post");
        manager.addFormData("data", {
            userID: this.loginInfo.userID, passwd: this.loginInfo.passwd, id: 2
        });
        //id는 나중에 열람하고자 하는 사용자 id로 바뀌어야함 
        let response = await manager.start();
        if (response.ok) {
            return response.blob();
        }
    }

    //명함 사진을 가져오는 API
    async callGetNamecardImage() {
        let manager = new WebServiceManager(Constant.serviceURL + "/GetNamecardImage", "post");
        manager.addFormData("data", {
            userID: this.loginInfo.userID, passwd: this.loginInfo.passwd, id: 2
        });
        //id는 나중에 열람하고자 하는 사용자 id로 바뀌어야함 
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

    //명함 버튼 클릭
    clickPhotoButton = () => {
        this.setState({ photoPopupMenuVisiable: true })
    }
    //명함 사진 URL
    cardImageInfo = (cardImageURI) => {
        this.setState({ cardImageURL: cardImageURI });
        this.imageLength++;
        this.onValueChange();
    }

    // 명함 카메라로 이동
    goPhotoCameraScreen = () => {
        this.setState({ photoPopupMenuVisiable: false });
        this.props.navigation.navigate('BusinessCardCamera', { onResultListener: this.cardImageInfo });
    }
    // 명함 갤러리로 이동
    goPhotoGalleryScreen = () => {
        this.setState({ photoPopupMenuVisiable: false });
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

    modal=()=>{
            this.setState({
              modal: !this.state.modal
            });
          
    }

    render() {
        return (
            <>
                {/*비밀번호 확인 후 내정보 접근 modal*/}
                <Modal
                    transparent={false}
                    visible={this.state.modal}
                >
                    <TouchableOpacity onPress={this.modal}><Text>확인 </Text></TouchableOpacity>
                </Modal>
               
                <View style={styles.total_container}>
                    <ScrollView
                        onScroll={event => {
                            this.getViewSize(event.nativeEvent.contentOffset.y)
                        }}
                    >
                        <View style={styles.container}>
                            <View style={styles.header_textLayout_view}>
                                <Text style={[styles.default_text, styles.main_title_text]}>필수 항목 첨부</Text>
                                <Text style={[styles.default_text, styles.login_guide_text]}>서비스 이용을 위해 아래의 항목을 첨부해주세요.</Text>
                                <Text style={[styles.default_text, styles.login_guide_text]}>등록한 사업자 등록증과 명함 확인 후 승인이 완료됩니다.</Text>
                            </View>
                            <View style={styles.imageRegister_btnLayout_view}>
                                <View style={styles.imageRegister_btn_view}>
                                    <Text style={[styles.default_text, styles.imageRegister_title_text]}>사업자 등록증</Text>
                                    <TouchableOpacity style={styles.imageRegister_btn}>
                                        <Image source={{ uri: this.state.companyNoImageURL }} style={styles.imageRegister_image_view} />
                                    </TouchableOpacity>
                                </View>
                                <View style={styles.imageRegister_btn_view}>
                                    <Text style={[styles.default_text, styles.imageRegister_title_text]}>명함</Text>
                                    <View onLayout={(event) => { this.getViewSize(event) }} ref={this.photoCameraIcon}>
                                        {this.state.cardImageURL == "" ?
                                           (<TouchableOpacity style={styles.imageRegister_btn} onPress={() => this.setState({ cardPopupMenuVisible: true })}>
                                                <IconCamera name="image-inverted" size={60}></IconCamera>
                                            </TouchableOpacity>): (<TouchableOpacity style={styles.imageRegister_btn}>
                                                <Image source={{uri: this.state.cardImageURL }} style={styles.imageRegister_image_view} />
                                                <TouchableOpacity style={styles.imageDelete_btn} onPress={this.photoRemoveClicked}>
                                                    <IconDelete name="close-circle" color="black" size={27}></IconDelete>
                                                </TouchableOpacity>
                                            </TouchableOpacity>) 
                                        }
                                    </View>
                                </View>
                            </View>

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
                                    <Text style={{marginTop:"2%",fontSize:15}}>{this.state.companyNo.slice(0, 3)}-{this.state.companyNo.slice(3, 5)}-{this.state.companyNo.slice(5, 10)}</Text>
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
                            </View>
                        </View>
                    </ScrollView>
                    {this.state.validForm ?
                        (<TouchableOpacity activeOpacity={0.8} style={[styles.default_btn, styles.enable_btn]} onPress={this.upload}>
                            <Text style={[styles.default_text, styles.signup_btn_text]}>수정완료</Text></TouchableOpacity>)
                        : (<TouchableOpacity activeOpacity={0.8} style={[styles.default_btn, styles.disable_btn]}>
                            <Text style={[styles.default_text, styles.signup_btn_text]}>수정완료</Text>
                        </TouchableOpacity>)}
                </View>
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