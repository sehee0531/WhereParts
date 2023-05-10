import React, { Component } from 'react';
import { View, Text, ScrollView, TouchableOpacity, NativeModules, Pressable, TextInput, Image, Keyboard, Alert } from 'react-native';

import Constant from '../../util/constatnt_variables';
import WebServiceManager from '../../util/webservice_manager';
import FunctionUtil from '../../util/libraries_function';

import { template } from "../../styles/template/page_style";
import { styles } from "../../styles/pay/payment";
import QuantityEditIcon from 'react-native-vector-icons/Feather';

class Payment extends Component {
    constructor(props) {
        super(props);

        this.buyerName = React.createRef();
        this.buyerTel = React.createRef();

        this.item = this.props.route.params.item;
        this.userID = this.props.route.params.userID;

        this.state = {
            imageURL: null,
            buyerName: "",
            buyerTel: "",
            zipNo: "",
            roadAddr: "",
            address: "",
            detailAddress: '',
            bigo: "",
            validForm: false,
            
            quantity: 1,
            paymentMethod: 1,
            orderNo: null
        }
    }

    componentDidMount() {
        console.log('item=', this.item);
        this.callGetGoodsImageAPI(this.item.id).then((response) => {
            let reader = new FileReader();
            reader.readAsDataURL(response);
            reader.onloadend = () => {
                this.setState({ imageURL: reader.result })
            }
        });

        this.callGetOrderNoAPI().then((response) => {
            console.log('orderNo', response);
            if (response.success == 1)
                this.setState({ orderNo: response.orderNo });
            else {
                Alert.alert('구매불가', '일시적인 오류로 상품을 구매할 수 없습니다.', [
                    { text: '확인', onPress: () => { this.props.navigation.pop() } },
                ]);
            }
        });
    }


    countPlus = () => {
        if (this.state.quantity > 0 && this.state.quantity < this.item.quantity)
            this.setState({ quantity: this.state.quantity + 1 });
    }

    countMinus = () => {
        if (this.state.quantity <= 1) {
            this.setState({ quantity: 1 });
        }
        else {
            this.setState({ quantity: this.state.quantity - 1 });
        }
    }

    getAddressInfo = (zipNo, roadAddr) => {
        this.onValueChange({ zipNo: zipNo, roadAddr: roadAddr });
    }

    onValueChange = (value) => {
        this.setState(value, () => {
            let isValidForm = true;

            //주문자
            if (this.state.buyerName.length == 0) {
                isValidForm = false;
            }
            //연락처
            if (this.state.buyerTel.length == 0) {
                isValidForm = false;
            }
            //우편번호
            if (this.state.zipNo.trim().length == 0) {
                isValidForm = false;
            }
            //도로명주소
            if (this.state.roadAddr.trim().length == 0) {
                isValidForm = false;
            }
            //상세주소
            if (this.state.detailAddress.length == 0) {
                isValidForm = false;
            }
            this.setState({ validForm: isValidForm });
        });
    }

    //결제하기 버튼 클릭시
    paymentButtonClicked = () => {
        const { id, name, price } = this.item;
        const payload = {
            orderNo: this.state.orderNo,
            goodsName: name,
            goodsID: id,
            quantity: this.state.quantity,
            price: price
        };
        this.callAndroidPaymentActivity(payload);
    }

    //안드로이 네이티브 결제 액티비티 호출
    callAndroidPaymentActivity = (payload) => {
        console.log("결제정보", payload);
        const { ActivityStartModule } = NativeModules;
        ActivityStartModule.startPayment(JSON.stringify(payload), failedListener = (message) => {
            console.log('취소', message);
        }, successListener = (message) => {
            console.log('완료', message);
            const paymentData = JSON.parse(message);
            console.log('data=', paymentData.data);
            const addOrderData = this.getAddOrderData(paymentData);
            console.log('payment data=', addOrderData);

            this.callAddOrderAPI(addOrderData).then((response) => {
                console.log('addOrder response message', response);
                this.props.navigation.navigate('PayComplete', { orderID: response.success });
            });
        });
    }

    //AddOrder API호출에 필요한 데이터 생성
    getAddOrderData = (paymentData) => {
        //const cardData = JSON.parse(paymentData.card_data);
        const address = this.state.roadAddr + " " + this.state.detailAddress;
        const { orderNo, quantity, buyerName, buyerTel, bigo, zipNo } = this.state;
        const { id, price } = this.item;

        const payload = {
            orderNo: orderNo,
            buyerID: this.userID,
            goodsID: id,
            quantity: quantity,
            price: price,
            //total:paymentData.data.price,
            total: quantity * price,
            buyerName: buyerName,
            buyerTel: buyerTel,
            payKind: paymentData.data.method_origin,
            payBank: paymentData.data.card_data.card_company,
            address: address,
            zipCode: zipNo,
            bigo: bigo,
            receiptID: paymentData.data.receipt_id,
            billURL: paymentData.data.receipt_url
        };
        return payload;
    }

    //부품번호에 대한 Goodle 검색창 보이기(Web View)
    goGoodsNumberWebView = () => {
        this.props.navigation.navigate('GoogleWebView', { url: 'http://www.google.com/search?q=' + this.item.number });
    }

    async callAddOrderAPI(formData) {
        let manager = new WebServiceManager(Constant.serviceURL + "/AddOrder", "post");
        manager.addFormData("data", formData);
        let response = await manager.start();
        if (response.ok) {
            return response.json();
        }
    }
    async callGetGoodsImageAPI(goodsID) {
        let manager = new WebServiceManager(Constant.serviceURL + "/GetGoodsImage?id=" + goodsID + "&position=1");
        let response = await manager.start();
        if (response.ok)
            return response.blob();
    }

