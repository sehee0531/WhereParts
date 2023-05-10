import React, { Component } from 'react';
import { View, Text, ScrollView, BackHandler, TouchableOpacity } from 'react-native';

import { template } from "../../styles/template/page_style";
import { styles } from "../../styles/pay/pay_complete";
import WebServiceManager from '../../util/webservice_manager';
import Constant from '../../util/constatnt_variables';

import FunctionUtil from '../../util/libraries_function';

class PayComplete extends Component {
    constructor(props) {
        super(props);
        this.orderID = this.props.route.params.orderID;

        this.state={
            item:{}
        }

        BackHandler.addEventListener("hardwareBackPress", this.backPressed);
    }

    componentDidMount() {
        this.callGetOrderDetailAPI().then((response)=> {
            console.log(response);
            this.setState({item:response});
        });
    }

    componentWillUnmount() {        
        console.log('뒤로가기 했을 때 홈으로')
        BackHandler.removeEventListener('hardwareBackPress', this.backPressed);
    }

    backPressed = () => {
        this.props.navigation.navigate('Home');
        return true;
    }
    goHomeScreen = () => {
        this.props.navigation.navigate('Home');
    }
    goBuyListScreen = () => {
        this.props.navigation.navigate('BuyList');
    }

    goReceiptWebView=()=> {
        this.props.navigation.navigate('GoogleWebView',{url:this.state.item.billURL});
    }

    async callGetOrderDetailAPI() {
        let manager = new WebServiceManager(Constant.serviceURL + "/GetOrderDetail?id=" + this.orderID);
        let response = await manager.start();
        if (response.ok) {
            return response.json();
        }
        else
            Promise.reject(response);
    }

    render() {
        const { orderNo, goodsName, goodsNo, 
                quantity, payBank, total, address,
                buyerName, buyerTel,zipCode } = this.state.item;
        return (
            <View style={template.baseContainer}>
                <ScrollView>
                    <View style={[template.container,{marginTop:'3%'}]}>
                        <Text>결제가 완료되었습니다</Text>
                        <View style={[styles.indexView,{marginBottom: 20 }]}>
                            <Text style={styles.indexText}>주문상품</Text>
                            <Text> 주문번호 : {orderNo}</Text>
                            <Text> 상품명 : {`${goodsName}`.length > 20 ? `${goodsName.slice(0, 20)}...` : goodsName}</Text>
                            <Text> 상품번호 : {goodsNo}</Text>
                            <Text> 수량 : {quantity}{"\n"}</Text>
                            <View style={{ flexDirection: 'row' }}>
                                <Text style={{ fontSize: 20, color: 'black' }}> {FunctionUtil.getPrice(`${total}`)}원</Text>

                            </View>
                        </View>
                        <View style={[styles.indexView,{marginBottom: 20 }]}>
                            <Text style={styles.indexText}>결제정보</Text>
                            <Text> 결제카드 : {payBank}</Text>
                            <Text> 할부기간 : 일시불</Text>
                            <Text> 결제금액 : {FunctionUtil.getPrice(`${total}`)}원</Text>
                            <TouchableOpacity onPress={this.goReceiptWebView}>
                                <Text style={{color:'blue'}}> 영수증 보기</Text>
                            </TouchableOpacity>
                        </View>
                        <View style={[styles.indexView,{marginBottom: 20 }]}>
                            <Text style={styles.indexText}>배송지</Text>
                            <Text> {buyerName}</Text>
                            <Text> {buyerTel}</Text>
                            <Text> {address}  </Text>
                            <Text> {zipCode}  </Text>
                        </View>
                        <View style={styles.buttonView}>
                            <TouchableOpacity style={[styles.goListButton,{marginRight:10}]} onPress={this.goHomeScreen}><Text style={styles.buyButtonText}>홈으로</Text></TouchableOpacity>
                            <TouchableOpacity style={styles.goListButton} onPress={this.goBuyListScreen}><Text style={styles.buyButtonText}>구매목록</Text></TouchableOpacity>
                        </View>

                    </View>

                </ScrollView>
            </View>
        );
    }
}
export default PayComplete;