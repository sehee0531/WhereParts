import React, { Component, PureComponent } from 'react';
import { View, Text, Image, TouchableOpacity, FlatList, Modal, ImageBackground } from 'react-native';

import { styles } from "../../styles/saleslist";

import Constant from '../../util/constatnt_variables';
import WebServiceManager from '../../util/webservice_manager';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/MaterialIcons';
import DetailItemView from "../../goods/list/components/item_detail";
import { color } from 'react-native-reanimated';


export default class SalesDetails extends Component {
    constructor(props) {
        super(props);
        this.contents = [];
        this.state = {
            userIDContents: [],
            soldoutContents: [],
            salebarclicked: false,//판매중
            shippingbarclicked: false,//배송정보입력
            soldoutbarclicked: false//판매완료
        };
    }

    componentDidMount() {
        this.setState({ salebarclicked: true })
        this.getUserID().then((value) => {
            this.callGetSellsAPI(value).then((response) => {
                this.setState({ soldoutContents: response });
                //console.log(this.state.soldoutContents)              
            })
            this.callGetGoodsIdAPI(value).then((response) => {
                this.contents = response;
                this.setState({ userIDContents: response });
                //console.log(this.state.userIDContents)
            })
        })
    }

    goSellGoods = () => {
        this.getUserID().then((value) => {
            this.callGetSellsAPI(value).then((response) => {
                this.setState({ soldoutContents: response });
            })
        });
    }

    async callGetGoodsIdAPI(userID) { //로그인 된 id값으로 올린 상품 가져오는 API
        let manager = new WebServiceManager(Constant.serviceURL + "/GetGoods?id=" + userID);
        let response = await manager.start();
        if (response.ok)
            return response.json();
        else
            Promise.reject(response);
    }

    async callGetSellsAPI(userID) {
        let manager = new WebServiceManager(Constant.serviceURL + "/GetSells?id=" + userID)
        let response = await manager.start();
        if (response.ok)
            return response.json();
        else
            Promise.reject(response);
    }

    async getUserID() {
        let obj = await AsyncStorage.getItem('obj')
        let parsed = JSON.parse(obj);
        if (obj !== null) {
            return parsed.id;
        }
        else {
            return false;
        }
    }

    saleBarClicked = () => { //판매중
        this.setState({ delivery: false, salebarclicked: true, shippingbarclicked: false, soldoutbarclicked: false });
    }

    shippingBarClicked = () => { //배송정보입력
        this.setState({ salebarclicked: false, shippingbarclicked: true, soldoutbarclicked: false });
    }

    soldout = () => { //판매완료
        this.setState({ salebarclicked: false, shippingbarclicked: false, soldoutbarclicked: true });
    }

    render() {
        {/*console.log(this.userID)*/ }
        return (
            <View style={{ flex: 1 }}>
                <View style={styles.wrap}>
                    <View style={styles.salesdetailsheader}>
                        <Text style={styles.headertext}> 나의 판매내역</Text>
                        <Icon style={{ marginLeft: "58%" }} name="account-circle" size={60} color={'lightgrey'}></Icon>
                    </View>
                    <View style={{ flexDirection: 'row', width: "100%" }}>
                        <View style={{ borderBottomWidth: this.state.salebarclicked ? 1 : 0, width: "33.3%", alignItems: 'center' }}>
                            <TouchableOpacity onPress={this.saleBarClicked}><Text style={[styles.slidertext, { color: this.state.salebarclicked ? "#EE636A" : "black" }]}>판매중</Text></TouchableOpacity>
                        </View>
                        <View style={{ borderBottomWidth: this.state.shippingbarclicked ? 1 : 0, width: "33.3%", alignItems: 'center' }}>
                            <TouchableOpacity onPress={this.shippingBarClicked}><Text style={[styles.slidertext, { color: this.state.shippingbarclicked ? "#EE636A" : "black" }]}>배송정보입력</Text></TouchableOpacity>
                        </View>
                        <View style={{ borderBottomWidth: this.state.soldoutbarclicked ? 1 : 0, width: "33.3%", alignItems: 'center' }}>
                            <TouchableOpacity onPress={this.soldout}><Text style={[styles.slidertext, { color: this.state.soldoutbarclicked ? "#EE636A" : "black" }]}>판매완료</Text></TouchableOpacity>
                        </View>
                    </View>
                </View>

                {this.state.salebarclicked == true && (<FlatList
                    data={this.state.userIDContents}
                    renderItem={({ item, index }) => <ListItem navigation={this.props.navigation} item={item} id={item.id} />}
                    scrollEventThrottle={16}
                />)}
                {this.state.shippingbarclicked == true && (<FlatList
                    data={this.state.soldoutContents}
                    renderItem={({ item, index }) => <DeliveryInfoList navigation={this.props.navigation} item={item} id={item.goodsID} goSellGoodsListener={this.goSellGoods} />}
                    scrollEventThrottle={16}
                />)}
                {this.state.soldoutbarclicked == true && (<FlatList
                    data={this.state.soldoutContents}
                    renderItem={({ item, index }) => <SoldOutInfoList navigation={this.props.navigation} item={item} id={item.goodsID} />}
                    scrollEventThrottle={16}
                />)}
            </View>
        );
    }
}

