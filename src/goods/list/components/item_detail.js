import React, { Component, PureComponent, useMemo } from 'react';
import {
    ScrollView, Pressable, View, Text,
    Image, FlatList, TouchableOpacity, Button, Alert, Dimensions, BackHandler, Modal, Keyboard
} from 'react-native';
import { TextInput } from 'react-native-gesture-handler';
import { Picker } from '@react-native-picker/picker';
import { SwiperFlatList } from 'react-native-swiper-flatlist';

import { styles } from "../../../styles/list/home_item_detil";
import IconRadio from 'react-native-vector-icons/MaterialIcons';
import IconPopup from 'react-native-vector-icons/EvilIcons';
import Icon from 'react-native-vector-icons/MaterialIcons';
import IconToggle from 'react-native-vector-icons/Entypo';

import Constant from '../../../util/constatnt_variables';
import WebServiceManager from '../../../util/webservice_manager';
import AsyncStorage from "@react-native-async-storage/async-storage";

export default class DetailItemView extends Component {
    constructor(props) {
        super(props);
        this.hashTagRef = React.createRef();

        this.goodsID = this.props.route.params.id;
        this.serverUserID = this.props.route.params.userID;
        this.storageUserID = "";

        this.state = {
            imageLength: 0,
            images: [],

            editGoodsViewVisible: false,

            tagName: '',
            
            dipsbuttonclicked: false,//찜하기
            //togglebuttonclicked: false,

            editVisible: false,//수정가능
            buyVisible: false,//구매가능
            imageVisible : false,//큰사진보기

            item: {}, //상품 상세정보

            genuine:1,
            quality: 1, // 상품상태
            quantity: 1, // 수량
            hashTag:[],
            price:0,
            editSpec:"",

            validForm:false,
            selectedImageIndex:0,
        }
    }

    componentDidMount() {
        this.keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', this.keyboardDidShow);
        this.keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', this.keyboardDidHide);

        this.callimageLengthAPI().then((response) => {
            console.log('Image length', response);
            this.setState({ imageLength: response.length });
            for (let i = 1; i <= response.length; i++) {
                this.callGetImageAPI(i).then((response) => {
                    this.setState({ imageTest: response })
                    let reader = new FileReader();
                    reader.readAsDataURL(response); //blob을 읽어줌 읽은 놈이 reader
                    reader.onloadend = () => {
                        const images = this.state.images;
                        images.push(reader.result.replace("application/octet-stream", "image/jpeg"));
                        console.log(images.length);
                        this.setState({ images: images });
                    }
                })
            }
        });

        this.getUserID().then((value) => {
            this.storageUserID = value; // 휴대폰에 저장된 userID
            console.log("UserID:", this.storageUserID)

            this.callGetGoodsDetailAPI().then((response) => {
                this.setState({ item: response,  hashTag: response.hashTag.split(',').map(tag => `${tag}`), 
                    price:response.price, editSpec:response.spec ,quantity:response.quantity,quality:response.quality, 
                    genuine:response.genuine});
                console.log(response);

                //올린사람만 수정하기
                if (this.storageUserID == this.serverUserID) { // 휴대폰 vs 서버 userID 비교
                    this.setState({ editVisible: true })
                    console.log('editVisivle', this.state.editVisible)
                }
                else { //구매가능
                    this.setState({ buyVisible: true })
                    this.callGetWishIdAPI(value).then((response) => {
                        if (response.includes(this.goodsID) == true) {
                            this.setState({ dipsbuttonclicked: true })
                        }
                    });
                }
            })
        });

        BackHandler.addEventListener("hardwareBackPress", this.backPressed);
    }
    componentWillUnmount() {
        this.keyboardDidShowListener.remove();
        this.keyboardDidHideListener.remove();
        BackHandler.removeEventListener('hardwareBackPress', this.backPressed);
    }

    keyboardDidShow = () => {
        console.log('Keyboard Shown');
    }

    keyboardDidHide = () => {
        console.log('Keyboard Hide');
        this.onValueChange();
    }

