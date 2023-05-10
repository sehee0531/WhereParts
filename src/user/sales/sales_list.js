import React, { Component, PureComponent } from 'react';
import { View, Text, Image, TouchableOpacity, FlatList, Modal, ImageBackground, BackHandler, StyleSheet } from 'react-native';

import { styles } from "../../styles/sales/saleslist";

import Constant from '../../util/constatnt_variables';
import WebServiceManager from '../../util/webservice_manager';
import FunctionUtil from '../../util/libraries_function';

import EmptyListView from '../../util/empty_list_view';
import Session from '../../util/session';
import IconMark from 'react-native-vector-icons/FontAwesome5';

import { template,colors } from '../../styles/template/page_style';


export default class SalesDetails extends Component {
    constructor(props) {
        super(props);

        this.contents = []; // 판매중이거나 판매완료된 상품의 원본 리스트
        this.userID = Session.getUserID();
        this.state = {
            goodsConetents: [],     //자신이 등록한 상품 리스트
            salesContents: [],      //판매중이거 완료된 상품 리스트 (saleState값에 따라 filtering)

            saleState:1,            //1:자신이 등록한 상품, 2: 판매중인 상품 3:판매완료된 상품

            isRefresh: false,

            emptyGoodsListViewVisible: false,       //goodsContents 가 비이 었을 경우 true
            emptySalesListViewVisible: false,       //salesContents가 비어 있을 경우 true

            totalPrice:0,                           //판매완료된 상품의 총 금액
            totalCount:0                            //판매완료된 상품의 건수
        };
    }

    componentDidMount() {
        if (Session.isLoggedin()) {
            if (this.props.route.params != null) {
                this.setState({ saleState: this.props.route.params.saleState });
            }
            this.userID = Session.getUserID();
            this.goGetGoods();
            this.goGetSells();
        }
        else
            this.props.navigation.navigate('Login', { nextPage: "SalesList" });

        BackHandler.addEventListener("hardwareBackPress", this.backPressed); //뒤로가기 이벤트
    }

    componentWillUnmount() {
        BackHandler.removeEventListener("hardwareBackPress", this.backPressed);
    }

    //자신이 판매하고 있는 상품보기
    goGetGoods = () => {
        //console.log("refresh selling");
        this.callGetGoodsAPI().then((response) => {
            let visible=false;
            if(response.length==0)
                visible=true;
                
            this.setState({goodsConetents:response, emptyGoodsListViewVisible:visible});
        })
    }

    //판매중이거나 판매완료된 상품보기
    goGetSells = () => {
        //console.log("refresh sell");
        this.callGetSellsAPI().then((response) => {
            this.contents = response;
            let totalPrice=0;
            let totalCount=0;
            this.contents.forEach(element => {
                if(element.status==3) {
                    totalPrice=totalPrice+element.total;
                    totalCount++;
                }
            });
            this.setState({totalPrice:totalPrice, totalCount:totalCount, salesContents: this.dataFiltering()});
        })
    }


    //로그인 된 id값으로 자신이 올린 상품 가져오는 API
    async callGetGoodsAPI() { 
        let manager = new WebServiceManager(Constant.serviceURL + "/GetGoods?id=" + this.userID);
        let response = await manager.start();
        if (response.ok)
            return response.json();
        else
            Promise.reject(response);
    }

    //판매중이거나 완료된 상품보기 API
    async callGetSellsAPI() {
        let manager = new WebServiceManager(Constant.serviceURL + "/GetSells?id=" + this.userID);
        let response = await manager.start();
        if (response.ok)
            return response.json();
        else
            Promise.reject(response);
    }

    //내 상품 보기 버튼 터치
    myGoodsListClicked = () => { 
        this.setState({saleState:1});
    }

    //판매중이거나 판매완료 상품 버튼 터치
    mySaleListClicked = (saleKind) => {  
        this.setState({saleState:saleKind},()=>{this.setState({salesContents: this.dataFiltering()})});
    }


    //판매중이는 status=1 또는 2, 판매완료된 상품은 3
    dataFiltering() {
        let filteredContents = this.contents;
        let visible=false;
        if (this.state.saleState == 3) {
            filteredContents = filteredContents.filter((content) => {
                if (content.status == 3) {
                    return true;
                }
            })
        }
        else {
            filteredContents = filteredContents.filter((content) => {
                if (content.status == 1 || content.status == 2) {
                    return true;
                }
            })
        }
        console.log('[filter]', filteredContents);
        if(filteredContents.length==0)
            visible=true;

        this.setState({emptySalesListViewVisible:visible});
        return filteredContents;
    }

