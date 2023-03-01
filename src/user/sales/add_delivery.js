import React, { Component } from 'react';
import { View,Text,ScrollView,TouchableOpacity,TextInput } from 'react-native';

import { Picker } from '@react-native-picker/picker';
import { template } from "../../styles/template/page_style";
import {styles} from "../../styles/salesdeliver";

import IconCamera from 'react-native-vector-icons/Feather';

import Constant from "../../util/constatnt_variables";
import WebServiceManager from "../../util/webservice_manager";

class AddDelivery extends Component {
    constructor(props) {
        super(props);

        this.state={
            t_code:1,
            t_invoice:null
        }
    }
    goCameraButtonClicked = () => {
        this.props.navigation.push("PartsNoCamera", { onResultListener: this.goInvoiceNo });
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
        
        return (
        <View style={styles.total_container}>
           
                <View style={styles.topContainer}>
                   <Text>판매한 상품 상세보기</Text>
               </View>
                <View style={styles.bodyContainer}>
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
                <View  style={styles.bottomContainer}>
                    <TouchableOpacity activeOpacity={0.8} style={styles.okbtn} >
                        <Text style={styles.btn_text}>배송완료신청</Text>
                    </TouchableOpacity>
                </View>
       </View>
    );
    }
}
export default AddDelivery;