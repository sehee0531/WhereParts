import React, { Component } from 'react';
import { Text, View, TouchableOpacity, TextInput, ScrollView, Image,Modal, Alert,
TouchableWithoutFeedback, Keyboard } from 'react-native';

import { styles } from "../styles/login/signup";

import IconCamera from 'react-native-vector-icons/Entypo';
import IconDelete from 'react-native-vector-icons/Ionicons';
import IconPopup from 'react-native-vector-icons/EvilIcons';

import Constant from "../util/constatnt_variables";
import WebServiceManager from "../util/webservice_manager";

class SignUp extends Component {

    constructor(props) {
        super(props);
        this.passwordRef = React.createRef();
        this.passwordokRef = React.createRef();
        this.registerCameraIcon=React.createRef();
        this.photoCameraIcon=React.createRef();
        
        this.modalRegisterCameraX=null;
        this.modalRegisterCameraY=null;
        this.modalPhotoCameraX=null;
        this.modalPhotoCameraY=null;

        this.imageLength = 0; //유효성

        this.state = {
            validForm : false, //유효성
            companyNo: '',
            passwd: '',
            passwordok: '',

            companyPopupMenuVisible:false,  //사업자등록증 팝업메뉴
            cardPopupMenuVisible:false,  //명함 팝업메뉴
            
            companyImageURI: '', 
            nameCardImageURI:'',
            
        }
    }

    componentDidMount() {
        this.keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', this.keyboardDidShow);
        this.keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', this.keyboardDidHide);
    }

    componentWillUnmount() {
        this.keyboardDidShowListener.remove();
        this.keyboardDidHideListener.remove();
        //BackHandler.removeEventListener("hardwareBackPress", this.backPressed);
    }

    makeBinaryData() {
        let imageData = []; 
            //사업자등록번호
            const uri = this.state.companyImageURI; 
            const companyNoData = {
                uri: uri,
                type: "image/jpeg",
                name: 'photo.jpg',
            }
            imageData.push(companyNoData);
            //명함
            const carduri = this.state.nameCardImageURI;
            const cardData = {
                uri: carduri,
                type: "image/jpeg",
                name: 'photo.jpg',
            }
            imageData.push(cardData);
        return imageData;
    }

    goAddUser = () => { 
        if (this.state.passwd !== this.state.passwordok) {
            Alert.alert("비밀번호가 일치하지 않습니다");
        }
        else {
            const imageData = this.makeBinaryData();
            this.callAddUserAPI(imageData).then((response) => {
                console.log(response);
                if (response.success == "0") {
                    Alert.alert("이미 있는 사업자번호입니다");
                }
                else {
                    Alert.alert('가입 신청 완료', '입력 된 내용 확인 후 승인이 완료됩니다.', [
                        { text: '확인', onPress: () => { this.props.navigation.navigate("Login") } },
                    ]);
                    //this.setState({ modal: this.state.modal ? false : true }); //신청대기 모달

                }
            })
        }
    }


    //사업자 등록증, 명함 이미지와 사업자등록 번호와 패스워드를 서버로 전송하여 사용자 추가 요청
    async callAddUserAPI(imageData) { 
        let manager = new WebServiceManager(Constant.serviceURL + "/AddUser", "post");
        manager.addBinaryData("file1", imageData[0]); //사업자번호
        manager.addBinaryData("file2", imageData[1]); //명함
        
        manager.addFormData("data", {
            companyNo:this.state.companyNo.replaceAll('-',''), passwd: this.state.passwd,
        });
        console.log(this.state.companyNo);
        let response = await manager.start();
        if (response.ok) {
            return response.json();
        }
    }
    
    
     //사업자등록증 이미지 클릭시 (카메라/갤러리 선택 팝업메뉴 띄움)
    companyImageClicked = () => {
        this.setState({companyPopupMenuVisible:true})    
    }

   //명함 이미지 버튼 클릭 (카메라/갤러리 선택 팝업메뉴 띄움)
    nameCardImageClicked=()=>{
        this.setState({cardPopupMenuVisible:true})
    }

    //사업자 등록증 이미지 선택을 위한 카메라로 이동
    goCompanyCameraScreen=()=>{
        this.setState({companyPopupMenuVisible:false});
        this.props.navigation.navigate('CompanyCamera',{onResultListener:this.companyImageInfo});
    }

    //사업자 등록증 이미지 선택을 위한 갤러리로 이동
    goCompanyGalleryScreen = () => {
        this.setState({companyPopupMenuVisible:false});
        //this.props.navigation.navigate('Gallery', { companyImageInfoListener:this.companyImageInfo })
        this.props.navigation.navigate('RegisterGallery', { onResultListener:this.companyImageInfo });   
    }    