    //뒤로가기 했을 때 현재창 pop하고 MyPage로 페이지 변경
    backPressed = () => {
        this.props.navigation.pop();
        this.props.navigation.push('TabHome', { initialTabMenu: "MyPage" });
        return true;
    }

    render() {
        return (
            <View style={{ flex: 1 }}>
                <View style={styles.wrap}>
                    <View style={[styles.salesdetailsheader, { flexDirection: 'column', alignItems: 'flex-end', }]}>
                        <Text><IconMark name="pen" color={'#14127D'} size={15}/> 판매완료건수: <Text style={{color:'black'}}> {this.state.totalCount}건       </Text>
                        <IconMark name="coins" color={'#14127D'} size={15}/><Text> 총판매금액: <Text style={{color:'black'}}> {FunctionUtil.getPrice(this.state.totalPrice)}원</Text></Text></Text>
                    </View>
                    <View style={{flexDirection: 'row', width:"100%"}}>
                        <View style={this.state.saleState == 1 ? inStyle.selectedBar : inStyle.deSelectedBar}>
                            <TouchableOpacity onPress={this.myGoodsListClicked}><Text style={this.state.saleState == 1 ? inStyle.selectedBarText : inStyle.deSelectedBarText}>나의상품</Text></TouchableOpacity>
                        </View>
                        <View style={ this.state.saleState == 2 ? inStyle.selectedBar : inStyle.deSelectedBar}>
                            <TouchableOpacity onPress={()=>this.mySaleListClicked(2)}><Text style={this.state.saleState == 2 ? inStyle.selectedBarText : inStyle.deSelectedBarText}>판매현황</Text></TouchableOpacity>
                        </View>
                        <View style={this.state.saleState == 3 ? inStyle.selectedBar : inStyle.deSelectedBar}>
                            <TouchableOpacity onPress={()=>this.mySaleListClicked(3)}><Text style={this.state.saleState == 3 ? inStyle.selectedBarText : inStyle.deSelectedBarText}>판매완료</Text></TouchableOpacity>
                        </View>
                    </View>
                </View>
                <View style={{ paddingVertical: '2%', flex: 1, paddingHorizontal: '4%' }}>
                    {/* 나의 상품 보기*/}
                    {this.state.saleState == 1 && this.state.emptyGoodsListViewVisible == false && (
                        <FlatList
                            showsVerticalScrollIndicator={false}
                            data={this.state.goodsConetents}
                            renderItem={({ item, index }) => <MyGoodsListItem navigation={this.props.navigation} item={item} refreshListener={this.goGetGoods} />}
                            refreshing={this.state.isRefresh}
                            onRefresh={this.goGetGoods}
                            scrollEventThrottle={16}
                        />)}
                            
                    {/* 판매중, 판매완료된 상품 보기*/}
                    {this.state.saleState != 1 && this.state.emptySalesListViewVisible == false && (
                        <FlatList
                            showsVerticalScrollIndicator={false}
                            data={this.state.salesContents}
                            renderItem={({ item, index }) => <MySaleListItem navigation={this.props.navigation} item={item} refreshListener={this.goGetSells} />}
                            refreshing={this.state.isRefresh}
                            onRefresh={this.goGetSells}
                            scrollEventThrottle={16}
                        />)}

                    {this.state.saleState == 1 && this.state.emptyGoodsListViewVisible && (<EmptyListView navigation={this.props.navigation} isRefresh={this.state.isRefresh} onRefreshListener={this.goGetGoods} />)}
                    {this.state.saleState != 1 && this.state.emptySalesListViewVisible && (<EmptyListView navigation={this.props.navigation} isRefresh={this.state.isRefresh} onRefreshListener={this.goGetSells} />)}

                </View>

            </View>
        );
    }
}


class MyGoodsListItem extends PureComponent {
    constructor(props) {
        super(props);

        this.state = {
            imageURI: null,
        };
    }

    componentDidMount() {
        this.callGetGoodsImageAPI().then((response) => {
            let reader = new FileReader();
            reader.readAsDataURL(response);
            reader.onloadend = () => {
                this.setState({ imageURI: reader.result })
            }
        });
    }

    goGoodsDetailView = () => {
        const {id,userID,refreshListener} = this.props.item;
        this.props.navigation.navigate('GoodsDetail', { goodsID:id, sellerID:userID,refresh:refreshListener });
    }

