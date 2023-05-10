import React, { Component } from 'react';
import {
    Button, Text, View, TouchableOpacity, TextInput, 
    Image, ImageBackground, Modal, Alert, BackHandler, NativeModules, Keyboard, StyleSheet, SafeAreaView,
    Dimensions
} from 'react-native';
import { ScrollView, FlatList } from 'react-native-gesture-handler';

import { template,colors } from "../../styles/template/page_style";
 
import IconCamera from 'react-native-vector-icons/Feather';
import IconMark from 'react-native-vector-icons/AntDesign';
import IconDelete from 'react-native-vector-icons/Ionicons';
import IconRadio from 'react-native-vector-icons/MaterialIcons';
import IconPopup from 'react-native-vector-icons/EvilIcons';
import QuantityEditIcon from 'react-native-vector-icons/Feather';

import { Picker } from '@react-native-picker/picker';
import Constant from "../../util/constatnt_variables";
import WebServiceManager from "../../util/webservice_manager";
import ImageSelectorPopup from '../../util/popup_image_selector';
import Indicator from '../../util/indicator';

import Session from '../../util/session';
import FunctionUtil from '../../util/libraries_function';


class AddGoods extends Component {

    #hashTagLength;
    #imageLength;
    
    constructor(props) {
        super(props);

        this.#hashTagLength = 7;
        this.#imageLength = 5;
        this.nameRef = React.createRef();
        this.numberRef = React.createRef();
        this.priceRef = React.createRef();
        this.hashTagRef = React.createRef();
        this.cameraIcon = React.createRef();

        // 팝업메뉴위치
        this.cameraModalX = null;
        this.cameraModalY = null;
        this.userID="";

        //상수 가져오기
        this.qualityValueText = Constant.getGoodsQuality();
        this.genuineValueText = Constant.getGoodsGenuine();

        //안드로이드에서 정의한 모듈 가져옴
        const { ImageModule } = NativeModules;
        this.imageModule = ImageModule;

        this.state = {
            name: '',
            number: '',
            price: 0,
            tagName: '',
            hashTag: [],
            quantity: 1,
            quality: 1, //상품상태
            genuine: 1,//정품, 비정품
            spec: "", //상품설명

            //goodsState:1, //상품상태
            //goodsGenuine:1, //비정품or정품

            check_genuine: true,
            check_non_genuine: false,
            allhashTag: "",

            addGoodsButtonVisible: false,  //상품등록 버튼 on/off 
            imageSelectorPopupModalVisible: false, //이미지 선택 버튼 팝업메뉴 모달 on/off

            confirmModalVisible: false, // 상품등록 확인창 모달 on/off 
            largeImageModalVisible: false, // 이미지 크게보기 모달
            indicator :false,

            selectedImageIndex: 0, // selectedImageIndex
            imageURIs: [],
        }
    }


    componentDidMount() {
        this.keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', this.keyboardDidShow);
        this.keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', this.keyboardDidHide);

        this.userID=Session.getUserID();
    }
    componentWillUnmount() {
        this.keyboardDidShowListener.remove();
        this.keyboardDidHideListener.remove();
    }

    // 상품등록 확인창에서 확인버튼을 눌렀을 때 호출되는 함수(이미지들의 사이즈를 줄이고, AddGoodsAPI호출)
    goAddGoodsButtonClicked = () => { 
        this.setConfirmModal(false);
        this.setState({indicator:true});
        this.getResizingImageDatas(this.state.imageURIs).then((imageDatas)=> {
            console.log('image data = ',imageDatas);            
            this.callAddGoodsAPI(imageDatas).then((response) => {
                console.log(response);
                this.setState({indicator:false});
                if (response.success == 1) {                    
                    Alert.alert('알림','상품등록이 성공되었습니다', [
                        { text: '확인', onPress: () => { this.props.navigation.navigate("Home") } },
                    ]);
                    for (let i = 0; i < imageDatas.length; i++) {
                        this.imageModule.deleteImage(imageDatas[i].uri, (message) => {
                            console.log('이미지 삭제 실패',message);
                        }, (message) => {
                            console.log('이미지 삭제 성공',message);
                        });
                    }
                }
                else {
                    Alert.alert("알림","상품등록이 실패하였습니다.");    
                }
            })
        });
    }

