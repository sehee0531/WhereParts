import React,{Component} from "react";
import {View, Text, TextInput,ScrollView, TouchableOpacity,Linking } from 'react-native';
import { styles } from "../../styles/address";

class Address extends Component {
    constructor(props) {
        super(props);

        this.state={
            buyerName:"",
            buyerTel:"",
            address:"",
            detailAddress:"",
        }
    }

    render(){
        return(
            <View style={styles.total_container}>
                <View style={styles.container}>

                    <View style={styles.deliverView}>
                        <Text style={styles.title}>배송지 정보</Text>
                        <TextInput style={styles.textInput}
                            placeholder="주문자 이름을 입력하세요"
                            onChangeText={(value)=>this.setState({buyerName:value})}
                            value={this.state.buyerName} />
                        <TextInput style={styles.textInput}
                            placeholder="휴대폰 번호를 입력하세요"
                            onChangeText={(value)=>this.setState({buyerTel:value})}
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
                        onChangeText={(value)=>this.setState({detailAddress:value})}
                        value={this.state.detailAddress} />
                </View>
           
            </View>
        );
    }
}
export default Address;