    //부품번호에 대한 Goodle 검색창 보이기(Web View)
    goGoodsNumberWebView = () => {
        const {number} = this.props.item;
        this.props.navigation.navigate('GoogleWebView', { url: 'http://www.google.com/search?q=' + number });
    }

    //상품의 대표사진 가져오기
    async callGetGoodsImageAPI() {
        const {id} = this.props.item;
        let manager = new WebServiceManager(Constant.serviceURL + "/GetGoodsImage?id=" + id + "&position=1");
        let response = await manager.start();
        if (response.ok)
            return response.blob();
    }

    render() {
        const item = this.props.item;
        return (
            <TouchableOpacity onPress={this.goGoodsDetailView}>
                <View style={styles.product}>
                    <View style={{ borderBottomColor: '#D1D1D1', borderBottomWidth: 1, flexDirection: 'row', paddingBottom: '2%' }}>
                        <View style={{ flex: 3, alignItems: 'flex-start' }}>
                            <Text style={styles.itemNameText}>{item.name.length > 20 ? `${item.name.slice(0, 20)}...` : item.name}</Text>
                        </View>
                        <View style={{ flex: 1, alignItems: 'flex-end' }}>
                            {item.valid == 0 && <Text style={{ fontSize: 14 }}>숨김</Text>}
                        </View>
                    </View>
                    <View style={{ flexDirection: 'row', flex: 5, paddingTop: '3%', paddingBottom: '2%' }}>
                        <View style={styles.imageView}>
                            <Image
                                source={{ uri: this.state.imageURI }}
                                style={styles.productImage} />
                        </View>
                        <View style={[styles.productInfo, { paddingLeft: '2%', alignItems: 'flex-end', justifyContent: 'flex-end' }]}>
                            {/*  <Text style={styles.itemNameText}>{item.name}</Text> */}
                            <TouchableOpacity onPress={this.goGoodsNumberWebView}><Text style={styles.itemNumberText}><Text style={{ color: 'grey'}}>부품번호 : </Text>{item.number}</Text></TouchableOpacity>
                            <Text style={styles.itemPriceText}><Text style={{ color: 'grey'}}>가격/수량 : </Text>{FunctionUtil.getPrice(item.price)}<Text>원 / {item.quantity}{"개"}</Text></Text>
                            <Text style={styles.itemRegisterDateText}><Text style={{ color: 'grey'}}>등록일 : </Text>{item.registerDate.slice(0, 10)}</Text>
                        </View>
                    </View>
                </View>
            </TouchableOpacity>
        );
    }
}

class MySaleListItem extends PureComponent {
    constructor(props) {
        super(props);

        this.state = {
            imageURI: null,
        };
    }

    componentDidMount() {
        this.callGetGoodsImageAPI().then((response) => {
            let reader = new FileReader();
            reader.readAsDataURL(response);
            reader.onloadend = () => {
                this.setState({ imageURI: reader.result })
            }
        });
    }
    goDeliveryDetailScreen = () => {
        const logisInfo = { code: "04", invoice: "651969374875" };
        this.props.navigation.navigate('DeliveryDetail', { logisInfo: logisInfo });
    }

    //부품번호에 대한 Goodle 검색창 보이기(Web View)
    goGoodsNumberWebView = () => {
        const {goodsNo} = this.props.item;
        this.props.navigation.navigate('GoogleWebView', { url: 'http://www.google.com/search?q=' + goodsNo });
    }

    //상품의 대표 이미지 가져오기
    async callGetGoodsImageAPI() {
        const {goodsID} = this.props.item;
        let manager = new WebServiceManager(Constant.serviceURL + "/GetGoodsImage?id=" + goodsID + "&position=1");
        let response = await manager.start();
        if (response.ok)
            return response.blob();
    }

