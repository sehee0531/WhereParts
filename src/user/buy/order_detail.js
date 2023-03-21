import React, { Component } from 'react';
import { View, Text, ScrollView, Image, TouchableOpacity } from 'react-native';
import { useValue } from 'react-native-reanimated';
import { styles } from "../../styles/order_detail";
import { template } from "../../styles/template/page_style";
import Constant from '../../util/constatnt_variables';
import WebServiceManager from '../../util/webservice_manager';

class OrderDetail extends Component {
    constructor(props) {
        super(props);
        this.id = this.props.route.params.id;

        this.state = {
            item: {},
            days: []
        }
    }
    componentDidMount() {
        this.callGetOrderDetailAPI().then((response) => {
            this.setState({ item: response, days: response.days });
            console.log(response);
        })
    }

    //웹뷰로 영수증 보기
    goReceiptWebView = () => {
        this.props.navigation.navigate('GoogleWebView', { url: this.state.item.billURL });
    }

    async callGetOrderDetailAPI() {
        let manager = new WebServiceManager(Constant.serviceURL + "/GetOrderDetail?id=" + this.id);
        let response = await manager.start();
        if (response.ok) {
            return response.json();
        }
        else
            Promise.reject(response);
    }

    render() {
        const { id, orderNo, goodsName, goodsNo, buyerName, buyerTel, quantity, price, total, orderingDate, payKind, payBank, address, status, days, invoiceName, invoiceNo } = this.state.item;

        return (

            <View style={styles.total_container}>
                <ScrollView >
                    <View style={styles.dateInfo_view}>
                        <Text style={styles.text_info}>{orderingDate}</Text>
                        <Text style={styles.text}>주문번호: {id}</Text>
                    </View>
                    <View style={styles.payInfo_view}>
                        <View style={styles.payInfoTitle_view}>
                            <Text style={[styles.text, { fontSize: 15, color: 'black' }]}>주문자 정보</Text>
                        </View>
                        <View style={styles.payInfoDetail_view}>
                            <View style={{ flexDirection: 'row' }}>
                                <View style={{ width: '30%' }}>
                                    <Text style={styles.text}>주문자 이름</Text>
                                </View>
                                <View style={{ width: '70%' }}>
                                    <Text style={styles.text_info}>{buyerName}</Text>
                                </View>
                            </View>
                            <View style={{ flexDirection: 'row' }}>
                                <View style={{ width: '30%' }}>
                                    <Text style={styles.text}>휴대폰 번호</Text>
                                </View>
                                <View style={{ width: '70%' }}>
                                    <Text style={styles.text_info}>{buyerTel}</Text>
                                </View>
                            </View>
                            <View style={{ flexDirection: 'row' }}>
                                <View style={{ width: '30%' }}>
                                    <Text style={styles.text}>배송주소</Text>
                                </View>
                                <View style={{ width: '70%' }}>
                                    <Text style={styles.text_info}>{address}</Text>
                                </View>
                            </View>
                        </View>
                    </View>
                    <View style={styles.payInfo_view}>
                        <View style={styles.payInfoTitle_view}>
                            <Text style={[styles.text, { fontSize: 15, color: 'black' }]}>결제 정보</Text>
                        </View>
                        <View style={styles.payInfoDetail_view}>
                            <View style={{ flexDirection: 'row' }}>
                                <View style={{ width: '30%' }}>
                                    <Text style={styles.text}>결제수단</Text>
                                </View>
                                <View style={{ width: '70%' }}>
                                    <Text style={styles.text_info}>{payKind == 1 && "신용카드"} ({payBank})</Text>
                                </View>
                            </View>
                            <View style={{ flexDirection: 'row' }}>
                                <View style={{ width: '30%' }}>
                                    <Text style={styles.text}>결제금액</Text>
                                </View>
                                <View style={{ width: '70%' }}>
                                    <Text style={styles.text_info}>{total} 원</Text>
                                </View>
                            </View>
                            <View style={{ flexDirection: 'row' }}>
                                <View style={{ width: '30%' }}>
                                    <Text style={styles.text}>결제일시</Text>
                                </View>
                                <View style={{ width: '70%' }}>
                                    <Text style={styles.text_info}>{this.state.days[0]}</Text>
                                </View>
                            </View>
                            <View style={{ flexDirection: 'row' }}>
                                <View style={{ width: '30%' }}>
                                    <Text style={styles.text}>영수증</Text>
                                </View>
                                <View style={{ width: '70%' }}>
                                    <TouchableOpacity onPress={this.goReceiptWebView}>
                                        <Text style={styles.text_info}>확인하기</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </View>
                    </View>

                    {status != 1 &&
                        <>
                            <View style={styles.payInfo_view}>
                                <View style={styles.payInfoTitle_view}>
                                    <Text style={[styles.text, { fontSize: 15, color: 'black' }]}>배송 정보</Text>
                                </View>
                                <View style={styles.payInfoDetail_view}>
                                    <View style={{ flexDirection: 'row' }}>
                                        <View style={{ width: '30%' }}>
                                            <Text style={styles.text}>택배사</Text>
                                        </View>
                                        <View style={{ width: '70%' }}>
                                            <Text style={styles.text_info}>{invoiceName}</Text>
                                        </View>
                                    </View>
                                    <View style={{ flexDirection: 'row' }}>
                                        <View style={{ width: '30%' }}>
                                            <Text style={styles.text}>송장번호</Text>
                                        </View>
                                        <View style={{ width: '70%' }}>
                                            <Text style={styles.text_info}>{invoiceNo}</Text>
                                        </View>
                                    </View>
                                    <View style={{ flexDirection: 'row' }}>
                                        <View style={{ width: '30%' }}>
                                            <Text style={styles.text}>배송시작일시</Text>
                                        </View>
                                        <View style={{ width: '70%' }}>
                                            <Text style={styles.text_info}>{this.state.days[1]}</Text>
                                        </View>
                                    </View>
                                    <View style={{ flexDirection: 'row' }}>
                                        <View style={{ width: '30%' }}>
                                            <Text style={styles.text}>배송완료일시</Text>
                                        </View>
                                        <View style={{ width: '70%' }}>
                                            <Text style={styles.text_info}>{this.state.days[2]}</Text>
                                        </View>
                                    </View>
                                </View>
                            </View>
                        </>}
                </ScrollView>
            </View>

        );
    }
}
export default OrderDetail;