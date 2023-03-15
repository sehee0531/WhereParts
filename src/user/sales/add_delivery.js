import React, { Component } from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput, Image, Keyboard } from 'react-native';

import { Picker } from '@react-native-picker/picker';
import { template } from "../../styles/template/page_style";
import { styles } from "../../styles/salesdeliver";

import IconCamera from 'react-native-vector-icons/Feather';

import Constant from "../../util/constatnt_variables";
import WebServiceManager from "../../util/webservice_manager";

class AddDelivery extends Component {
    constructor(props) {
        super(props);

        this.state = {
            t_code: 1,
            t_name:["CJ대한통운","우체국택배","편의점택배","로젠택배","한진택배"],
            t_invoice: "",
            imageURL: null,
            sellDetailInfo: { orderingDate: "", buyerTel: "", days: [""] },

            validForm: false,
        }
    }

    componentDidMount() {
        this.keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', this.keyboardDidShow);
        this.keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', this.keyboardDidHide);

        this.callGetSellDetailAPI().then((response) => {
            this.setState({ sellDetailInfo: response })
            console.log("days : ", this.state.sellDetailInfo.days[0]);
            this.callGetGoodsImageAPI(response.goodsID).then((response) => {
                let reader = new FileReader();
                reader.readAsDataURL(response);
                reader.onloadend = () => {
                    this.setState({ imageURL: reader.result })
                }
            });
        })

    }

    componentWillUnmount() {
        this.keyboardDidShowListener.remove();
        this.keyboardDidHideListener.remove();
    }

    keyboardDidShow = () => {
        console.log('Keyboard Shown');
    }

    keyboardDidHide = () => {
        console.log('Keyboard Hide');
        this.onValueChange();
    }

    goCameraButtonClicked = () => {
        this.props.navigation.push("PartsNoCamera", { onResultListener: this.goInvoiceNo });
    }

    deliveryCompleteButtonClicked =() =>{
        this.callSetDeliveryAPI().then((response)=>{
            console.log("배송신청완료", response);
            this.props.route.params.navigation.navigate("SalesList");
            this.props.route.params.refresh();
        })
    }

    // 품번 가지고오는 함수 getGoodsNo
    goInvoiceNo = (imageURI) => {
        this.callInvoiceNoAPI(imageURI).then((response) => {
            if (response.success === "1") {
                const invoiceNo = response.texts[0].replaceAll(" ", "");
                this.setState({ t_invoice: invoiceNo });
            }
            else {
                Alert.alert('송장번호 인식', '송장번호를 인식하지 못했습니다. 직접 입력하세요', [
                    { text: '확인', onPress: () => { this.setState({ t_invoice: "" }) } }]);
            }

            this.imageModule.deleteImage(imageURI, (imageURI) => {
                console.log(imageURI);
            }, (imageURI) => {
                console.log("delete success", imageURI);
            });
        });
    }

    onValueChange = () => {
        let isValidForm = true;
        
        if (this.state.t_invoice.trim().length == 0) {
            isValidForm = false;
        }

        this.setState({ validForm: isValidForm });
    }

    async callGetSellDetailAPI() {
        let manager = new WebServiceManager(Constant.serviceURL + "/GetSellDetail?id=" + this.props.route.params.id);
        let response = await manager.start();
        if (response.ok)
            return response.json();
    }

    async callGetGoodsImageAPI(goodsID) {
        let manager = new WebServiceManager(Constant.serviceURL + "/GetGoodsImage?id=" + goodsID + "&position=1");
        let response = await manager.start();
        if (response.ok)
            return response.blob();
    }

    /*
    async callSetDeliveryAPI(){
        let manager = new WebServiceManager(Constant.serviceURL + "/SetDelivery?id=" + this.props.route.params.id);
        let response = await manager.start();
        if (response.ok)
            return response.json();
    }*/
    async callSetDeliveryAPI(){
        let manager=new WebServiceManager(Constant.serviceURL +"/SetDelivery","post");

        manager.addFormData("data",{
            orderID:this.props.route.params.id,
            invoiceKind:this.state.t_code,
            invoiceName:this.state.t_name[(this.state.t_code)-1],
            invoiceNo:this.state.t_invoice,
        })

        let response = await manager.start();
        if (response.ok) {
            return response.json();
        }
    }