    backPressed = () => {
        if(this.state.editGoodsViewVisible==true){
            Alert.alert(
                '',
                '수정을 취소 하시겠어요?',
                [
                    { text: '취소', onPress: () => console.log('Cancel Pressed') },
                    { text: '확인', onPress: () => this.props.navigation.pop() },
                ],);
        }
        else{
            this.props.navigation.pop();
        }
        
        if(this.props.route.params.pickRefreshListener !=null){
            this.props.route.params.pickRefreshListener();
        }
        return true;
    }

    // userID값 가져오는 함수
    async getUserID() {
        let obj = await AsyncStorage.getItem('obj') // 접속 중인 세션, 로컬스토리지 세션 따로생각, 로그인확인방법check
        let parsed = JSON.parse(obj);
        if (obj !== null) {
            return parsed.id;
        }
        else {
            return false;
        }
    }

    async callimageLengthAPI() {
        let manager = new WebServiceManager(Constant.serviceURL + "/GetGoodsImageLength?id=" + this.goodsID)
        let response = await manager.start();
        if (response.ok) {
            return response.json();
        }
    }

    async callGetImageAPI(position) {
        let manager = new WebServiceManager(Constant.serviceURL + "/GetGoodsImage?id=" + this.goodsID + "&position=" + position);
        let response = await manager.start();
        if (response.ok)
            return response.blob();
    }

    async callGetGoodsDetailAPI() {
        let manager = new WebServiceManager(Constant.serviceURL + "/GetGoodsDetail?id=" + this.goodsID);
        let response = await manager.start();
        if (response.ok) {
            return response.json();
        }
    }

    async callUpdateGoodsAPI(value){
        let manager = new WebServiceManager(Constant.serviceURL+"/UpdateGoods", "post");
        
        const editItem = value;
        manager.addFormData("data", {
            id: editItem.id, quantity: editItem.quantity, quality: editItem.quality,
            price: editItem.price, genuine: editItem.genuine, spec: editItem.spec, hashTag: editItem.hashTag
        });

        let response = await manager.start();// --끝났다
        if (response.ok) {
            return response.json();
        }
    }

    async callRemoveGoodsAPI(){
        let manager = new WebServiceManager(Constant.serviceURL+"/RemoveGoods?id=" + this.goodsID);

        let response = await manager.start();
        if (response.ok) {
            return response.json();
        }
    }

    async callSetDisableGoodsAPI(){
        let manager = new WebServiceManager(Constant.serviceURL+"/SetDisableGoods?id=" + this.goodsID);

        let response = await manager.start();
        if (response.ok) {
            return response.json();
        }
    }

    async callSetEnableGoodsAPI(){
        let manager = new WebServiceManager(Constant.serviceURL+"/SetEnableGoods?id=" + this.goodsID);

        let response = await manager.start();
        if (response.ok) {
            return response.json();
        }
    }

    qulityValueText = (value) => {
        let qulityText = ["새제품이에요 📦", "깨끗해요 🙂", "쓸만해요 👍"];
        return qulityText[value - 1];
    }

    genuineValueText = (value) => {
        let genuineText = ["정품", "비정품"];
        return genuineText[value - 1];
    }

    //부품번호에 대한 Goodle 검색창 보이기(Web View)
    goGoodsNumberWebView=()=> {
        this.props.navigation.navigate('GoogleWebView',{url:'http://www.google.com/search?q='+this.state.item.number});
    }



    // 수정 버튼 클릭
    editButtonClicked = () => {
        this.setState({ editGoodsViewVisible: true });
        this.onValueChange();
    }
    //수정 취소 버튼 클릭
    editCancelButtonClicked = () => {
        const { price, quantity, quality, genuine, spec} = this.state.item;
        const hashTag = this.state.item.hashTag.split(',').map(tag => `${tag}`);
        Alert.alert(
            '',
            '수정을 취소 하시겠어요?',
            [
                { text: '취소', onPress: () => console.log('Cancel Pressed') },
                { text: '확인', onPress: () => this.setState({ editGoodsViewVisible: false, price: price, quantity: quantity, hashTag: hashTag, quality: quality, genuine: genuine, editSpec: spec }) },
            ],);

    }