    async callGetOrderNoAPI() {
        let manager = new WebServiceManager(Constant.serviceURL + "/GetOrderNo?id=" + this.userID);
        let response = await manager.start();
        if (response.ok)
            return response.json();
    }

    render() {
        let renderTotalPirce = FunctionUtil.getPrice(this.item.price*this.state.quantity);

        return (
            <View style={template.baseContainer}>
                <ScrollView>
                    <View style={{marginHorizontal:'4%', marginVertical:'2%'}}>
                        <View style={styles.orderItem_view}>
                            <Text style={[styles.text.goodsName_text,{paddingTop:'1%'}]}>{this.item.name.length > 20 ? `${this.item.name.slice(0, 20)}...` : this.item.name}</Text>
                            <View style={styles.orderItemBody_view}>
                                <View style={{ flex:1}}>
                                    <Image
                                        source={{ uri: this.state.imageURL }}
                                        style={styles.productImage} />
                                </View>
                                <View style={styles.orderInfo_view}>
                                    <Text>주문번호 : <Text style={{color:'black'}}>{this.state.orderNo}</Text></Text>
                                    <TouchableOpacity onPress={this.goGoodsNumberWebView}>
                                        <Text style={{color:'blue'}}>{this.item.number}</Text>
                                    </TouchableOpacity>
                                    <Text>구매가능 수량 : <Text style={{color:'black'}}>{this.item.quantity}개</Text></Text>
                                </View>
                            </View>

                            <View style={styles.orderItemBottom_view}>                               
                                <View style={styles.itemPrive_view}>
                                    <Text style={styles.text.price_text}>총액 : {renderTotalPirce}원</Text>
                                </View>
                                <View style={styles.itemQuantity_view}>
                                    <Pressable onPress={() => this.countMinus(this.state.quantity)} style={styles.quantity_btn}>
                                        <QuantityEditIcon name='minus' color='black' size={15}></QuantityEditIcon>
                                    </Pressable>
                                    <View style={[styles.quantity_btn, styles.quantityCount]}>
                                        <Text style={styles.text.quantityItemText}>{this.state.quantity}</Text>
                                    </View>
                                    <Pressable onPress={() => this.countPlus(this.state.quantity)} style={styles.quantity_btn}>
                                        <QuantityEditIcon name='plus' color='black' size={15}></QuantityEditIcon>
                                    </Pressable>
                                </View>   
                            </View>
                        </View>

                        {/* 주소 */}
                        <View style={styles.container}>
                            <View style={styles.deliver_view}>
                                <Text style={styles.text.title}>배송지 정보</Text>
                                <TextInput style={styles.textInput}
                                    ref={(c) => { this.buyerName = c; }}
                                    returnKeyType="next"
                                    onSubmitEditing={() => { this.buyerTel.focus(); }}
                                    placeholder="주문자 이름을 입력하세요"
                                    onChangeText={(value) => this.onValueChange({ buyerName: value })}
                                    value={this.state.buyerName} />
                                <TextInput style={styles.textInput}
                                    ref={(c) => { this.buyerTel = c; }}
                                    returnKeyType="next"
                                    placeholder="휴대폰 번호를 입력하세요"
                                    onChangeText={(value) => this.onValueChange({ buyerTel: value })}
                                    value={this.state.buyerTel} />
                            </View>
                            <Text style={styles.text.title}>주소</Text>
                            <View style={styles.rowLayout}>
                                <TouchableOpacity style={styles.text.number_text} onPress={()=>this.props.navigation.navigate("SearchAddress", { addressListener: this.getAddressInfo })}>
                                    <Text style={[styles.text,{ marginLeft: 10,marginRight: 10,}]}>{this.state.zipNo}</Text>
                                </TouchableOpacity>

                                <TouchableOpacity activeOpacity={0.8} style={styles.address_btn} onPress={() => this.props.navigation.navigate("SearchAddress", { addressListener: this.getAddressInfo })}>
                                    <Text style={styles.text.btn_text}>우편번호 찾기</Text>
                                </TouchableOpacity>
                            </View>

                            <View style={styles.address_view}>
                                <Text style={[styles.text,{ marginLeft: 10, marginRight: 10,}]}>{this.state.roadAddr}</Text>
                            </View>

                            <TextInput style={styles.textInput}
                                placeholder="상세 주소를 입력하세요"
                                onChangeText={(value) => this.onValueChange({ detailAddress: value })}
                                //onEndEditing={(event)=> this.onValueChange()}
                                value={this.state.detailAddress} />

                            <TextInput style={styles.textInput}
                                placeholder="배송요청사항"
                                onChangeText={(value) => this.setState({ bigo: value })}
                                value={this.state.bigo} />
                        </View>

                    </View>
                </ScrollView>
                {
                    this.state.validForm ?
                        (<TouchableOpacity style={styles.payment_btn} onPress={this.paymentButtonClicked}><Text style={styles.text.buyButtonText}>결제하기</Text></TouchableOpacity>)
                        : (<TouchableOpacity style={[styles.payment_btn, { backgroundColor: "#C9CCD1" }]} ><Text style={styles.text.buyButtonText}>결제하기</Text></TouchableOpacity>)
                }
            </View>
        );
    }
}

export default Payment;