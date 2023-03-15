import React, { Component } from 'react';
import { View,Text,ScrollView,TouchableOpacity,Modal,FlatList,Image,Alert } from 'react-native';

import { template } from "../../styles/template/page_style";
import {styles} from "../../styles/buylist";
import Constant from '../../util/constatnt_variables';
import WebServiceManager from '../../util/webservice_manager';

import AsyncStorage from '@react-native-async-storage/async-storage';


class BuyList extends Component {
    constructor(props) {
        super(props);
       
        this.state={
            buyContents:[],
        }
    }
    componentDidMount() {
        this.getUserID().then((value)=>{
        this.callGetGoodsAPI(value).then((response) => { 
           this.setState({buyContents:response})
        });
    })
    }
    goGetGoods=()=>{
        this.getUserID().then((value)=>{
            this.callGetGoodsAPI(value).then((response) => { 
               this.setState({buyContents:response})
            });
        });
    }
    async getUserID(){
        let obj=await AsyncStorage.getItem('obj')
        let parsed=JSON.parse(obj);
        if(obj!==null){
            return parsed.id;
        }
        else{
            return false;
        }
    }
    //등록된 상품 리스트 API
    async callGetGoodsAPI(userID) {
        let manager = new WebServiceManager(Constant.serviceURL + "/GetOrders?id="+userID);
        let response = await manager.start();
        if (response.ok)
            return response.json();
        else
            Promise.reject(response);
    }
   
    render() {
        {console.log(this.state.buyContents)}
        return ( 
           <View style={{flex:1, marginBottom:10,}}>
                <FlatList
                    data={this.state.buyContents}
                    renderItem={({ item, index }) => <ListItem index={index} item={item} goodsID={item.goodsID} id={item.id}navigation={this.props.navigation} refresh={this.goGetGoods} />}
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
            let manager = new WebServiceManager(Constant.serviceURL + "/GetGoodsImage?id=" + this.props.goodsID + "&position=1");
            let response = await manager.start();
            if (response.ok)
                return response.blob();
    }
    goDeliveryDetailScreen=()=>{
        const logisInfo={code:"04",invoice:"651969374875"};
        this.props.navigation.navigate('DeliveryDetail',{logisInfo:logisInfo});
    }
    goOrderDetailScreen=()=>{
        this.props.navigation.navigate('OrderDetail',{id:this.props.id})
    }
  
    
    orderCompleteButtonClick=()=>{
        Alert.alert(
            '',
            '구매확정하신 뒤에는 반품/교환 신청하실 수 없습니다',
            [
                { text: '취소', onPress: () => console.log('Cancel Pressed'), style: 'cancel' },
                { text: '확인', onPress: () => 
            
                this.callSetOrderCompleteAPI().then(()=>{
                    console.log('state상태',this.props.item.status)
                    this.props.refresh();
                })
            },
            ],
            { cancelable: false });
    }
    async callSetOrderCompleteAPI() {
        let manager = new WebServiceManager(Constant.serviceURL + "/SetOrderComplete?id="+this.props.id);
        let response = await manager.start();
        if (response.ok)
            return response.json();
        else
            Promise.reject(response);
    }
    handleDetailViewModal=()=> {
        this.props.navigation.navigate('GoodsDetail', { id:this.props.goodsID, userID:this.props.item.userID });
    }
    goodsStatusText = (value) => {
        let goodsStatusText = ["배송준비중", "배송중", "배송완료"];
        return goodsStatusText[value - 1];
    }
    render() {
        const item = this.props.item;
        return (
            <>
     
           
             <View style={styles.itemView}>
                <TouchableOpacity onPress={this.handleDetailViewModal}>
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
                                    <Text style={styles.itemDistanceText}>{this.goodsStatusText(item.status)}</Text> 
                                </View>
                               
                            </View>                 
                        </View>
                    </View>
                    </TouchableOpacity>
                    <View style={styles.productButtonView}>
                        <View style={styles.payInfoButtonView}>
                            <TouchableOpacity onPress={this.goOrderDetailScreen}><Text>주문상세</Text></TouchableOpacity>
                        </View>
                        <View style={styles.payInfoButtonView}>
                            <TouchableOpacity  onPress={this.goDeliveryDetailScreen}><Text>배송조회</Text></TouchableOpacity>
                        </View>
                        {item.status==2 &&
                        <View style={[styles.payInfoButtonView,{borderColor:'blue'}]}>
                           <TouchableOpacity  onPress={this.orderCompleteButtonClick}><Text style={{color:'blue'}}>구매확정</Text></TouchableOpacity>
                        </View>}
                        {item.status!=2 &&
                        <View style={styles.payInfoButtonView}>
                           <TouchableOpacity ><Text>구매확정</Text></TouchableOpacity>
                        </View>}
                    </View>
                </View>
        
               
           </>
        );
    }
}