    //여러개의 이미지 uri로 이미지 사이즈를 줄인 uri를 imageData 객체로 만듬
    async getResizingImageDatas(uris) {
        let fileDatas = await this.getResizingImageUris(uris).then((resizedUris)=> {
            let fileDatas=[];
            for(let i=0;i<resizedUris.length;i++) {
                fileDatas.push(this.getImageData(resizedUris[i]));
            }
            return fileDatas;
        });
        return fileDatas;
    }

    //이미지 uri로 서버로 전송 가능한 Binary 객체 만들기
    getImageData(uri) {
        const fileData = {
            uri: uri,
            type: "image/jpeg",
            name: 'photo.jpg',
        }
        return fileData;
    }

    //여러개의 선택한 이미지 uri를 파라메터로 넘겨주고 해당사이즈만큼 줄인 이미지 uri를 받아옴 (4=1/4사이즈로 줄임)
    async getResizingImageUris(uris) {
        let resizedURI = await this.imageModule.getReduceImageUris(uris,4);
        return resizedURI;
    }

    // 사진 첨부를 위한 버튼 클릭시 (지정한 첨부 가능한 이미지 갯수 초과하면 Alert)
    cameraButtonClicked = () => {
        if (this.state.imageURIs.length == this.#imageLength) {
            Alert.alert('알림','이미지는 최대 5장까지 선택할 수 있습니다.');
        }
        else {
            this.setState({ imageSelectorPopupModalVisible: true })
        }
    }

    //카메라, 갤러리에서 이미지 받아오는 함수(촬영한 사진이나 갤러리에서 선택한 이미지 여러장을 화면에 rendering)
    getImageURIs = (imageURIs) => {
        console.log('selected image uris=',imageURIs);
        this.onValueChange({imageURIs: this.state.imageURIs.concat(imageURIs)});
    }
  
    //이미지 삭제 버튼
    removeImage = (index) => {
        this.onValueChange({imageURIs: this.state.imageURIs.filter((value, indexNum) => indexNum !== index)});
    };

    //이미지 uri를 blob으로 변환, 호출하는 쪽에서 .size 하면 이미지 용량 체크 가능
    async getImageInfo(uri) {
        const response = await fetch(uri);
        const blob = await response.blob();
        return blob;
    }

    // 이미지 이용하여 품번 인식하는 함수
    detectPartsNo = (imageURI) => {
        this.callDetectPartsNoAPI(imageURI).then((response) => {
            if (response.success === "1") {
                const partsNo = response.texts[0].replaceAll(" ", "");
                this.setState({ number: partsNo });
            }
            else {
                Alert.alert('부품번호 인식', '부품번호를 인식하지 못했습니다. 직접 입력하세요', [
                    { text: '확인', onPress: () => { this.setState({ number: "" }) } }]);
            }

            this.imageModule.deleteImage(imageURI, (imageURI) => {
                console.log(imageURI);
            }, (imageURI) => {
                console.log("delete success", imageURI);
            });
        });
    }

    //카메라로 이동 (osResultLstener=카메라로 찍은 이미지 uri들을 가져와 처리하는 함수 )
    goCameraScreen = () => {
        this.setState({ imageSelectorPopupModalVisible: false });
        this.props.navigation.navigate("GoodsImageCamera", { onResultListener:this.getImageURIs, imageLength:this.state.imageURIs.length });
    }
    //갤러리로 이동 (osResultLstener=갤러리에서 선택한 이미지 uri들을 가져와 처리하는 함수 )
    goGalleryScreen = () => {
        this.setState({ imageSelectorPopupModalVisible: false });
        this.props.navigation.navigate("Gallery", { onResultListener:this.getImageURIs, imageLength:this.state.imageURIs.length });
    }

    // 품번인식 카메라로 이동
    goDetectPartsNoCamera = () => {
        this.props.navigation.push("PartsNoCamera", { onResultListener:this.detectPartsNo });
    }

