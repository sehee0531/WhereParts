import React, { Component , PureComponent } from 'react';
import { ScrollView, Pressable, TextInput, ImageBackground, View, Text, 
    Image, FlatList, TouchableOpacity, Modal, Animated, BackHandler, Alert, NativeModules } from 'react-native';


import Indicator from '../../../util/indicator';
import Constant from "../../../util/constatnt_variables";
import WebServiceManager from "../../../util/webservice_manager";
import { styles } from "../../../styles/list/home";

import IconRadio from 'react-native-vector-icons/MaterialIcons';

import ListItem from './item';


//import { SearchWebView } from "./web_view";

class Home extends Component {
    constructor(props) {
        super(props);
        this.contents = [];  //모든 users값 가져오는 것
        this.AnimatedHeaderValue = new Animated.Value(0); // Animated 기준값(0,0)

        //안드로이드에서 정의한 모듈 가져옴
        const {ImageModule} = NativeModules;
        this.imageModule = ImageModule;

        this.state = {
            refreshing: false,
            goodsContent: [],
            indicator : false,
            recentRadioButtonChecked:true,
            abcRadioButtonChecked:false
            
        };
    }

    componentDidMount() {
        this.goGetGoods();
        BackHandler.addEventListener("hardwareBackPress", this.backPressed); //뒤로가기 이벤트
    }

    componentWillUnmount() {
        BackHandler.removeEventListener("hardwareBackPress", this.backPressed);
    }    


    //부품 검색
    search = (value) => {
        console.log('selected data: ', value);
        this.setState({
            number: value,
        });
        this.setState({ goodsContent: this.dataFiltering(value) })
    };

    //필터링 (부품번호, 부품명 동시 검색)
    dataFiltering = (value) => {
        let goodsContent = this.contents;
        goodsContent = goodsContent.filter((content) => {
            if(value==='')
                return true;
            else {
                if(content.number===value)
                    return true;
                if(content.name.includes(value))
                    return true;
                /*if(content.hashTag.includes(value))
                    return true;*/
            }
        });
        return goodsContent;
    }


    // 품번인식 카메라로 이동 goCameraButtonClicked
    goCameraButtonClicked = () => {
        this.props.navigation.push("PartsNoCamera", { onResultListener: this.goPartsNo });
    }

    // 품번 가지고오는 함수
    goPartsNo = (imageURI) => {
        this.callPartsNoAPI(imageURI).then((response)=> {
            if(response.success==="1") {
                const partsNo = response.texts[0].replaceAll(" ","");
                this.setState({ number: partsNo });
            }
            else {                
                Alert.alert('부품번호 인식', '부품번호를 인식하지 못했습니다. 직접 입력하세요', [
                    { text: '확인', onPress: () => {this.setState({ number:""})}}]);
            }
                
            this.imageModule.deleteImage(imageURI,(imageURI)=> {
                console.log(imageURI);
            },(imageURI)=> {
                console.log("delete success",imageURI);
            });            
        });
    } 


    //부품 목록 호출 메서드
    goGetGoods = () => {
        console.log('refresh_home');
        this.setState({indicator : true});
        this.callGetGoodsAPI().then((response) => {
            this.contents = response;
            //console.log(response);//response는 json자체
            this.setState({indicator:false,goodsContent:response});
        });
        console.log('refresh success')
        this.setState({ refreshing: false })
    }


    //새로고침
    handleRefresh = () => {
        this.setState({refreshing: true});
        this.goGetGoods();
    }

    dateSort = () => { //최신순
        this.setState({indicator:true});
        this.setState({recentRadioButtonChecked: true, abcRadioButtonChecked: false });
        const sortedData = this.state.goodsContent.sort((a,b)=>{
            return new Date(b.registerDate)-new Date(a.registerDate);
        });
        this.setState({ goodsContent: sortedData });
        this.setState({indicator:false});
    }

    abcSort=()=> { //가나다순
        this.setState({indicator:true});
        this.setState({recentRadioButtonChecked: false, abcRadioButtonChecked: true });
        
        const sortedData = this.state.goodsContent.sort((a, b) => {
            return a.name.localeCompare(b.name);
        })
        this.setState({goodsContent:sortedData });  
        this.setState({indicator:false});   
    }


    //Web Service 시작
     //사진으로부터 품번 인식 서비스 API
     async callPartsNoAPI(imageURI) {
        let manager = new WebServiceManager(Constant.externalServiceURL+"/api/paper/DetectTexts", "post");
        manager.addBinaryData("file",{
            uri:imageURI,
            type:"image/jpeg",
            name:"file"
        });
        let response = await manager.start();
        if(response.ok)
            return response.json();
    }

