import React, { Component } from 'react';
import { View, Text, ScrollView, TouchableOpacity, NativeModules,Pressable, TextInput,Image } from 'react-native';

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
            imageURL:null,
            zipNo:"",
            roadAddr:"",
            validForm:false,
            detailAddress:'',

            quantity:1,
            paymentMethod:1,
            buyerName:"",
            buyerTel:"",
            address:"",
            bigo:"",
        }
    }
    componentDidMount(){
       this.callGetGoodsImageAPI(this.item.id).then((response) => {
            let reader = new FileReader();
            reader.readAsDataURL(response);
            reader.onloadend = () => {
                this.setState({ imageURL: reader.result })
            }
        });
    }
    callAndroidPaymentActivity = () => {
        const { ActivityStartModule } = NativeModules;
        ActivityStartModule.startPayment(JSON.stringify(this.payload), failedListener = (message) => {
            console.log('취소',message);
        }, successListener = (message) => {
            console.log('완료',message);
            this.props.navigation.navigate('PayComplete',{payload:this.payload});
        });
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

    getAddressInfo=(zipNo, roadAddr)=>{
        //console.log("리스너순서 1");
        this.addressInfoRender(zipNo,roadAddr).then(this.onValueChange);
    }

    async addressInfoRender(zipNo, roadAddr){
        this.setState({zipNo:zipNo, roadAddr:roadAddr});
    }

    onValueChange=()=>{
        let isValidForm = true;
        //console.log("온밸챈지실행");
        //console.log("리스너순서 2");
        console.log("zipNo",this.state.zipNo.trim().length);
        console.log("roadAddr",this.state.roadAddr.trim().length);
        //주문자
        if(this.state.buyerName.length == 0){
            isValidForm=false;
        }
        //연락처
        if(this.state.buyerTel.length==0){
            isValidForm=false;
        }
        //우편번호
        if(this.state.zipNo.trim().length==0){
            isValidForm=false;
        }
        //도로명주소
        if(this.state.roadAddr.trim().length==0){
            isValidForm=false;
        }
        //상세주소
        if(this.state.detailAddress.length==0){
            isValidForm=false;
        }

        this.setState({ validForm: isValidForm });
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
            address:this.state.roadAddr + " " + this.state.detailAddress,
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
    async callGetGoodsImageAPI(goodsID) {
        let manager = new WebServiceManager(Constant.serviceURL + "/GetGoodsImage?id=" + goodsID + "&position=1");
        let response = await manager.start();
        if (response.ok)
            return response.blob();
    }
    render() {
     
        return (
            <View style={template.total_container}>
                <ScrollView style={template.ScrollView}>
                    <View style={template.container}>
                        <View style={styles.indexView}>
                        <Text style={styles.indexText}>주문상품</Text>
                            <View style={{flexDirection:'row'}}>
                                <View style={{ width: 85, height: 75 }}>
                                        <Image
                                            source={{ uri: this.state.imageURL }}
                                            style={styles.productImage} />
                                </View>
                                <View style={{flexDirection:'column'}}>
                                    <Text> 상품명 : {this.item.name}</Text>
                                    <Text> 상품번호 : {this.item.number}{"\n"}</Text>
                                    <Text style={styles.priceText}> {this.item.price*this.state.quantity}원</Text>
                                </View>
                                
                            </View>
                           
                            <View style={{flexDirection:'row',}}>
                               
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

                       
                        {/* 주소 */}
                        <View style={styles.container}>
                            <View style={styles.deliverView}>
                                <Text style={styles.title}>배송지 정보</Text>
                                <TextInput style={styles.textInput}
                                    placeholder="주문자 이름을 입력하세요"
                                    onChangeText={(value) => this.setState({ buyerName: value })}
                                    onEndEditing={(event)=> this.onValueChange()}
                                    value={this.state.buyerName} />
                                <TextInput style={styles.textInput}
                                    placeholder="휴대폰 번호를 입력하세요"
                                    onChangeText={(value) => this.setState({ buyerTel: value })}
                                    onEndEditing={(event)=> this.onValueChange()}
                                    value={this.state.buyerTel} />
                            </View>
                            <Text style={styles.title}>주소</Text>
                            <View style={styles.rowLayout}>
                                <View style={styles.number_text}>
                                    <Text style={styles.text}>{this.state.zipNo}</Text>
                                </View>

                                <TouchableOpacity activeOpacity={0.8} style={styles.btn} onPress={() => this.props.navigation.navigate("SearchAddress", {addressListener:this.getAddressInfo})}>
                                    <Text style={styles.btn_text}>우편번호 찾기</Text>
                                </TouchableOpacity>
                            </View>

                            <View style={styles.address_text}>
                                <Text style={styles.text}>{this.state.roadAddr}</Text>
                            </View>

                            <TextInput style={styles.textInput}
                                placeholder="상세 주소를 입력하세요"
                                onChangeText={(value) => this.setState({ detailAddress: value })}
                                onEndEditing={(event)=> this.onValueChange()}
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
                    (<TouchableOpacity style={styles.paymentButton} onPress={this.paymentButtonClicked}/*onPress={this.callAndroidPaymentActivity}*/><Text style={styles.buyButtonText}>결제하기</Text></TouchableOpacity>)
                    :(<TouchableOpacity style={[styles.paymentButton,{backgroundColor: "#C9CCD1"}]} ><Text style={styles.buyButtonText}>결제하기</Text></TouchableOpacity>)
                }
            </View>
        );
    }
}

export default Payment;