class ListItem extends PureComponent {
    constructor(props) {
        super(props);

        this.state = {
            imageURL: null,
            isDetailViewModal: false,
        };
    }

    componentDidMount() {
        this.callGetGoodsImageAPI().then((response) => {
            let reader = new FileReader();
            reader.readAsDataURL(response);
            reader.onloadend = () => {
                this.setState({ imageURL: reader.result })
            }
        });
    }

    handleDetailViewModal = () => {
        //this.setState({isDetailViewModal:!this.state.isDetailViewModal});
        this.props.navigation.navigate('GoodsDetail', { id: this.props.item.id, userID: this.props.item.userID });
    }

    async callGetGoodsImageAPI() {
        let manager = new WebServiceManager(Constant.serviceURL + "/GetGoodsImage?id=" + this.props.id + "&position=1");
        let response = await manager.start();
        if (response.ok)
            return response.blob();
    }

    render() {
        const item = this.props.item;
        return (
            <>
                <TouchableOpacity onPress={this.handleDetailViewModal}>
                    <View style={styles.product}>
                        <View style={styles.productRegisterDate}>
                            <Text style={styles.itemRegisterDateText}>등록일 {item.registerDate.slice(2, 10)}</Text>
                        </View>
                        {/*이미지 */}
                        <View style={styles.productImageView}>
                            <Image
                                source={{ uri: this.state.imageURL }}
                                style={styles.productImage} />

                            <View style={styles.productInfo}>
                                <View style={styles.productInfoLeft}>
                                    <Text style={styles.itemNameText}>{item.name}</Text>
                                    <View style={{ flexDirection: 'row' }}>
                                        <Text style={styles.itemPriceText}>{item.price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}{"원"}</Text>
                                        <Text style={{ fontSize: 17, color: 'lightgrey' }}> |</Text>
                                        <Text style={styles.itemPriceText}> {item.quantity}{"개"}</Text>
                                    </View>
                                    <Text style={styles.itemNumberText}>{item.number}</Text>
                                </View>
                            </View>
                            {item.valid == 0 && <View style={{ marginRight: '4%' }}>
                                <Text style={{ fontSize: 14 }}>숨김</Text>
                            </View>}
                        </View>
                    </View>
                </TouchableOpacity>
                <Modal animationType="slide" transparent={true} visible={this.state.isDetailViewModal}>
                    <DetailItemView detailViewModalListener={(value) => { this.setState({ isDetailViewModal: value }) }} item={item} />
                </Modal>
            </>
        );
    }
}

class DeliveryInfoList extends PureComponent {
    constructor(props) {
        super(props);

        this.state = {
            imageURL: null,
        };
    }