    // 수정완료 버튼 클릭
    editCompleteButtonClicked = (value) => {
        console.log("수정완료버튼클릭");
        this.callUpdateGoodsAPI(value).then((response)=>{
            console.log('수정완료', response)

            if (this.state.editGoodsViewVisible == true) {
                this.setState({ editGoodsViewVisible: false });
            }
        })
    }
    // 구매하기 버튼 클릭
    buyButtonClicked = () => {
        this.props.navigation.navigate("Payment", { item: this.state.item, userID: this.storageUserID });
    }

    // Home refresh
    refresh =()=>{
        this.props.route.params.refresh();
    }
    
    //숨김버튼 클릭
    goodsDisableButtonClicked=()=>{
        Alert.alert(
            '',
            '상품을 숨기겠습니까?',
            [
                { text: '취소', onPress: () => console.log('Cancel Pressed') },
                {
                    text: '확인', onPress: () => this.callSetDisableGoodsAPI().then((response) => {
                        console.log("숨김완료", response);
                        if(response.success==1){
                            this.props.navigation.navigate("Home");
                            this.refresh();
                        }
                    })
                },
            ],);
    }

    //숨김해제 버튼 클릭
    goodsEnableButtonClicked = () => {
        Alert.alert(
            '',
            '상품 숨기기를 해제하시겠습니까?',
            [
                { text: '취소', onPress: () => console.log('Cancel Pressed') },
                {
                    text: '확인', onPress: () => this.callSetEnableGoodsAPI().then((response) => {
                        console.log("숨김해제완료", response);
                        if(response.success==1){
                            this.props.navigation.navigate("Home");
                        }
                    })
                },
            ],);
    }
    //삭제버튼 클릭
    removeButtonClicked = () => {
        Alert.alert(
            '',
            '상품을 정말 삭제 하시겠어요?',
            [
                { text: '취소', onPress: () => console.log('Cancel Pressed') },
                {
                    text: '확인', onPress: () => this.callRemoveGoodsAPI().then((response) => {
                        console.log("삭제완료", response);
                        this.props.navigation.navigate("Home");
                        this.refresh();
                    })
                },
            ],);
    }

    async addHashTag(tagNames) {
        this.setState({ hashTag: this.state.hashTag.concat(tagNames) })
    }

    async removeHashTag(index) {
        this.setState({
            hashTag: this.state.hashTag.filter((_, indexNum) => indexNum !== index),
        })
    }
    //해시태그 추가버튼을 누를때
    addTag = () => {
        const tagNames = this.state.tagName.split(' ');

        if (tagNames.slice(-1)[0] == '') {
            tagNames.splice(tagNames.length - 1)
        }
        if (this.state.hashTag.length < 7 && tagNames.length < 7 && this.state.hashTag.length + tagNames.length < 8) {

            this.addHashTag(tagNames).then(() => {
                this.onValueChange();
            });

        }
        else {
            this.setState({ hashTagError: false })
        }

        this.state.tagName = ""
        this.hashTagRef.clear();
    }

    //해시태그 삭제할 때
    hashTagRemove = (index) => {
        this.removeHashTag(index).then(() => {
            this.onValueChange();
        });
    }

    // 판매수량 수정 버튼 클릭
    editMinus = (value) => {
        if (value <= 1) {
            this.setState({ quantity : 1 })
        }
        else {
            this.setState({ quantity : value - 1 });
        }
    }

    editPlus = (value) => {
        this.setState({ quantity : value + 1 })
    }

    //정품 클릭
    genuineCheck = () => {
        this.setState({  genuine: 1 });
    }
    //비정품 클릭
    non_genuineCheck = () => {
        this.setState({  genuine: 2 });
    }

    dipsButtonClicked = () => {
        // this.setState({dipsbuttonclicked: !this.state.dipsbuttonclicked})
        if (this.state.dipsbuttonclicked == false) {
            this.callAddWishAPI().then((response) => {
                console.log("add wish", response);
            })
            console.log("색칠하트");
            this.setState({ dipsbuttonclicked: true });
        } else {
            this.callRemoveWishAPI().then((response) => {
                console.log("remove wish", response);
                //this.props.navigation.navigate('PickList')
                //this.props.route.params.pickRefreshListener();
            })

            console.log("색칠안한하트");
            this.setState({ dipsbuttonclicked: false })
        }
    }

