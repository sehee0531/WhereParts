import React, { Component } from 'react';
import { View, Text, ScrollView, BackHandler, TouchableOpacity } from 'react-native';

import { template } from "../../styles/template/page_style";
import { styles } from "../../styles/payment";

class PayComplete extends Component {
    constructor(props) {
        super(props);
        this.payload = this.props.route.params.payload;


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
        const { name, number, price, quantity } = this.payload;
        return (
            <View style={template.total_container}>
                <ScrollView>
                    <View style={template.container}>
                        <Text>결제가 완료되었습니다</Text>
                        <View style={[styles.indexView,{marginBottom: 20 }]}>
                            <Text style={styles.indexText}>주문상품</Text>
                            <Text> 상품명 : {name}</Text>
                            <Text> 상품번호 : {number}{"\n"}</Text>
                            <View style={{ flexDirection: 'row' }}>
                                <Text style={{ fontSize: 20, color: 'black' }}> {price}원</Text>

                            </View>
                        </View>
                        <View style={[styles.indexView,{marginBottom: 20 }]}>
                            <Text style={styles.indexText}>결제정보</Text>
                            <Text> 결제카드 : 농협</Text>
                            <Text> 할부기간 : 일시불</Text>
                            <Text> 결제금액 : {price}원</Text>
                            <Text> 상품번호 : {number}</Text>
                        </View>
                        <View style={[styles.indexView,{marginBottom: 20 }]}>
                            <Text style={styles.indexText}>배송지</Text>
                            <Text> 홍길동</Text>
                            <Text> (50834) 경남 김해시 인제로 197  </Text>
                            <Text> 010-1234-5678  </Text>
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