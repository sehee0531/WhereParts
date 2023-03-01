import React, { Component } from 'react';
import { View,Text,ScrollView,Image } from 'react-native';

import {styles} from "../../styles/pay_detail";
import { template } from "../../styles/template/page_style";

class PayDetail extends Component {
    constructor(props) {
        super(props);
        this.item = this.props.route.params.item;
        this.state={
            imageURI: null,
        }
    }
    
    render() {
        return (
        <View style={styles.total_container}>
            <ScrollView >
                <View style={styles.dateInfo_view}>
                        <Text>{this.item.orderingDate}</Text>
                        <Text>주문번호: </Text>
                </View>

                <View style={styles.payInfo_view}>
                    <View style={styles.payInfoTitle_view}>
                        <Text style={[styles.text,{fontSize:15,color:'black'}]}>결제 정보</Text>
                    </View>
                    <View style={styles.payInfoDetail_view}>
                        <View style={styles.title_view}>
                            <Text style={styles.text}>결제수단</Text>
                            <Text style={styles.text}>결제금액</Text>
                            <Text style={styles.text}>결제일시</Text>
                        </View>
                        <View style={styles.info_view}>
                            <Text style={styles.text}>{this.item.payKind==0 && "신용카드"}</Text>
                            <Text style={styles.text}>{this.item.total}</Text>
                            <Text style={styles.text}>{this.item.orderingDate}</Text>
                        </View>
                    </View>
                </View>
                
                <View style={styles.payInfo_view}>
                    <View style={styles.payInfoTitle_view}>
                        <Text style={[styles.text,{fontSize:15,color:'black'}]}>배송 정보</Text>
                    </View>
                    <View style={styles.payInfoDetail_view}>
                        <View style={styles.title_view}>
                            <Text style={styles.text}>택배사</Text>
                            <Text style={styles.text}>송장번호</Text>
                            <Text style={styles.text}>배송지</Text>
                        </View>
                        <View style={styles.info_view}>
                            <Text style={styles.text}>대한통운</Text>
                            <Text style={styles.text}>49582723948</Text>
                            <Text style={styles.text}>인제대</Text>
                        </View>
                    </View>
                </View>
           </ScrollView>
       </View>
        );
    }
}
export default PayDetail;