    componentDidMount() {
        this.callGetGoodsImageAPI().then((response) => {
            let reader = new FileReader();
            reader.readAsDataURL(response);
            reader.onloadend = () => {
                this.setState({ imageURL: reader.result })
            }
        });
    }

    async callGetGoodsImageAPI() {
        let manager = new WebServiceManager(Constant.serviceURL + "/GetGoodsImage?id=" + this.props.id + "&position=1");
        let response = await manager.start();
        if (response.ok)
            return response.blob();
    }

    render() {
        const item = this.props.item;

        return (
            <>
                {(item.status == 1 || item.status == 2) &&
                    (<View style={styles.product}>
                        <View style={styles.productRegisterDate}>
                            <Text style={styles.itemRegisterDateText}>주문일 {item.orderingDate.slice(2, 10)}</Text>
                        </View>
                        {/*이미지 */}
                        <View style={styles.productImageView}>
                            <Image
                                source={{ uri: this.state.imageURL }}
                                style={styles.productImage} />

                            <View style={styles.productInfo}>
                                <View style={styles.productInfoLeft}>
                                    <Text style={styles.itemNameText}>{item.goodsName}</Text>
                                    <View style={{ flexDirection: 'row' }}>
                                        <Text style={styles.itemPriceText}>{item.price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}{"원"}</Text>
                                        <Text style={{ fontSize: 17, color: 'lightgrey' }}> |</Text>
                                        <Text style={styles.itemPriceText}> {item.quantity}{"개"}</Text>
                                    </View>
                                    <Text style={styles.itemNumberText}>{item.goodsNo}</Text>
                                </View>
                            </View>
                        </View>
                        {item.status == 1 && <TouchableOpacity style={styles.productInfoRight} onPress={() => this.props.navigation.navigate('AddDelivery', { id: item.id, navigation:this.props.navigation, refresh : this.props.goSellGoodsListener })}>
                            <Text style={[styles.itemDistanceText, { color: "blue" }]}>배송등록</Text>
                        </TouchableOpacity>}

                        {item.status == 2 && <TouchableOpacity style={styles.productInfoRight}>
                            <Text style={styles.itemDistanceText}>배송등록완료</Text>
                        </TouchableOpacity>}

                    </View>
                    )}
            </>
        );
    }
}

class SoldOutInfoList extends PureComponent {
    constructor(props) {
        super(props);

        this.state = {
            imageURL: null,
        };

    }

    componentDidMount() {
        this.callGetGoodsImageAPI().then((response) => {
            let reader = new FileReader();
            reader.readAsDataURL(response);
            reader.onloadend = () => {
                this.setState({ imageURL: reader.result })
            }
        });
    }

    async callGetGoodsImageAPI() {
        let manager = new WebServiceManager(Constant.serviceURL + "/GetGoodsImage?id=" + this.props.id + "&position=1");
        let response = await manager.start();
        if (response.ok)
            return response.blob();
    }

    render() {
        const item = this.props.item;
        return (
            <>
                {item.status == 3 &&
                    (<View style={styles.product}>
                        <View style={styles.productRegisterDate}>
                            <Text style={styles.itemRegisterDateText}>주문일 {item.orderingDate.slice(2, 10)}</Text>
                        </View>
                        {/*이미지 */}
                        <View style={styles.productImageView}>
                            <Image
                                source={{ uri: this.state.imageURL }}
                                style={styles.productImage} />

                            <View style={styles.productInfo}>
                                <View style={styles.productInfoLeft}>
                                    <Text style={styles.itemNameText}>{item.goodsName}</Text>
                                    <View style={{ flexDirection: 'row' }}>
                                        <Text style={styles.itemPriceText}>{item.price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}{"원"}</Text>
                                        <Text style={{ fontSize: 17, color: 'lightgrey' }}> |</Text>
                                        <Text style={styles.itemPriceText}> {item.quantity}{"개"}</Text>
                                    </View>
                                    <Text style={styles.itemNumberText}>{item.goodsNo}</Text>
                                </View>
                            </View>
                        </View>
                    </View>
                    )}
            </>
        );
    }
}