import React, { Component } from 'react';
import { View, Text, ScrollView, TouchableOpacity, NativeModules,Pressable, TextInput } from 'react-native';

import Address from "../../goods/pay/address";
import { Picker } from '@react-native-picker/picker';

import Constant from '../../util/constatnt_variables';
import WebServiceManager from '../../util/webservice_manager';
import { template } from "../../styles/template/page_style";
import { styles } from "../../styles/payment";
class Payment extends Component {
    constructor(props) {
        super(props);

        this.item = this.props.route.params.item;
        this.userID = this.props.route.params.userID;

        this.state={
            zonecode:'',
            detailAddress:'',
            defaultAddress:'',

            quantity:1,
            paymentMethod:1,
            buyerName:"",
            buyerTel:"",
            address:"",
            bigo:"배송요청사항",
        }
    }

    callAndroidPaymentActivity = () => {
        const { ActivityStartModule } = NativeModules;
        ActivityStartModule.startPayment(JSON.stringify(this.payload), failedListener = (message) => {
            console.log('취소',message);
        }, successListener = (message) => {
            console.log('완료',message);
            this.props.navigation.navigate('PayComplete',{payload:this.payload});
        });nt
    }

    countPlus=()=>{
        if( this.state.quantity>0 && this.state.quantity < this.item.quantity)
            this.setState({quantity:this.state.quantity+1});
    }

    countMinus=()=>{
        if (this.state.quantity <= 1) {
            this.setState({ quantity: 1 });
        }
        else {
            this.setState({ quantity: this.state.quantity - 1 });
        }
    }

    paymentButtonClicked = () => {
        const payload = { 
            buyerID:this.userID,
            goodsID:this.item.id,
            buyerName:this.state.buyerName,
            buyerTel:this.state.buyerTel,
            quantity:this.state.quantity,
            price:this.item.price,
            total:(this.item.price*this.state.quantity),
            payKind:this.state.paymentMethod,
            payBank:"우리",
            address:this.props.route.params.roadAddr + " " + this.state.detailAddress,
            bigo:this.state.bigo,
        };

        console.log("결제정보",payload);
        this.callAddOrderAPI(payload).then((response) => {
            console.log("구매완료", response);
        });

        this.props.navigation.navigate("Home");
    }

    async callAddOrderAPI(value){
        let manager = new WebServiceManager(Constant.serviceURL+"/AddOrder", "post");

        const payload = value;
        console.log("payload", payload);
        manager.addFormData("data", {
            buyerID:payload.buyerID,
            goodsID:payload.goodsID,
            buyerName:payload.buyerName,
            buyerTel:payload.buyerTel,
            quantity:payload.quantity,
            price:payload.price,
            total:payload.total,
            payKind:payload.payKind,
            payBank:payload.payBank,
            address:payload.address,
            bigo:payload.bigo,
        });

        let response = await manager.start();
        if (response.ok) {
            return response.json();
        }
    }

    render() {
        return (
            <View style={template.total_container}>
                <ScrollView style={template.ScrollView}>
                    <View style={template.container}>
                        <View style={styles.indexView}>
                            <Text style={styles.indexText}>주문상품</Text>
                            <Text> 상품명 : {this.item.name}</Text>
                            <Text> 상품번호 : {this.item.number}{"\n"}</Text>
                            <View style={{flexDirection:'row'}}>
                                <Text style={styles.priceText}> {this.item.price*this.state.quantity}원</Text>
                                <View style={styles.selectQuantityView}>
                                    <Pressable onPress={() => this.countMinus(this.state.quantity)} style={styles.quantityItem}>
                                        <Text style={styles.quantityItemText}>-</Text>
                                    </Pressable>

                                    <View style={[styles.quantityItem, styles.quantityCount]}>
                                        <Text style={styles.quantityItemText}>{this.state.quantity}</Text>
                                    </View>

                                    <Pressable onPress={() => this.countPlus(this.state.quantity)} style={styles.quantityItem}>
                                        <Text style={styles.quantityItemText}>+</Text>
                                    </Pressable>
                                </View>
                            </View>                                                
                        </View>

                        <View style={[styles.indexView,{marginTop: 20}]}>
                            <Text style={styles.indexText}>결제수단</Text>
                            <Picker
                                selectedValue={this.state.paymentMethod}
                                onValueChange={(value, index) => { this.setState({ paymentMethod: value }) }}>
                                <Picker.Item label='카드결제' value="1" />
                                <Picker.Item label='계좌이체' value="2" />
                            </Picker>
                        </View>
                        {/* 주소 */}
                        <View style={styles.container}>
                            <View style={styles.deliverView}>
                                <Text style={styles.title}>배송지 정보</Text>
                                <TextInput style={styles.textInput}
                                    placeholder="주문자 이름을 입력하세요"
                                    onChangeText={(value) => this.setState({ buyerName: value })}
                                    value={this.state.buyerName} />
                                <TextInput style={styles.textInput}
                                    placeholder="휴대폰 번호를 입력하세요"
                                    onChangeText={(value) => this.setState({ buyerTel: value })}
                                    value={this.state.buyerTel} />
                            </View>
                            <Text style={styles.title}>주소</Text>
                            <View style={styles.rowLayout}>
                                <View style={styles.number_text}>
                                    <Text style={styles.text}>{this.props.route.params.zipNo}</Text>
                                </View>

                                <TouchableOpacity activeOpacity={0.8} style={styles.btn} onPress={() => this.props.navigation.navigate("SearchAddress")}>
                                    <Text style={styles.btn_text}>우편번호 찾기</Text>
                                </TouchableOpacity>
                            </View>

                            <View style={styles.address_text}>
                                <Text style={styles.text}>{this.props.route.params.roadAddr}</Text>
                            </View>

                            <TextInput style={styles.textInput}
                                placeholder="상세 주소를 입력하세요"
                                onChangeText={(value) => this.setState({ detailAddress: value })}
                                value={this.state.detailAddress} />

                            <TextInput style={styles.textInput}
                                placeholder="배송요청사항"
                                onChangeText={(value) => this.setState({ bigo: value })}
                                value={this.state.bigo} />
                        </View>
                                             
                    </View>
                </ScrollView>
                <TouchableOpacity style={styles.paymentButton} onPress={this.paymentButtonClicked}/*onPress={this.callAndroidPaymentActivity}*/><Text style={styles.buyButtonText}>결제하기</Text></TouchableOpacity>
            </View>
        );
    }
}

export default Payment;