    //해시태그 추가버튼을 누를때
    addHashTag = () => {
        const tagNames=this.state.tagName.split(' ');
    
        if(tagNames.slice(-1)[0]==''){
            tagNames.splice(tagNames.length-1)
        }
        if (this.state.hashTag.length < this.#hashTagLength && tagNames.length < this.#hashTagLength && this.state.hashTag.length+tagNames.length<8) {
            /*this.addHashTag(tagNames).then(()=>{
                this.onValueChange();
            });*/
            this.onValueChange({hashTag: this.state.hashTag.concat(tagNames)});
        }
        else {
            this.setState({ hashTagError: false })
        }

        this.state.tagName = ""
        this.hashTagRef.clear();
    }
    //해시태그 특수문자 입력시 제거
    hashTagOnChangeText=(value)=>{
        const reg = /[\{\}\[\]\/?.,;:|\)*~`!^\-_+<>@\#$%&\\\=\(\'\"]/;
        let newTagName=value.replace(reg,'')
        this.setState({ tagName: newTagName})
    }


    //해시태그 삭제할 때
    removeHashTag = (index) => {
        /*this.removeHashTag(index).then(()=>{
            this.onValueChange();
        });*/
        this.onValueChange({hashTag: this.state.hashTag.filter((_, indexNum) => indexNum !== index)});
    }

    // -버튼 클릭
    minusNum = () => {
        if (this.state.quantity <= 1) {
            this.setState({ quantity: 1 })
        }
        else {
            this.setState({ quantity: this.state.quantity - 1 });
        }
    }

    //정품 클릭
    genuineCheck = () => {
        this.setState({ check_genuine: true, check_non_genuine: false, genuine: 1 });
    }
    //비정품 클릭
    non_genuineCheck = () => {
        this.setState({ check_non_genuine: true, check_genuine: false, genuine: 2 });
    }

    //상품 등록 확인 모달 보임/숨김
    setConfirmModal=(value) => {
        this.setState({confirmModalVisible:value});
    }

    //상품등록하기 버튼활성화 조건
    onValueChange = (value) => {
        this.setState(value, () => {
            let isValidForm = true;

            if (this.state.number.trim().length == 0) { // 조건 필요시 추가
                isValidForm = false;
            }
            if (this.state.name.trim().length == 0) {
                isValidForm = false;
            }
            if (this.state.price.length == 0) {
                isValidForm = false;
            }
            if (this.state.price <= 0) {
                isValidForm = false;
            }
            if (this.state.hashTag.length == 0) {
                isValidForm = false;
            }
            if (this.state.imageURIs.length == 0) {
                isValidForm = false;
            }
            /*if (this.state.spec.trim().length == 0) {
                isValidForm = false;
            }*/

            console.log("해시태그 길이", this.state.hashTag.length)
            this.setState({ addGoodsButtonVisible: isValidForm });
        });
    }

    //Web Service 시작
    // 이미지와 데이터를 서버로 보내주는 API
    async callAddGoodsAPI(imageData) {
        const {name,number,allhashTag,quantity,quality,genuine,spec} = this.state;
        const price = parseInt(this.state.price.toString().replace(/,/g, ''));
        let manager = new WebServiceManager(Constant.serviceURL + "/AddGoods", "post");
        filenames = []; //"file1","file2" ... 파일 이름들을 넣어줄 배열

        for (let i = 0; i < imageData.length; i++) { //리턴받은 이미지 객체 배열의 길이만큼 반복
            filenames.push("file" + (i + 1)); // 파일 이름들을 배열에 넣어줌
            manager.addBinaryData("file" + (i + 1), imageData[i]); //addBinaryData에 앞에는 이미지의 이름들 뒤에는 이미지 객체가 들어있는 배열
        }
        for (let i = 0; i < this.state.hashTag.length; i++) {
            this.state.allhashTag += this.state.hashTag[i] + ","
        }

        manager.addFormData("data", {
            userID:this.userID, name:name, number:number, price:price, hashTag: this.state.allhashTag.replace(/,\s*$/, ""), quantity:quantity,
            quality:quality, genuine:genuine, spec:spec, filenames:filenames
        });

        let response = await manager.start();
        if (response.ok) {
            return response.json();
        }
    }

    //사진으로부터 품번 인식 서비스 API
    async callDetectPartsNoAPI(imageURI) {
        let manager = new WebServiceManager(Constant.externalServiceURL + "/api/paper/DetectTexts", "post");
        manager.addBinaryData("file", {
            uri: imageURI,
            type: "image/jpeg",
            name: "file"
        });
        let response = await manager.start();
        if (response.ok)
            return response.json();
    }
    //Web Service 끝

    //UI관련
    //큰이미지뷰 모달 on/off 및 선택된 이미지 인덱스
    setLargeImageModal = (index) => {
        this.setState({
            largeImageModalVisible: !this.state.largeImageModalVisible,
            selectedImageIndex: index
        })
    };
    //카메라,앨범선택 버튼 위치
    getViewSize = () => {
        this.cameraIcon.current.measure((fx, fy, width, height, px, py) => {
            this.cameraModalX = px + width - (width / 3);
            this.cameraModalY = py + height - (height / 2);
            //console.log('location:', fx, fy, width, height, px, py)
        })
    }
    //뒤로가기 했을 때 앱 종료
    backPressed = () => {
        Alert.alert(
            '상품등록을 취소하시겠습니까?',
            '작성한 모든 내용이 삭제됩니다',
            [
                { text: '취소', onPress: () => console.log('Cancel Pressed'), style: 'cancel' },
                { text: '확인', onPress: () => this.props.navigation.navigate('Home') },
            ],
            { cancelable: false });
        return true;
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
                <View style={template.baseContainer}>
                    <ScrollView
                        onScroll={event => {
                            this.getViewSize(event.nativeEvent.contentOffset.y);
                        }}
                        showsVerticalScrollIndicator={false}>
                        <View style={template.container}>
                            {/*상품 이미지 등록을 위한 버튼 */}
                            <View style={[template.roundedBox]}>
                                <Text style={template.largeText}>사진등록 (최소 1개)</Text>
                                <View style={{flexDirection:'row'}}>
                                    <IconMark name="exclamationcircleo" size={15}></IconMark>
                                    <Text style={template.contentTitleText}>  등록한 첫번째 사진이 대표이미지로 등록됩니다.</Text>
                                </View>
                                <View style={{marginBottom: '2%', flexDirection:'row' }}>
                                    <View onLayout={(event) => { this.getViewSize(event) }} ref={this.cameraIcon}>
                                        <TouchableOpacity style={inStyle.cameraButton} onPress={this.cameraButtonClicked}>
                                            <IconCamera name="camera" size={30} color={colors.dark}></IconCamera>
                                            <Text><Text style={{ color: colors.main }}>{this.state.imageURIs.length}</Text>/{this.#imageLength}</Text>
                                        </TouchableOpacity>
                                    </View>

                                    {/*카메라 또는 갤러리에서 선택한 이미지 보여주기 (작은 사이즈) */}
                                    <SmallImageViewer
                                        items={this.state.imageURIs}
                                        largeImageModal={(index) => this.setLargeImageModal(index)}
                                        removeImage={(index) => this.removeImage(index)} />
                                </View>
                            </View>

                            {/* 상품정보 부분 */}
                            <View style={template.roundedBox}>
                                <Text style={[template.largeText,{marginBottom:'2%'}]}>상품 정보</Text>
                                {/*부품번호 */}
                                <View style={[template.roundedBox,{paddingVertical:'0%'}]}>
                                    <View style={{flexDirection:'row'}}>
                                        <View style={{flex:6}}>
                                            <Text style={template.contentTitleText}>부품번호</Text>
                                            <TextInput
                                                style={template.inputText}
                                                ref={(c) => { this.numberRef = c; }}
                                                returnKeyType="next"
                                                onSubmitEditing={() => { this.nameRef.focus(); }}
                                                onChangeText={(value) => this.onValueChange({ number: value })}
                                                value={this.state.number} // 띄워지는값
                                            />
                                        </View>
                                        <View style={{flex:1,alignItems:'center',justifyContent:'center'}}>
                                            <TouchableOpacity style={template.smallButton} onPress={this.goDetectPartsNoCamera} >
                                                <IconCamera name="camera" size={25} color={colors.white}></IconCamera>
                                            </TouchableOpacity>
                                        </View>
                                    </View>
                                </View>

                                {/* 제목*/}
                                <View style={[template.roundedBox,{paddingVertical:'0%'}]}>
                                    <Text style={template.contentTitleText}>상품명</Text>
                                    <TextInput
                                        style={template.inputText}
                                        ref={(c) => { this.nameRef = c; }}
                                        returnKeyType="next"
                                        onSubmitEditing={() => { this.priceRef.focus(); }}
                                        onChangeText={(value) => this.onValueChange({ name: value })}
                                    />
                                </View>

                                {/* 판매금액 */}
                                <View style={[template.roundedBox,{paddingVertical:'0%'}]}>
                                    <Text style={template.contentTitleText}>판매 금액 (개당)</Text>
                                    <View style={{ flexDirection: 'row',alignItems:'center' }}>
                                        <TextInput
                                            style={[template.inputText, {width:"95%", textAlign: 'right'}]}
                                            ref={(c) => { this.priceRef = c; }}
                                            onSubmitEditing={() => { this.hashTagRef.focus(); }}
                                            keyboardType="number-pad"
                                            onChangeText={(value) => this.onValueChange({ price: value })}
                                        >{FunctionUtil.getPrice(this.state.price)}</TextInput>
                                        <View>
                                            <Text style={[template.smallText,{color:colors.dark}]}>원</Text>
                                        </View>
                                    </View>
                                </View>

                                {/* 판매수량 */}
                                <View style={[template.roundedBox, { flexDirection: 'row',flex:1,alignItems:'center' }]}>
                                    <Text style={template.contentTitleText}>판매 수량</Text>
                                    <View style={inStyle.countingBoxWrap}>
                                        <View style={inStyle.countingBox}>
                                            <TouchableOpacity activeOpacity={0.8} onPress={this.minusNum} >
                                                <QuantityEditIcon name='minus' color='black' size={15}></QuantityEditIcon>
                                            </TouchableOpacity>
                                        </View>
                                        <View style={inStyle.countingBox}>
                                            <Text>{this.state.quantity}</Text>
                                        </View>
                                        <View style={inStyle.countingBox}>
                                            <TouchableOpacity activeOpacity={0.8} onPress={() => { this.setState({ quantity: this.state.quantity + 1 }) }}>
                                                <QuantityEditIcon name='plus' color='black' size={15}></QuantityEditIcon>
                                            </TouchableOpacity>
                                        </View>
                                    </View>
                                </View>
                            </View>

                            <View style={template.roundedBox}>
                                <Text style={[template.largeText]}>기타 정보</Text>
                                 {/*정품/비정품*/}
                                <View style={[template.roundedBox, { flexDirection: 'row', flex: 1, alignItems: 'center' }]}>
                                    <Text style={template.contentTitleText}>정품 인증</Text>
                                    <View style={{paddingLeft:'10%'}}>
                                        <TouchableOpacity activeOpacity={0.8} onPress={this.genuineCheck} style={{flexDirection:'row'}}>
                                                <IconRadio name={this.state.check_genuine ? "check-box" : "check-box-outline-blank"} size={30} color={'black'} />
                                                <View style={{ justifyContent: 'center' }}>
                                                    <Text style={[template.contentText]}>{this.genuineValueText[0]}</Text>
                                                </View>
                                        </TouchableOpacity>
                                    </View>
                                    <View style={{paddingLeft:'5%'}}>
                                        <TouchableOpacity activeOpacity={0.8} onPress={this.non_genuineCheck}  style={{flexDirection:'row'}}>
                                            <IconRadio name={this.state.check_non_genuine ? "check-box" : "check-box-outline-blank"} size={30} color={'black'} />
                                            <View style={{ justifyContent: 'center' }}>
                                                <Text style={[template.contentText]}> {this.genuineValueText[1]}</Text>
                                            </View>
                                        </TouchableOpacity>
                                    </View>

                                </View>
                                {/*상품상태*/}
                                <View style={[template.roundedBox,{paddingVertical:'0%'}]}>
                                    <Text style={template.contentTitleText}>상품상태</Text>
                                    <Picker
                                        selectedValue={this.state.quality}
                                        onValueChange={(value, index) => { this.setState({ quality: value }) }}>
                                        {this.qualityValueText.map((item,i)=><Picker.Item label={item} key={i} value={i+1} />)}
                                    </Picker>
                                </View>

                               

                                {/* 검색어 */}
                                <View style={[template.roundedBox,{paddingVertical:'0%', flexDirection:'row'}]}> 
                                    <View style={{flex:6}}>
                                        <Text style={template.contentTitleText}>검색어(최대7개)
                                            {this.state.hashTagError == false ? (
                                                <Text style={[template.contentTitleText,{color:colors.red}]}>
                                                        * 1 - 7개 입력
                                                </Text>
                                            ) : null}
                                        </Text>
                                        <TextInput
                                            style={template.inputText}
                                            ref={(c) => { this.hashTagRef = c; }}
                                            returnKeyType="next"
                                            onSubmitEditing={this.addHashTag}
                                            onChangeText={(value) => this.hashTagOnChangeText(value)}
                                            value={this.state.tagName}
                                        />
                                    </View>
                                    <View style={{flex:1, alignItems:'center',justifyContent:'center'}}>
                                        <TouchableOpacity style={[template.smallButton,{backgroundColor:colors.light_btn}]} onPress={this.addHashTag}>
                                            <Text>추가</Text>
                                        </TouchableOpacity>
                                    </View>
                                </View>

                                {/* 키워드 뿌려주기 */}
                                <View style={{flexWrap:'wrap',flexDirection:'row',marginTop:'2%'}}>
                                    {this.state.hashTag.map((item, i) =>
                                        <View style={inStyle.hashTagView} key={i}>
                                            <Text>#{item}</Text>
                                            <TouchableOpacity onPress={() => this.removeHashTag(i)}>
                                                <IconPopup name="close" size={15} color="black" />
                                            </TouchableOpacity>
                                        </View>
                                    )}
                                </View>

                                {/* 상세내용*/}
                                <View style={[template.roundedBox,{paddingVertical:'0%'}]}>
                                    <Text style={template.contentTitleText}>판매자 글</Text>
                                    <TextInput
                                         style={[template.inputText,{height:100}]}
                                        multiline={true}
                                        onChangeText={(value) => this.setState({ spec: value })}
                                    />
                                </View>
                            </View>
                        </View>
                        

                        {/* 상품 등록하기 버튼 부분*/}
                        {this.state.addGoodsButtonVisible ?
                            (<TouchableOpacity activeOpacity={0.8} style={template.activeButton} onPress={()=>this.setConfirmModal(true)}>
                                <Text style={template.buttonText}>상품등록하기</Text>
                            </TouchableOpacity>)
                            : (<TouchableOpacity activeOpacity={0.8} style={template.inActiveButton}>
                                <Text style={template.buttonText}>상품등록하기</Text>
                            </TouchableOpacity>)}


                        {/* 모달들 */}
                        {/*상품 이미지 선택을 위한 버튼을 누르면 뜨는 팝업, 카메라 또는 갤러리 */}
                        {this.state.imageSelectorPopupModalVisible &&
                            <ImageSelectorPopup x={this.cameraModalX} y={this.cameraModalY}
                                closeCameraPopupMenu={() => this.setState({ imageSelectorPopupModalVisible: false })}
                                goCameraScreen={this.goCameraScreen}
                                goGalleryScreen={this.goGalleryScreen} />}

                        {/* 작은 이미지를 선택하면 크게 보이는 모달... 모달에서 삭제도 가능 */}
                        {this.state.largeImageModalVisible && 
                            <LargeImageViewer 
                                items={this.state.imageURIs} 
                                startIndex={this.state.selectedImageIndex} 
                                closeModal={()=>this.setState({largeImageModalVisible:false})} 
                                removeImage={(index) => this.removeImage(index)} />}

                        {/*상품 등록 확인창 모달*/}
                        {this.state.confirmModalVisible && 
                            (<ConfirmModal 
                                item={this.state}  
                                confirmModalVisible={()=>this.setConfirmModal(false)} 
                                okButtonListener={this.goAddGoodsButtonClicked} />)}

                        {/* 상품등록중 indicator*/}
                        {this.state.indicator && <Indicator/>}
                    </ScrollView>
                </View>
            </>
        )
    }
}



class SmallImageViewer extends Component {
    constructor(props) {
        super(props);
    }

    renderItem=(item)=> {
        return(
            <TouchableOpacity onPress={()=>this.props.largeImageModal(item.index)} >
                <Image source={{ uri: item.item }} style={inStyle.cameraButton}/>
                <View style={inStyle.imageDeleteView}>
                    <TouchableOpacity onPress={()=>this.props.removeImage(item.index)}>
                        <IconDelete name="close-circle" color="black" size={23}></IconDelete>
                    </TouchableOpacity>
                </View>
            </TouchableOpacity>
        )
    }

    render() {     
        return (
            <FlatList
                showsHorizontalScrollIndicator={false}
                data={this.props.items}
                renderItem={(item) => this.renderItem(item)}
                horizontal={true}
            />
        )
    }
}


//작은 이미지 보기에서 이미지 터치시 큰 이미지 보기(삭제 가능)
class LargeImageViewer extends Component {
    constructor(props) {
        super(props);
        this.currentImageIndex=this.props.startIndex;
    }

    renderItem=(item)=> {
        return (
            <View style={inStyle.imageModalView}> 
                <ImageBackground source={{ uri: item.item }} style={{flex:1,margin:10,alignItems:'flex-end'}}>
                    {/* 마지막 이미지 삭제시 오류 발생하여 임시 삭제
                    <TouchableOpacity >
                        <IconDelete name="close" color="black" size={40}></IconDelete>
                    </TouchableOpacity>
                    */}
                </ImageBackground>
            </View>
           
        )
    }

    // FlatList에서 스크롤이 될때 현재 선택된 itemdml index를 얻어옴
    //FlatList의 props에 onViewableItemsChanged와 viewabilityConfig를 추가해 주어야 함
    imageItemChanged=(item)=> {
        console.log('item changed = ',item.changed[0]);
        this.currentImageIndex=item.changed[0].index;
    }

    removeImage=()=>{
        this.props.removeImage(this.currentImageIndex);
        this.props.closeModal();
    }

    render() {
        return (
            <Modal visible={true}>                
                <SafeAreaView style={[template.baseContainer,{marginBottom:10}]}>               
                    <FlatList
                        showsHorizontalScrollIndicator={false}
                        data={this.props.items}
                        renderItem={(item) => this.renderItem(item)}
                        horizontal={true} // 가로정렬
                        initialScrollIndex={this.props.startIndex}
                        onViewableItemsChanged={(item)=> this.imageItemChanged(item)}
                        viewabilityConfig={{waitForInteraction: true,itemVisiblePercentThreshold: 80}}
                    />    
                </SafeAreaView>     
                <View style={{flexDirection:'row',width:'100%'}}>
                    <TouchableOpacity style={[template.activeButton,{flex:1, marginRight:2}]} onPress={this.props.closeModal}>
                        <Text style={template.buttonText}>닫기</Text>
                    </TouchableOpacity>  
                    <TouchableOpacity style={[template.activeButton,{flex:1}]} onPress={()=>this.removeImage()}>
                        <Text style={template.buttonText}>이 사진 삭제</Text>
                    </TouchableOpacity>  
                </View>     
            </Modal>            
        )
    }
}



//상품등록 확인 페이지 팝업
class ConfirmModal extends Component {
    constructor(props) {
        super(props);
        this.qualityValueText = Constant.getGoodsQuality();
        this.genuineValueText = Constant.getGoodsGenuine();
    }
    
    render() {
        const {name,number,price,quantity,quality,genuine} = this.props.item;
        return (
            <>
                <Modal animationType='slide' transparent={true} visible={true} >
                    <View style={{alignItems:'center',justifyContent:'center',flex:1,backgroundColor: 'rgba(52, 52, 52, 0.5)' }}>
                        <View style={inStyle.confirmModalView}>
                            <Text style={template.largeText}>등 록 확 인{"\n"}</Text>

                            <View style={{flexDirection:'row', marginBottom:'13%'}}>
                                <View style={{flex:1}}>
                                    <Text style={[template.smallText,{marginBottom:'3%'}]}>품        명</Text>
                                    <Text style={[template.smallText,{marginBottom:'3%'}]}>부품번호</Text>
                                    <Text style={[template.smallText,{marginBottom:'3%'}]}>가        격</Text>
                                    <Text style={[template.smallText,{marginBottom:'3%'}]}>판매개수</Text>
                                    <Text style={[template.smallText,{marginBottom:'3%'}]}>상품상태</Text>
                                    <Text style={[template.smallText,{marginBottom:'3%'}]}>정품/비정품</Text>            
                                </View>
                                <View style={{flex:1}}>
                                    <Text style={[template.smallText,{color:colors.dark,marginBottom:'3%'}]}>{name.length>7 ? `${name.slice(0,7)}...`:name}</Text>
                                    <Text style={[template.smallText,{color:colors.dark,marginBottom:'3%'}]}>{number.length>9 ? `${number.slice(0,9)}...`:number}</Text>
                                    <Text style={[template.smallText,{color:colors.dark,marginBottom:'3%'}]}>{FunctionUtil.getPrice(price)}</Text>
                                    <Text style={[template.smallText,{color:colors.dark,marginBottom:'3%'}]}>{quantity}</Text>
                                    <Text style={[template.smallText,{color:colors.dark,marginBottom:'3%'}]}>{this.qualityValueText[quality-1]}</Text>
                                    <Text style={[template.smallText,{color:colors.dark,marginBottom:'3%'}]}>{this.genuineValueText[genuine-1]}</Text>
                                </View>
                            </View>

                            <Text style={[template.smallText,{color:colors.dark}]}>{" 등록 하시겠습니까? "}</Text>
                            <View style={{flexDirection:'row', marginVertical:'3%'}}>
                                <TouchableOpacity style={inStyle.confirmButton} onPress={()=>this.props.confirmModalVisible()}><Text style={{color:colors.dark}}>취소</Text></TouchableOpacity>
                                <TouchableOpacity style={[inStyle.confirmButton,{backgroundColor:colors.main}]} onPress={()=>this.props.okButtonListener()}><Text style={{color:colors.white}}>확인</Text></TouchableOpacity>
                            </View>                      
                        </View>
                    </View>
                </Modal>
            </>
        )
    }
}

export default AddGoods;

const ScreenHeight = Dimensions.get('window').height;
const ScreenWidth = Dimensions.get('window').width;

const inStyle = StyleSheet.create({
    hashTagView: [
        template.roundedBox,
        {
            marginTop: '0%',
            paddingLeft: 10,
            paddingRight: 10,
            flexDirection: 'row',
            marginRight: 10,
            marginBottom: '2%',
            borderRadius: 30,
            backgroundColor: colors.light_btn,
            justifyContent: 'center',
            alignItems: 'center',
        }
    ],
    countingBox: [
        template.roundedBox,
        {
            width: '17%',
            height: '100%',
            alignItems: 'center',
            justifyContent: 'center',
            paddingHorizontal:'0%',
            marginTop:'0%',
            marginRight:'2%',
            marginBottom:'0%',
        }
    ],
    countingBoxWrap: [
        template.roundedBox,
        {
            alignItems: 'center',
            justifyContent:'center',
            paddingHorizontal:'0%',
            paddingVertical:'1%',
            marginBottom:'0%',
            flexDirection:'row',
            borderWidth:0,
        }
    ],
    //Button
    cameraButton:[
        template.smallButton,
        {
            width: 60,
            height: 60,
            backgroundColor: colors.light_btn,
            marginTop:10,
            marginRight:5,
    }],

    
    //imageModal
    imageModalView:{
        //flex: 1,
        width: ScreenWidth,
        height: ScreenHeight,
        //margin: 20,
    },
    imageDeleteView:{
        top: -2,
        right: -1,
        position: 'absolute',
    },

    //confirmModal
    confirmModalView:{
        height: '55%',
        width: '75%',
        margin: 20,
        backgroundColor: colors.white,
        borderColor:colors.light,
        borderWidth:1,
        borderRadius: 20,
        padding: 35,
        alignItems: 'center',  
    },
    confirmButton:{
        borderWidth:1,
        borderColor:colors.light,
        borderRadius:10,
        width:'30%',
        height:'45%',
        marginHorizontal:'3%',
        marginVertical:'2%',
        alignItems:'center',
        justifyContent:'center',
    }

}); 