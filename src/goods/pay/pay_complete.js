import React, { Component } from 'react';
import { View, Text, ScrollView, BackHandler, TouchableOpacity } from 'react-native';

import { template } from "../../styles/template/page_style";
import { styles } from "../../styles/payment";


class PayComplete extends Component {
    constructor(props) {
        super(props);
        this.result = this.props.route.params.result;

        console.log('result',this.result);

        BackHandler.addEventListener("hardwareBackPress", this.backPressed);
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

    render() {
        const { orderNo, goodsID, total, address,buyerTel, payBank } = this.result;
        return (
            <View style={template.total_container}>
                <ScrollView>
                    <View style={template.container}>
                        <Text>결제가 완료되었습니다</Text>
                        <View style={[styles.indexView,{marginBottom: 20 }]}>
                            <Text style={styles.indexText}>주문상품</Text>
                            <Text> 상품명 : {orderNo}</Text>
                            <Text> 상품번호 : {orderNo}{"\n"}</Text>
                            <View style={{ flexDirection: 'row' }}>
                                <Text style={{ fontSize: 20, color: 'black' }}> {total}원</Text>

                            </View>
                        </View>
                        <View style={[styles.indexView,{marginBottom: 20 }]}>
                            <Text style={styles.indexText}>결제정보</Text>
                            <Text> 결제카드 : {payBank}</Text>
                            <Text> 할부기간 : 일시불</Text>
                            <Text> 결제금액 : {total}원</Text>
                            <Text> 상품번호 : {goodsID}</Text>
                        </View>
                        <View style={[styles.indexView,{marginBottom: 20 }]}>
                            <Text style={styles.indexText}>배송지</Text>
                            <Text> {buyerTel}</Text>
                            <Text> {address}  </Text>
                            <Text> {buyerTel}  </Text>
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