    //등록된 상품 리스트 API
    async callGetGoodsAPI() {
        let manager = new WebServiceManager(Constant.serviceURL + "/GetGoods");
        let response = await manager.start();
        if (response.ok)
            return response.json();
        else
            Promise.reject(response);
    }

    //Web Service 끝

    //UI관련 메서드들
    //뒤로가기 했을 때 앱 종료
    backPressed = () => {
        Alert.alert(
            '',
            '앱을 종료하시겠습니까?',
            [
                { text: '취소', onPress: () => console.log('Cancel Pressed'), style: 'cancel' },
                { text: '확인', onPress: () => BackHandler.exitApp() },
            ],
            { cancelable: false });
        return true;
    }


    render() {
        const Header_Maximum_Height = 120;
        const Header_Minimum_Height = 60;

        const renderHeader = this.AnimatedHeaderValue.interpolate(
            {
                inputRange: [0, Header_Maximum_Height],
                outputRange: [0, -Header_Maximum_Height],
            });

        const renderSearchBar = this.AnimatedHeaderValue.interpolate(
            {
                inputRange: [0, Header_Maximum_Height],
                outputRange: [Header_Maximum_Height, 0],
                extrapolate: 'clamp'
            });

        return (
            <>
                <Modal transparent={true} visible={this.state.indicator}>
                    <Indicator/>
                </Modal>
                <View style={{ flex: 1, backgroundColor:'white' }}>  
                    <FlatList
                        //style={styles.goodsContent_view}
                        data={this.state.goodsContent}
                        renderItem={({ item , index }) => <ListItem index={index} item={item} id={item.id} navigation={this.props.navigation} refreshListener={this.goGetGoods} />}
                        refreshing={this.state.refreshing} //새로고침
                        onRefresh={this.handleRefresh}
                        scrollEventThrottle={16}
                        contentContainerStyle={{ paddingTop: Header_Maximum_Height + Header_Minimum_Height + 30 }}
                        onScroll={Animated.event(
                            [{ nativeEvent: { contentOffset: { y: this.AnimatedHeaderValue } } }],
                            { useNativeDriver: false })}
                    />

                    <Animated.View style={[styles.homeTop_view, { transform: [{ translateY: renderHeader }] }]}>
                        <ImageBackground source={require('../../../images/background/main-background/main-background.png')} style={{ width: "100%", height: "100%" }}>
                            <View style={styles.title_view}>
                                <View style={styles.row_view}>
                                    <Text style={[styles.title_text, styles.titleBold_text]}>
                                        손 쉽게 검색
                                    </Text>
                                    <Text style={[styles.title_text, styles.titleRegular_text]}>
                                        하고
                                    </Text>
                                </View>
                                <View style={styles.row_view}>
                                    <Text style={[styles.title_text, styles.titleBold_text]}>
                                        판매/구매
                                    </Text>
                                    <Text style={[styles.title_text, styles.titleRegular_text]}>
                                        까지 바로!
                                    </Text>

                                </View>
                                <Text style={styles.description_text}>
                                    원하는 키워드, 품번 사진으로 바로 검색 가능합니다.
                                </Text>
                            </View>
                        </ImageBackground>
                    </Animated.View>

                    <Animated.View style={[styles.searchBar_view, { height: Header_Minimum_Height, transform: [{ translateY: renderSearchBar }] }]}>
                        <ImageBackground source={require('../../../images/background/main-background/main-background.png')} style={styles.background_image}>
                            <TextInput
                                onChange={(value) => this.search(value.nativeEvent.text)}
                                placeholder="품명을 입력해주세요"
                                placeholderTextColor="light grey"
                                style={styles.search_input}
                                value={this.state.number}
                            />
                            {/* 카메라로 검색 */}
                            <TouchableOpacity
                                style={styles.cameraSearch_button}
                                onPress={this.goCameraButtonClicked}>
                                <Image
                                    source={require('../../../images/icon/camera-icon/camera-icon.png')}
                                />
                            </TouchableOpacity>
                        </ImageBackground>
                        <View style={styles.sortBar_view}>
                                <TouchableOpacity style={styles.row_view} activeOpacity={0.8} onPress={this.dateSort}>
                                    <IconRadio name={this.state.recentRadioButtonChecked ? "check-circle" : "panorama-fish-eye"} size={20} color={'blue'} />
                                        <Text style={styles.sortBar_text}> 최신순  </Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={styles.row_view} activeOpacity={0.8} onPress={this.abcSort}>
                                    <IconRadio name={this.state.abcRadioButtonChecked ? "check-circle" : "panorama-fish-eye"} size={20} color={'blue'}  />
                                    <Text style={styles.sortBar_text}> 가나다순</Text>
                                </TouchableOpacity>   
                        </View>
                    </Animated.View>
                </View>
            </>
        );
    }
}

export default Home;