    onValueChange = () => {
        let isValidForm = true;
        console.log("hashTag_length", this.state.hashTag.length);

        if (this.state.price.length == 0) {
            isValidForm = false;
        }
        if(this.state.price <= 0){
            isValidForm = false;
        }
        if (this.state.hashTag.length <= 0) {
            isValidForm = false;
        }

        console.log("isValidForm", isValidForm);
        this.setState({ validForm: isValidForm });
    }
    hashTagOnChangeText=(value)=>{
        const reg = /[\{\}\[\]\/?.,;:|\)*~`!^\-_+<>@\#$%&\\\=\(\'\"]/;
        let newTagName=value.replace(reg,'')
        this.setState({ tagName: newTagName})
    }
    handleModal = (index) => {
        this.setState({
            imageVisible: !this.state.imageVisible,
            selectedImageIndex: index
        })
    };

    async callAddWishAPI() {
        let manager = new WebServiceManager(Constant.serviceURL + "/AddWishList?user_id=" + this.storageUserID + "&goods_id=" + this.goodsID);
        let response = await manager.start();

        if (response.ok)
            return response.json();
    }
    async callRemoveWishAPI() {
        let manager = new WebServiceManager(Constant.serviceURL + "/RemoveWishList?user_id=" + this.storageUserID + "&goods_id=" + this.goodsID)
        let response = await manager.start();
        if (response.ok) {
            return response.json();
        }
    }
    async callGetWishIdAPI(storageUserID) {
        let manager = new WebServiceManager(Constant.serviceURL + "/GetWishIdList?user_id=" + storageUserID);
        let response = await manager.start();
        if (response.ok)
            return response.json();
        else
            Promise.reject(response);
    }


    render() {
        console.log("renderItem_hashTag", this.state.hashTag);
        const { name, number,quantity,spec, price,genuine, hashTag, quality, valid } = this.state.item;
        // 값 변환
        const renderPrice = this.state.price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
       
        const editItem = {
            id:this.goodsID,
            quantity:this.state.quantity,
            quality:this.state.quality,
            price:this.state.price,
            genuine:this.state.genuine,
            spec:this.state.editSpec,
            hashTag:this.state.hashTag.toString(),
        };

        return (

            <View style={styles.itemDetail_view}>
                <View style={styles.tabBar_view}>
                    {this.state.editVisible &&
                        <>
                            {this.state.editGoodsViewVisible ?
                                <>
                                    <TouchableOpacity onPress={this.editCancelButtonClicked} >
                                        <Text style={[styles.text,{color:'#808e9b'}]}>수정취소  </Text>
                                    </TouchableOpacity >
                                </> :
                                <>
                                    <TouchableOpacity onPress={this.editButtonClicked} >
                                        <Text style={[styles.text,{color:'#808e9b'}]}>수정    </Text>
                                    </TouchableOpacity >
                                </>}
                            <TouchableOpacity onPress={this.removeButtonClicked}>
                                <Text style={[styles.text,{color:'#808e9b'}]}>삭제    </Text>
                            </TouchableOpacity>

                            {valid==1 && 
                                <TouchableOpacity onPress={this.goodsDisableButtonClicked}>
                                <Text style={[styles.text,{color:'#808e9b'}]}>숨김    </Text>
                            </TouchableOpacity>}
                            {valid==0 && 
                            <TouchableOpacity onPress={this.goodsEnableButtonClicked}>
                                <Text style={[styles.text,{color:'#808e9b'}]}>숨김해제    </Text>
                            </TouchableOpacity>}
                        </>}


                </View>

                <View style={styles.itemInfo_view}>
                    <ScrollView showsVerticalScrollIndicator={false}>
                        {/* 이미지 리스트 */}
                        <View style={styles.goodsImage_view}>
                            <View style={styles.slideImage_view}>
                                <SwiperFlatList
                                    data={this.state.images}
                                    showPagination
                                    paginationActiveColor='blue'
                                    paginationStyleItem={{ width: 10, height: 10 }}
                                    paginationStyleItemActive={{ width: 15, height: 10 }}
                                    renderItem={item => (
                                        <ImageView image={item.item} index={item.index} handleModal={this.handleModal} />
                                    )}
                                    horizontal={true}
                                />
                            </View>
                        </View>
                        
                        {/* 이미지 모달 */}
                        <Modal visible={this.state.imageVisible} onRequestClose={()=>this.setState({imageVisible:!this.state.imageVisible})}>
                            {/*<Button title="Back" onPress={this.handleModal} />*/}
                            <View style={styles.goods_modal_view}>
                                <FlatList
                                    showsHorizontalScrollIndicator={false}
                                    data={this.state.images}
                                    renderItem={(item) => <ImageModal image={item.item} imageModal={this.handleModal}/>}
                                    initialScrollIndex={this.state.selectedImageIndex}
                                />
                            </View>
                        </Modal>

                        {/*  상품 디테일 */}
                        <View style={styles.productInfo_view}>
                            {/* 인증 마크 => TODO 인증 업체일 경우에만 뜨도록 설정 */}
                            <View style={styles.certificationMark_view}>
                                <Text style={styles.certificationMark_text}>인증업체</Text>
                            </View>

                            {/* 부품 번호 & 부품이름 */}
                            <View style={styles.goodsName_view}>
                                <Text style={[styles.text, { fontSize: 24, }]}>
                                    {name}
                                </Text>
                                <TouchableOpacity onPress={this.goGoodsNumberWebView}>
                                    <Text style={[styles.text, { paddingLeft: '5%', color: 'blue' }]}>
                                        {number}
                                    </Text>
                                </TouchableOpacity>
                            </View>

                            {/* 금액 */}
                            <View style={styles.detailPrice_view}>
                                {!this.state.editGoodsViewVisible &&
                                    <Text style={[styles.text, { fontSize: 22, }]}>{renderPrice}</Text>
                                }

                                {/* 금액 수정 */}
                                {this.state.editGoodsViewVisible && <View style={styles.editGoodsPrice_input}>
                                    <TextInput style={[styles.text, { fontSize: 22, }]}
                                        onChangeText={(value) => this.setState({ price: value })}
                                        onEndEditing={(event)=> this.onValueChange()}>
                                        {this.state.price}
                                    </TextInput>
                                </View>}

                                {/* 단위 */}
                                <View style={{ marginLeft: 2, }}>
                                    <Text style={styles.detailUnit_text}>원</Text>
                                </View>

                                {/* 구매 수량 선택 => TODO 여러 개일 경우에만 보이도록*/}
                                <View style={{ marginLeft: 'auto', }}>
                                    {/* 남은 수량 */}
                                    <View style={styles.remaining_view}>
                                        <Text style={[styles.text, { fontSize: 13, color: '#949CA1', }]}>
                                            {this.state.quantity}개 남음
                                        </Text>
                                    </View>

                                    {/* 남은수량 수정 */}
                                    {this.state.editGoodsViewVisible && <View style={styles.selectQuantity_view}>
                                        <Pressable onPress={() => this.editMinus(this.state.quantity)} style={styles.quantity_button}>
                                            <Text style={[styles.text, { fontSize: 18, }]}>-</Text>
                                        </Pressable>

                                        <View style={[styles.quantity_button, styles.quantityCount]}>
                                            <Text style={[styles.text, { fontSize: 18, }]}>{this.state.quantity}</Text>
                                        </View>

                                        <Pressable onPress={() => this.editPlus(this.state.quantity)} style={styles.quantity_button}>
                                            <Text style={[styles.text, { fontSize: 18, }]}>+</Text>
                                        </Pressable>
                                    </View>}
                                </View>
                            </View>
                        </View>

                        {/* 토글 디테일 */}
                        <View style={styles.toggleDetail_view}>
                            <View style={styles.toggleDetailTitle_view}>
                                <Text style={[styles.text, { fontSize: 16, }]}>상품 정보</Text>
                                <TouchableOpacity onPress={() => this.setState({ togglebuttonclicked: !this.state.togglebuttonclicked })}>
                                    <IconToggle name={this.state.togglebuttonclicked ? "chevron-up" : "chevron-down"} size={20} color={'black'}></IconToggle>
                                </TouchableOpacity>
                            </View>
                        
                                    {/*해시태그*/}
                                    {!this.state.editGoodsViewVisible && <View style={styles.toggleDetailItem}>
                                        <View style={styles.toggleDetailItemTItle}>
                                            <Text style={[styles.text, { fontSize: 14, color: '#949CA1', }]}>
                                                해시 태그
                                            </Text>
                                        </View>
                                        <View style={styles.toggleDetailItemValue}>
                                            <Text style={styles.toggleDetailItemValueText}>
                                                {!this.state.editGoodsViewVisible && <View style={styles.detailHashTags_view}>
                                                    {this.state.hashTag.map((tag, index) => (
                                                        <View style={{ marginRight: 8, }} key={index}>
                                                            <Text style={styles.text}>#{tag}</Text>
                                                        </View>
                                                    ))}
                                                </View>}
                                            </Text>
                                        </View>
                                    </View>}

                                    {/* 제품 상태 */}
                                    {!this.state.editGoodsViewVisible && <View style={styles.toggleDetailItem}>
                                        <View style={styles.toggleDetailItemTItle}>
                                            <Text style={[styles.text, { fontSize: 14, color: '#949CA1', }]}>
                                                제품 상태
                                            </Text>
                                        </View>
                                        <View>
                                            <Text style={styles.text}>
                                                {this.qulityValueText(this.state.quality)}
                                            </Text>
                                        </View>
                                    </View>}

                                    {/*정품 비정품*/}
                                    {!this.state.editGoodsViewVisible && <View style={styles.toggleDetailItem}>
                                        <View style={styles.toggleDetailItemTItle}>
                                            <Text style={[styles.text, { fontSize: 14, color: '#949CA1', }]}>정품 유무</Text>
                                        </View>
                                        <View>
                                            <Text style={styles.text}>
                                                {this.genuineValueText(this.state.genuine)}
                                            </Text>
                                        </View>
                                    </View>}

                                    {!this.state.editGoodsViewVisible && <View style={styles.toggleDetailTextArea}>
                                        <View style={styles.toggleDetailItemTItle}>
                                            <Text style={[styles.text, { fontSize: 14, color: '#949CA1', }]}>
                                                상품 설명
                                            </Text>
                                        </View>
                                        {/* TODO 추가 하기 */}
                                        <Text style={styles.text}>
                                            {this.state.editSpec}
                                        </Text>
                                    </View>}
                               

                            {/* 수정 모아보기 */}
                            {/* 해시 태그 리스트 수정 */}

                            {this.state.editGoodsViewVisible && <View style={{ marginTop: 10, }}>

                                < View style={styles.hashTag_input}>
                                    <View style={styles.textLayout_view}>
                                        <Text>키워드
                                            {this.state.hashTagError == false ? (
                                                <Text style={styles.errorMessage_text}>
                                                    * 1 - 7개 입력
                                                </Text>
                                            ) : null}
                                        </Text>
                                        <TextInput
                                            ref={(c) => { this.hashTagRef = c; }}
                                            returnKeyType="next"
                                            onSubmitEditing={()=>this.addTag()}
                                            onChangeText={(value) => this.hashTagOnChangeText(value)}
                                            value={this.state.tagName}
                                        />
                                    </View>
                                    <View style={styles.btnLayout_view}>
                                        <TouchableOpacity style={styles.tag_button} onPress={()=>this.addTag()}>
                                            <Text>추가</Text>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                                <View style={styles.tagLayout_view}>
                                    {this.state.hashTag.map((item, i) =>
                                        <View style={styles.tagStyle_view} key={i}>
                                            <Text>#{item}</Text>
                                            <TouchableOpacity onPress={() => this.hashTagRemove(i)}>
                                                <IconPopup name="close" size={15} color="black" />
                                            </TouchableOpacity>
                                        </View>
                                    )}
                                </View></View>}

                            {/* 제품 상태 수정 */}

                            {this.state.editGoodsViewVisible && <View style={styles.toggleDetailItem}>
                                <View style={styles.toggleDetailItemTItle}>
                                    <Text style={styles.toggleDetailItemTItleText}>
                                        제품 상태
                                    </Text>
                                </View>
                                <View style={styles.editGoodsQuality}>
                                    <Picker
                                        selectedValue={`${this.state.quality}`}
                                        onValueChange={(value, index) => { this.setState({ quality: value }) }}>
                                        <Picker.Item label='새제품이에요 📦' value="1" />
                                        <Picker.Item label='깨끗해요 🙂' value="2" />
                                        <Picker.Item label='쓸만해요 👍' value="3" />
                                    </Picker>
                                </View>
                            </View>}



                            {/*정품 비정품 수정*/}
                            {this.state.editGoodsViewVisible && <View style={styles.genuine_view}>
                                <View style={styles.toggleDetailItemTItle}>
                                    <Text style={styles.toggleDetailItemTItleText}>정품 유무</Text>
                                </View>
                                <View style={styles.status_item}>
                                    <TouchableOpacity activeOpacity={0.8} onPress={this.genuineCheck}>
                                        <View style={styles.genuine_row}>
                                            <IconRadio name={this.state.genuine==1? "check-box" : "check-box-outline-blank"} size={30} color={'black'} />
                                            <Text style={styles.text} > 정품</Text>
                                        </View>
                                    </TouchableOpacity>
                                </View>
                                <View style={styles.status_item}>
                                    <TouchableOpacity activeOpacity={0.8} onPress={this.non_genuineCheck}>
                                        <View style={styles.genuine_row}>
                                            <IconRadio name={this.state.genuine==2 ? "check-box" : "check-box-outline-blank"} size={30} color={'black'} />
                                            <Text style={styles.text}> 비정품</Text>
                                        </View>
                                    </TouchableOpacity>
                                </View>
                            </View>}

                            {/* 그 외 내용 */}


                            {/* 상품설명 수정 */}
                            {this.state.editGoodsViewVisible && <View style={styles.toggleDetailTextArea}>
                                <View style={styles.toggleDetailItemTItle}>
                                    <Text style={styles.toggleDetailItemTItleText}>
                                        상품 설명
                                    </Text>
                                </View>
                                <View style={styles.editGoodsExplainInput_view}>
                                    <TextInput 
                                        multiline={true}
                                        onChangeText={(value) => this.setState({ editSpec: value })}
                                        onEndEditing={(event)=> this.onValueChange()}>{this.state.editSpec}</TextInput>
                                </View>
                            </View>}
                        </View>
                    </ScrollView>
                    {/* 구매하기 버튼 */}

                    <View style={styles.tabBarBottom_view}>
                        {/*찜하기 버튼*/}
                        {this.state.buyVisible &&
                            <View style={styles.pick_view}>
                                <TouchableOpacity style={styles.pick_button} onPress={this.dipsButtonClicked}>
                                    <Icon name="favorite" color={this.state.dipsbuttonclicked ? "#EE636A" : "lightgrey"} size={35}></Icon>
                                </TouchableOpacity>
                            </View>}
                        <View style={styles.buy_view}>
                            {this.state.buyVisible &&
                                <TouchableOpacity style={styles.buy_button} onPress={this.buyButtonClicked}>
                                    <Text style={styles.buyButton_text}>구매하기</Text>
                                </TouchableOpacity>}
                            {/* 수정완료 버튼 */}
                            {this.state.editGoodsViewVisible &&
                            <>
                            {this.state.validForm ? 
                            (<TouchableOpacity onPress={()=>this.editCompleteButtonClicked(editItem)} style={styles.buy_button}>
                                <Text style={styles.buyButton_text}>수정완료</Text>
                            </TouchableOpacity>)
                            :(<TouchableOpacity style={[styles.buy_button, {backgroundColor: "#C9CCD1"}]}>
                                <Text style={styles.buyButton_text}>수정완료</Text>
                            </TouchableOpacity>)}
                            </>
                            }
                        </View>

                    </View>

                </View>
            </View>

        )
    }
}

class ImageView extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            imageSource: null,
        };
    }

    componentDidMount() {
        this.setState({ imageSource: this.props.image });
    }

    render() {
        return (
            <TouchableOpacity onPress={(index)=>this.props.handleModal(this.props.index)}>
                <Image
                    source={{ uri: this.state.imageSource }}
                    style={styles.goods_image}
                />
            </TouchableOpacity>
        );
    }
}

class ImageModal extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            imageSource: null,
        };
    }

    componentDidMount() {
        this.setState({ imageSource: this.props.image });
    }

    render() {
        return (
            <View style={{marginBottom:10, alignItems:"center"}}>
                <Image
                    source={{ uri: this.state.imageSource }}
                    style={styles.goods_modal_image}
                />
            </View>
        );
    }
}