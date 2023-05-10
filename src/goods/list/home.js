import React, { Component, PureComponent } from 'react';
import {
    ScrollView, Pressable, TextInput, ImageBackground, View, Text,
    Image, FlatList, TouchableOpacity, Modal, Animated, BackHandler, Alert, NativeModules, SafeAreaView,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import Indicator from '../../util/indicator';
import Constant from "../../util/constatnt_variables";
import Session from '../../util/session';
import WebServiceManager from "../../util/webservice_manager";
import EmptyListView from '../../util/empty_list_view';
import { styles } from "../../styles/list/home";

import CarIcon from 'react-native-vector-icons/MaterialCommunityIcons'
import Icon from 'react-native-vector-icons/MaterialIcons';
import CameraIcon from 'react-native-vector-icons/SimpleLineIcons';
import ListItem from './item';
import { template } from '../../styles/template/page_style';
//import { template } from '@babel/core';

class Home extends Component {
    constructor(props) {
        super(props);
        this.contents = [];  //최초 가져온 상품 리스트
        this.AnimatedHeaderValue = new Animated.Value(0);
        this.userID = Session.getUserID();

        //안드로이드에서 정의한 모듈 가져옴
        const { ImageModule } = NativeModules;
        this.imageModule = ImageModule;
        this.sortKind=["최신순","거리순","가나다순"];

        this.state = {
            searchKeyWord:'',
            isRefresh: false,
            emptyListViewVisible:false,
            goodsContent: [],
            indicator: false,
            recentRadioButtonChecked: true,
            abcRadioButtonChecked: false,

            goodsQuantity: null,
            quality: 1,
            sortedKind:0,
        };
    }

    componentDidMount() {
        this.goGetGoods();
        BackHandler.addEventListener("hardwareBackPress", this.backPressed); //뒤로가기 이벤트
    }

    componentWillUnmount() {
        BackHandler.removeEventListener("hardwareBackPress", this.backPressed);
    }

    // 부품 검색
    search = (value) => {
        console.log('selected data: ', value);
        this.setState({searchKeyWord: value});
        this.setState({ goodsContent: this.dataFiltering(value)});
    };

    // 필터링 (부품번호, 부품명 동시 검색)
    dataFiltering = (value) => {
        let goodsContent = this.contents;
        goodsContent = goodsContent.filter((content) => {
            if (value == '')
                return true;
            else {
                if (content.number == value)
                    return true;
                if (content.name.toLowerCase().includes(value.toLowerCase()))
                    return true;
                if(content.hashTag.toLowerCase().includes(value.toLowerCase()))
                    return true;
            }
        });
        this.AnimatedHeaderValue.setValue(0);
        this.setState({goodsQuantity:goodsContent.length});
        return goodsContent;
    }

    // 품번인식 카메라로 이동
    goCameraButtonClicked = () => {
        this.props.navigation.push("PartsNoCamera", { onResultListener: this.goPartsNo });
    }

    // 품번 가지고오는 함수
    goPartsNo = (imageURI) => {
        this.callPartsNoAPI(imageURI).then((response) => {
            if (response.success === "1") {
                const partsNo = response.texts[0].replaceAll(" ", "");
                this.search(partsNo);
            }
            else {
                Alert.alert('부품번호 인식', '부품번호를 인식하지 못했습니다. 직접 입력하세요', [
                    { text: '확인', onPress: () => { this.setState({ searchKeyWord: "" }) } }]);
            }

            this.imageModule.deleteImage(imageURI, (imageURI) => {
                console.log(imageURI);
            }, (imageURI) => {
                console.log("delete success", imageURI);
            });
        });
    }

    // 부품 목록 호출 메서드
    goGetGoods = () => {
        console.log('refresh_home');
        this.setState({ indicator: true });
        this.callGetGoodsAPI().then((response) => {
            this.contents = response;
            const goodsQuantity = response.length;
            //console.log("상품 총 갯수 :", goodsQuantity);//response는 json자체
            this.setState({ indicator: false, goodsContent: response, goodsQuantity: goodsQuantity });
            this.setState({emptyListViewVisible:response.length==0 ? true:false})
        });
        //console.log('refresh success')
        this.setState({ isRefresh: false })
    }

    // 리스트 정렬, 1:최신순, 2:거리순, 3:가나다순
    dataSorting = (sortedKind) => {
        console.log('list Sort sortedKind = ',this.state.sortedKind);
        this.setState({sortedKind:sortedKind});
        this.setState({indicator:true});
        setTimeout(()=> {
            let sortedData=[];
            if (sortedKind == 0) {
                sortedData = this.state.goodsContent.sort((a,b) => {
                    return b.id - a.id;
                })
            }
            else if (sortedKind == 1) {
                sortedData = this.state.goodsContent.sort((a, b) => {
                    return a.distance - b.distance;
                })
            }
            else {
                sortedData = this.state.goodsContent.sort((a, b) => {
                    return a.name.localeCompare(b.name);
                })
            }
            this.setState({goodsContent:sortedData});
            this.setState({ indicator: false });
        },0);
    }

  
    //Web Service 시작
    //사진으로부터 품번 인식 서비스 API
    async callPartsNoAPI(imageURI) {
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

    //등록된 상품 리스트 API
    async callGetGoodsAPI() {
        let manager = new WebServiceManager(Constant.serviceURL + "/GetGoods?login_id=" + this.userID);
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
        const Header_Maximum_Height = 160;
        const Header_Minimum_Height = 120;

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

        console.log('sortKind',this.state.sortedKind);
        console.log('indicator',this.state.indicator);

        return (
            <SafeAreaView style={template.baseContainer}>
                {this.state.indicator && <Indicator/>}
                
                <View style={styles.home_total_view}>
                    {this.state.emptyListViewVisible==false && <Animated.FlatList
                        data={this.state.goodsContent}
                        numColumns={2}
                        horizontal={false}
                        renderItem={({ item, index }) => <ListItem index={index} item={item} navigation={this.props.navigation} refreshListener={this.goGetGoods} />}
                        refreshing={this.state.isRefresh} //새로고침
                        onRefresh={this.goGetGoods}
                        scrollEventThrottle={16}
                        showsVerticalScrollIndicator={false}
                        contentContainerStyle={{ paddingTop: Header_Maximum_Height + Header_Minimum_Height + 10 }}
                        onScroll={Animated.event(
                            [{ nativeEvent: { contentOffset: { y: this.AnimatedHeaderValue } } }],
                            { useNativeDriver: true })}
                        />}
                    {this.state.emptyListViewVisible==true && <EmptyListView isRefresh={this.state.isRefresh} onRefreshListener={this.goGetGoods} contentContainerStyle={{ paddingTop: Header_Maximum_Height }} navigation={this.props.navigation}/>}

                    {/* 화면 상단 제목 부분 */}
                    <Animated.View style={[styles.home_title_view, { transform: [{ translateY: renderHeader }] }]}>
                        <View style={styles.title_total_view}>
                            <View style={[styles.main_title_view]}>
                                <Text style={styles.main_title_text}>
                                    <View style={styles.carIcon_view}>
                                        <CarIcon name="car-wrench" size={50} color="#193067" /> 
                                    </View>
                                    내가 찾는 부품
                                </Text>
                            </View>
                            <View style={[styles.sub_title_view]}>
                                <Text style={styles.sub_title_text}>
                                    손쉽게 검색하고
                                </Text>
                                <Text style={styles.sub_title_text}>
                                    판매/구매까지 바로!
                                </Text>
                            </View>
                        </View>
                    </Animated.View>

                    <Animated.View style={[styles.home_searchbar_view, { height: Header_Minimum_Height, transform: [{ translateY: renderSearchBar }] }]}>
                        <View style={styles.search_section_view}>
                            <View style={styles.searchbar_view}>
                                <Icon style={{ paddingLeft: 10 }} name="search" size={25} color="#193067" />
                                <TextInput
                                    onChange={(value) => this.search(value.nativeEvent.text)}
                                    placeholder="검색어를 입력해주세요.(카메라 가능)"
                                    placeholderTextColor="light grey"
                                    style={styles.search_input_text}
                                    value={this.state.searchKeyWord}
                                />
                            </View>
                            {/* 카메라로 부품번호 검색 */}
                            <View>
                                <TouchableOpacity
                                    style={styles.camera_search_button}
                                    onPress={this.goCameraButtonClicked}>
                                    <CameraIcon name="camera" size={25} color="#193067" />
                                </TouchableOpacity>
                            </View>
                        </View>
                        <View style={styles.sort_section_view}>
                            <View style={styles.goods_total_quantity_view}>
                                <Text style={{ color: 'black' }}>총 상품개수 : </Text>
                                <Text style={{ color: '#113AE2' }}>{this.state.goodsQuantity}</Text><Text style={{ color: 'black' }}>개</Text>
                            </View>
                            <View style={styles.sort_dropdown_view}>
                                <Picker
                                    style={styles.sort_dropdown_view.dropdown_width}
                                    selectedValue={this.state.sortedKind}
                                    onValueChange={(value, index) => this.dataSorting(value)}
                                    mode={'dropdown'}>
                                    {this.sortKind.map((item, i) => <Picker.Item label={item} key={i} value={i} />)}
                                </Picker>
                            </View>
                        </View>
                    </Animated.View>      
                </View>
            </SafeAreaView>
        );
    }
}

export default Home;