    // 명함 이미지 선택을 위한 카메라로 이동
    goNamecardCameraScreen=()=>{
        this.setState({cardPopupMenuVisible:false});
        this.props.navigation.navigate('BusinessCardCamera',{onResultListener: this.cardImageInfo});
    }
    // 명함 이미지 선택을 위한 갤러리로 이동
    goNamecardGalleryScreen = () => { 
        this.setState({cardPopupMenuVisible:false}); 
        this.props.navigation.navigate('PhotoGallery', {onResultListener: this.cardImageInfo}) 
    }

    
    //사업자 등록증 이미지 선택 후 (카메라로부터 인식된 사업자등록번호와 imageURI 받음)
    companyImageInfo=(companyNo,imageURI)=>{
        if(companyNo==="0") {
            this.setState({companyImageURI:imageURI});
            Alert.alert('사업자 인식', '사업자 등록번호를 인식하지 못했습니다. 직접 입력하세요', [
                { text: '확인', onPress: () => {this.setState({companyNo:""})}}]);
        }
        else
            this.setState({companyNo:companyNo,companyImageURI:imageURI})
        this.imageLength++;
        this.onValueChange();
    }

    
    //카메라 또는 갤러리에서 선택된 명함 이미지 URI
    cardImageInfo=(imageURI)=>{
        this.setState({nameCardImageURI:imageURI});
        this.imageLength++;
        this.onValueChange();
    }

    //사업자 등록증 이미지 삭제시
    companyImageRemoveClicked=()=>{
        this.setState({companyImageURI:""});
        this.imageLength--;
        this.onValueChange();
    }

    //명함 이미지 삭제시
    nameCardImageRemoveClicked=()=>{
        this.setState({nameCardImageURI:""});
        this.imageLength--;
        this.onValueChange();
    }

    onValueChange=()=>{
        let isValidForm=true;
      
        if(this.state.companyNo.trim().length == 0){ // 조건 필요시 추가
            isValidForm=false;
        }
        if(this.state.passwd.trim().length == 0){
            isValidForm=false;
        }      
        if(this.state.passwordok.trim().length == 0){
            isValidForm=false;
        }
        if(this.imageLength < 2 ){
            isValidForm = false;
        }
        console.log("imageLength", this.imageLength);
        console.log("isValidForm", isValidForm);
        this.setState({validForm:isValidForm});
    }

    
    getViewSize=(event)=>{
        this.registerCameraIcon.current.measure((fx,fy,width,height,px,py)=>{
            this.modalRegisterCameraX=px+width-(width);
            this.modalRegisterCameraY=py+height-(height/10);
            //console.log('location:',fx,fy,width,height,px,py)
        })

        this.photoCameraIcon.current.measure((fx,fy,width,height,px,py)=>{
            this.modalPhotoCameraX=px+width-(width);
            this.modalPhotoCameraY=py+height-(height/10);
           // console.log('location:',fx,fy,width,height,px,py)
        })
    }

    keyboardDidShow = () => {
        console.log('Keyboard Shown');
    }

    keyboardDidHide = () => {
        console.log('Keyboard Hide');
        this.onValueChange();
    }