    render() {
        const item = this.props.item;

        return (
            <View style={[styles.product, { flexDirection: 'column' }]}>
                <View style={{ paddingBottom: '2%', borderBottomWidth: 1, borderColor: '#E9E9E9', flexDirection: 'row' }}>
                    <View style={{ flex: 3, alignItems: 'flex-start' }}>
                        <Text style={styles.itemNameText}>{item.goodsName.length > 20 ? `${item.goodsName.slice(0, 20)}...` : item.goodsName}</Text>
                    </View>
                    <View style={{ flex: 1, alignItems: 'flex-end' }}>
                        <Text style={{ fontSize: 16, color: 'black' }}>{item.quantity}{"개"}</Text>
                    </View>
                </View>
                <View style={{ flexDirection: 'row', paddingBottom: '2%', paddingTop: '2%' }}>
                    {item.status != 3 &&
                    <View style={styles.productInfo}>
                        <Text style={{ fontSize: 15, fontFamily: 'Pretendard-Medium', color: 'black' }}><Text style={{ color: 'grey', fontSize: 15 }}>주문번호: </Text>{item.orderNo}</Text>                               
                        <TouchableOpacity onPress={this.goGoodsNumberWebView}>
                            <Text style={[styles.itemNumberText, { color: 'grey', fontSize: 15, }]}>부품번호:
                                <Text style={{ color: 'blue' }}>{item.goodsNo}</Text>
                            </Text>
                        </TouchableOpacity>   
                        <Text style={styles.itemPriceText}><Text style={{ color: 'grey', fontSize: 15 }}>결제: </Text>{FunctionUtil.getPrice(item.price * item.quantity)}원/<Text style={{ fontSize: 15, color: 'black' }}>카드</Text></Text>
                        <Text style={styles.itemRegisterDateText}><Text style={{ color: 'grey', fontSize: 15 }}>주문일: </Text>{item.orderingDate.slice(0, 10)}</Text>
                    </View>}

                    <View style={styles.imageView}>
                        <Image
                            source={{ uri: this.state.imageURI }}
                            style={styles.productImage} />
                    </View>

                    {item.status == 3 &&
                    <View style={[styles.productInfo, { flexDirection: 'column', alignItems: 'flex-end', justifyContent: 'flex-end' }]}>
                        <View style={{ flex: 1, alignItems:'flex-end' }}>
                            <Text style={{ fontSize: 14, fontFamily: 'Pretendard-Medium', color: 'black' }}><Text style={{ color: 'grey'}}>주문번호: </Text> {item.orderNo}</Text>
                            <Text style={[styles.itemRegisterDateText,{fontSize:14}]}><Text style={{ color: 'grey' }}>주문일: </Text> {item.days[0].slice(0, 10)}</Text>
                            <Text style={[styles.itemPriceText,{fontSize:14}]}><Text style={{ color: 'grey'}}>결제:</Text> {FunctionUtil.getPrice(item.price * item.quantity)}원/<Text>{item.payKind}</Text></Text>
                        </View>
                        <View style={{ flexDirection: 'row' }}>
                            <View style={{ flex: 1, alignItems: 'flex-end',  borderColor: 'grey', paddingRight: '1%' }}>
                            <Text style={[styles.itemRegisterDateText,{fontSize:14}]}><Text style={{ color: 'grey'}}>배송/완료일: </Text>{item.days[1].slice(0, 10)} /</Text>
                                {/*   <TouchableOpacity onPress={this.goGoodsNumberWebView}><Text style={styles.itemNumberText}>{item.goodsNo}</Text></TouchableOpacity> */}
                                
                            </View>
                            <View style={{ alignItems: 'flex-end', }}>
                                <Text style={[styles.itemRegisterDateText,{fontSize:14}]}>{item.days[2].slice(0, 10)}</Text>
                            </View>
                        </View>
                    </View>}

                </View>
                {item.status == 1 && 
                    <TouchableOpacity style={[styles.productInfoRight]} onPress={() => this.props.navigation.navigate('AddDelivery', { id: item.id, navigation: this.props.navigation, refresh: this.props.refreshListener })}>
                        <Text style={[styles.itemDistanceText, { color: "blue" }]}>배송등록</Text>
                    </TouchableOpacity>}

                {item.status == 2 &&
                        <TouchableOpacity style={styles.productInfoRight} onPress={this.goDeliveryDetailScreen}>
                            <Text style={[styles.itemDistanceText, { color: "blue" }]}><Text style={[styles.itemDistanceText]}>운송장번호: </Text>{item.invoiceNo} </Text>
                        </TouchableOpacity>}
            </View>
        );
    }
}





const inStyle = StyleSheet.create({
    selectedBar:[
        {
            borderWidth:0,
            borderBottomWidth:2,
            width: "33.3%",
            borderBottomColor: "#EE636A",
            alignItems: 'center'
        }
    ],

    deSelectedBar:[
        {
            borderWidth:0,
            borderBottomWidth:0,
            width: "33.3%",
            borderBottomColor: "#EE636A",
            alignItems: 'center'
        }
    ],

    selectedBarText:[
        template.largeText,
        {
            fontWeight: 'bold',
            color: colors.red,
            paddingBottom:10,
        }
    ],
    deSelectedBarText:[
        template.largeText,
        {
            fontWeight: 'bold',
            color: colors.dark,
            paddingBottom:10,
        }
    ]
});