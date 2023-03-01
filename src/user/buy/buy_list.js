import React, { Component } from 'react';
import { View,Text,ScrollView,TouchableOpacity,Modal,FlatList,Image } from 'react-native';

import { template } from "../../styles/template/page_style";
import {styles} from "../../styles/buylist";
import Constant from '../../util/constatnt_variables';
import WebServiceManager from '../../util/webservice_manager';

import AsyncStorage from '@react-native-async-storage/async-storage';


class BuyList extends Component {
    constructor(props) {
        super(props);
        this.userID=""
        this.state={
            buyContents:[],
        }
    }
    componentDidMount() {
        this.getUserID().then(()=>{
        this.callGetGoodsAPI().then((response) => { 
           this.setState({buyContents:response})
        });
    })
    }
    async getUserID(){
        let obj=await AsyncStorage.getItem('obj')
        let parsed=JSON.parse(obj);
        if(obj!==null){
            this.userID=parsed.id;
        }
        else{
            return false;
        }
    }
    //등록된 상품 리스트 API
    async callGetGoodsAPI() {
        let manager = new WebServiceManager(Constant.serviceURL + "/GetOrders?id="+this.userID);
        let response = await manager.start();
        if (response.ok)
            return response.json();
        else
            Promise.reject(response);
    }
   
    render() {
        {console.log(this.state.buyContents)}
        return ( 
           <View style={{flex:1,}}>
                <FlatList
                    data={this.state.buyContents}
                    renderItem={({ item, index }) => <ListItem index={index} item={item} id={item.goodsID} navigation={this.props.navigation} />}
                    scrollEventThrottle={16}
                />
           </View>
        );
    }
}
export default BuyList;

class ListItem extends Component {
    constructor(props) {
        super(props);
        this.state = {
            id:"",
            imageURI: null,
            isDetailViewModal: false,
        };
    }

    componentDidMount() {
        
        this.callGetImageAPI().then((response) => {
            let reader = new FileReader();
            reader.readAsDataURL(response); //blob을 읽어줌 읽은 놈이 reader
            reader.onloadend = () => {
                
                this.setState({ imageURI: reader.result }) //base64를 imageURI에 집어넣어준다

            } //끝까지 다 읽었으면 
        });
    }
    async callGetImageAPI() {
            let manager = new WebServiceManager(Constant.serviceURL + "/GetGoodsImage?id=" + this.props.id + "&position=1");
            let response = await manager.start();
            if (response.ok)
                return response.blob();
    }
    goDeliveryDetailScreen=()=>{
        const logisInfo={code:"04",invoice:"651969374875"};
        this.props.navigation.navigate('DeliveryDetail',{logisInfo:logisInfo});
    }
    goPayDetailScreen=()=>{
        this.props.navigation.navigate('PayDetail',{item:this.props.item})
    }
    handleDetailViewModal=()=> {
        this.props.navigation.navigate('GoodsDetail', { id:this.props.item.goodsID, userID:this.props.item.userID });
    }
    render() {
        const item = this.props.item;
        return (
            <>
     
            <TouchableOpacity onPress={this.handleDetailViewModal}>
             <View style={styles.itemView}>
                    <View style={styles.dateView}>
                        <Text>주문일  </Text><Text style={styles.itemRegisterDateText}>{item.orderingDate.slice(2,10)}</Text>
                    </View>
                    <View style={styles.productView}>
                        <View style={styles.productImageView}>
                           
                            <Image
                                source={{ uri: this.state.imageURI }}
                                style={styles.productImage}/>
                        </View>
                        <View style={styles.productInfo}>
                            <View style={styles.productInfoLeft}>
                                
                                <Text style={styles.itemNameText}>{item.goodsName}</Text>
                                <Text style={styles.itemPriceText}>{item.total.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}{"원"} <Text style={styles.text}> / {item.quantity}개 </Text></Text>
                                <Text style={styles.itemNumberText}>{item.goodsNo}</Text>
                                
                            </View>
                            <View style={styles.productInfoRight}>
                                <View style={styles.productDistance}>
                                    <Text style={styles.itemDistanceText}>구매확정</Text> 
                                </View>
                               
                            </View>                 
                        </View>
                    </View>
                    <View style={styles.productButtonView}>
                        <View style={styles.payInfoButtonView}>
                            <TouchableOpacity onPress={this.goPayDetailScreen}><Text>주문상세</Text></TouchableOpacity>
                        </View>
                        <View style={styles.deliverInfoButtonView}>
                            <TouchableOpacity  onPress={this.goDeliveryDetailScreen}><Text>배송조회</Text></TouchableOpacity>
                        </View>
                    </View>
                </View>
            </TouchableOpacity>
               
           </>
        );
    }
}