    render() {
        return (
            <>
                <View style={styles.total_container}>
                    <ScrollView onScroll={event=>{this.getViewSize(event)}}>
                        <View style={styles.container}>
                            <View style={styles.header_textLayout_view}>
                                <Text style={[styles.default_text,styles.main_title_text]}>필수 항목 첨부</Text>
                                <Text style={[styles.default_text,styles.login_guide_text]}>서비스 이용을 위해 아래의 항목을 첨부해주세요.</Text>
                                <Text style={[styles.default_text,styles.login_guide_text]}>등록한 사업자 등록증과 명함 확인 후 승인이 완료됩니다.</Text>
                            </View>
                            <View style={styles.imageRegister_btnLayout_view}>
                                <View style={styles.imageRegister_btn_view}>
                                    <Text style={[styles.default_text,styles.imageRegister_title_text]}>사업자 등록증</Text>

                                    <View onLayout={(event)=>{this.getViewSize(event)}} ref={this.registerCameraIcon}>
                                        {this.state.companyImageURI=="" ? 
                                        (<TouchableOpacity style={styles.imageRegister_btn} onPress={()=>this.setState({companyPopupMenuVisible:true})}>
                                            <IconCamera name="image-inverted" size={60}></IconCamera>
                                        </TouchableOpacity>):
                                        (<TouchableOpacity style={styles.imageRegister_btn}>
                                            <Image source={{ uri: this.state.companyImageURI }} style={styles.imageRegister_image_view}/>
                                            <TouchableOpacity  style={styles.imageDelete_btn} onPress={this.companyImageRemoveClicked}>
                                                    <IconDelete name="close-circle" color="black" size={27}></IconDelete>
                                             </TouchableOpacity>
                                        </TouchableOpacity>)
                                        }
                                    </View>

                                </View>
                                <View style={styles.imageRegister_btn_view}>
                                    <Text style={[styles.default_text,styles.imageRegister_title_text]}>명함</Text>

                                    <View onLayout={(event)=>{this.getViewSize(event)}} ref={this.photoCameraIcon}>
                                    {this.state.nameCardImageURI=="" ? 
                                        (<TouchableOpacity style={styles.imageRegister_btn} onPress={()=>this.setState({cardPopupMenuVisible:true})}>
                                            <IconCamera name="image-inverted" size={60}></IconCamera>
                                        </TouchableOpacity>):
                                        (<TouchableOpacity style={styles.imageRegister_btn}>
                                            <Image source={{ uri: this.state.nameCardImageURI }} style={styles.imageRegister_image_view}/>
                                            <TouchableOpacity style={styles.imageDelete_btn} onPress={this.nameCardImageRemoveClicked}>
                                                <IconDelete name="close-circle" color="black" size={27}></IconDelete>
                                            </TouchableOpacity>
                                        </TouchableOpacity>)}
                                    </View>
                                </View>
                            </View>
                          
                           
                            {/*사업자등록증 모달*/}
                            <Modal 
                                animationType='fade' 
                                transparent={true} 
                                visible={this.state.companyPopupMenuVisible}
                                onRequestClose={() => this.setState({ companyPopupMenuVisible:false})}
                            >
                            <PopupMenu x={this.modalRegisterCameraX} y={this.modalRegisterCameraY} 
                            closeModal={() => this.setState({ companyPopupMenuVisible:false})}
                            goCamera={this.goCompanyCameraScreen} goGallery={this.goCompanyGalleryScreen} />
                            </Modal>

                            {/*명함모달*/}
                            <Modal 
                                animationType='fade' 
                                transparent={true} 
                                visible={this.state.cardPopupMenuVisible}
                                onRequestClose={() => this.setState({ cardPopupMenuVisible:false})}
                            >
                            <PopupMenu x={this.modalPhotoCameraX} y={this.modalPhotoCameraY} 
                            closeModal={() => this.setState({ cardPopupMenuVisible:false})}
                            goCamera={this.goNamecardCameraScreen} goGallery={this.goNamecardGalleryScreen} />
                            </Modal>

                            <View style={styles.textInputLayout_view}>
                                <View style={styles.textInput_view}>
                                    <Text>사업자 등록번호</Text>
                                    <TextInput 
                                        ref={(c) => { this.regnumRef = c; }}
                                        returnKeyType="next"
                                        onSubmitEditing={()=>{this.passwordRef.focus();}}
                                        onChangeText={(value) => this.setState({companyNo: value})}
                                        onEndEditing={(event)=>this.onValueChange()}
                                        value={this.state.companyNo.replaceAll('-','')}
                                    />
                                </View>
                              
                              <View style={styles.textInput_view}>
                                <Text>비밀번호</Text>
                                <TextInput 
                                    ref={(c) => { this.passwordRef = c; }}
                                    returnKeyType="next"
                                    onSubmitEditing={()=>{this.passwordokRef.focus();}}
                                    onChangeText={(value)=>this.setState({passwd:value})}
                                    onEndEditing={(event)=>this.onValueChange()}
                                    secureTextEntry={true}
                                />
                                </View>

                                <View style={styles.textInput_view}>
                                <Text>비밀번호 확인</Text>
                                <TextInput 
                                    ref={(c) => { this.passwordokRef = c; }}
                                    onChangeText={(value)=>this.setState({passwordok:value})}
                                    onEndEditing={(event)=>this.onValueChange()}
                                    secureTextEntry={true}
                                />
                                </View>
                            </View>
                        </View>
                    </ScrollView>
                    {this.state.validForm ? 
                    (<TouchableOpacity activeOpacity={0.8} style={[styles.default_btn,styles.enable_btn]} onPress={this.goAddUser}>
                        <Text style={[styles.default_text,styles.signup_btn_text]}>회원가입 신청</Text></TouchableOpacity>)
                        :(<TouchableOpacity activeOpacity={0.8} style={[styles.default_btn,styles.disable_btn]}>
                        <Text style={[styles.default_text,styles.signup_btn_text]}>회원가입 신청</Text>
                    </TouchableOpacity>)}
                </View>
            </>
        )
    }
}

class PopupMenu extends Component{
    constructor(props){
        super(props);
    }
    
    render(){
        const layout={flex:1 ,left:this.props.x,top:this.props.y};
        return(
            <>
             <TouchableOpacity onPress={this.props.closeModal} style={{flex:1}}>
                <View style={layout} >
                    <TouchableWithoutFeedback>
                    <View style={styles.camera_modal_view}>
                        <View style={styles.camera_view}>
                            <TouchableOpacity  onPress={this.props.goCamera}>
                                <View style={{flexDirection:'row'}}>
                                <IconPopup name="camera" size={25} color={'black'} ></IconPopup>
                                <Text style={styles.modal_text}>카메라   </Text>   
                                </View>
                            </TouchableOpacity>
                        </View>
                        <View style={styles.gallery_view}>
                            <TouchableOpacity onPress={this.props.goGallery}>
                            <View style={{flexDirection:'row'}}>
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

export default SignUp;