    //사진으로부터 품번 인식 서비스 API
    async callInvoiceNoAPI(imageURI) {
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
    
    render() {
        const { days, orderingDate, goodsName, goodsNo, buyerName, buyerTel, quantity, price, total, payBank, address } = this.state.sellDetailInfo;
       console.log(this.props.route.params.id)
       console.log(this.state.t_code);
       console.log("t_name",this.state.t_name[this.state.t_code-1]);
        return (

            <View style={styles.total_container}>
                <ScrollView>
                    <View style={styles.topContainer}>
                        <View style={{ padding: "5%" }}>
                            <Text>{"주문일 " + orderingDate.slice(2, 10)}</Text>
                            <View style={{ flexDirection: "row" }} >
                                <View style={{ width: 85, height: 75 }}>
                                    <Image
                                        source={{ uri: this.state.imageURL }}
                                        style={styles.productImage} />
                                </View>
                                <View style={{ justifyContent: "center" }}>
                                    <Text style={[styles.text, { fontSize: 18, fontWeight: "bold" }]}>{goodsName}<Text style={[styles.text, { fontSize: 12 }]}>{"  " + goodsNo}</Text></Text>
                                    <Text style={[styles.text, { fontSize: 18, marginTop: 10 }]}>{price}<Text style={[styles.text, { fontSize: 12 }]}>{"/" + quantity + "개"}</Text></Text>
                                </View>
                            </View>
                        </View>
                    </View>
                    <View style={styles.bodyContainer}>
                        <Text style={{ paddingLeft: 5, paddingBottom: 5 }}>받는사람</Text>
                        <View style={{ borderWidth: 2, borderRadius: 12, borderColor: "lightgrey", padding: "3%", marginBottom: 20 }}>
                            <Text style={[styles.text, { fontSize: 17, fontWeight: "bold" }]}>{buyerName}</Text>
                            <Text style={[styles.text, { paddingTop: "2%" }]}>{address}</Text>
                            <Text style={styles.text}>{buyerTel.replace(/-/g, "").replace(/(\d{3})(\d{4})(\d{4})/, "$1-$2-$3")}</Text>
                        </View>

                        <Text style={{ paddingLeft: 5, paddingBottom: 5 }}>결제정보</Text>
                        <View style={{ borderWidth: 2, borderRadius: 12, borderColor: "lightgrey", padding: "3%", marginBottom: 20 }}>
                            <Text style={[styles.text, { paddingTop: "2%" }]}>{"총 결제금액 : " + total}</Text>
                            <Text style={[styles.text, { paddingTop: "2%" }]}>{"결제수단 : 카드"}</Text>
                            <Text style={[styles.text, { paddingTop: "2%" }]}>{"결제사 : " + payBank}</Text>
                            <Text style={[styles.text, { paddingTop: "2%" }]}>{"결제일시 : " + days[0]}</Text>
                        </View>
                        <View style={styles.textInput}>
                            <Text>택배사 선택</Text>
                            <Picker
                                selectedValue={this.state.t_code}
                                onValueChange={(value, index) => { this.setState({ t_code: value }) }}>
                                <Picker.Item label='CJ대한통운' value="1" />
                                <Picker.Item label='우체국택배' value="2" />
                                <Picker.Item label='편의점택배' value="3" />
                                <Picker.Item label='롯데택배' value="4" />
                                <Picker.Item label='한진택배' value="5" />
                            </Picker>
                        </View>
                        <View style={styles.textInput}>
                            <View style={styles.rowLayout}>
                                <View style={styles.textLayout}>
                                    <Text>송장번호 </Text>
                                    <TextInput
                                        onChangeText={(value) => this.setState({ t_invoice: value })}
                                        onEndEditing={(event) => this.onValueChange()}
                                        value={this.state.t_invoice} // 띄워지는값
                                    />
                                </View>
                                <View style={styles.btnLayout}>
                                    <TouchableOpacity style={styles.btn_camera} onPress={this.goCameraButtonClicked} >
                                        <IconCamera name="camera" size={30} color={'white'}></IconCamera>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </View>
                    </View>
                </ScrollView>
                <View style={styles.bottomContainer}>
                    {this.state.validForm ?
                        (<TouchableOpacity onPress={this.deliveryCompleteButtonClicked} activeOpacity={0.8} style={styles.okbtn} >
                            <Text style={styles.btn_text}>배송완료신청</Text>
                        </TouchableOpacity>)
                        : (<TouchableOpacity activeOpacity={0.8} style={[styles.okbtn, { backgroundColor: "#C9CCD1" }]} >
                            <Text style={styles.btn_text}>배송완료신청</Text>
                        </TouchableOpacity>)}
                </View>
            </View>
        );
    }
}
export default AddDelivery;