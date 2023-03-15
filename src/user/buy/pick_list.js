import React, { Component } from 'react';
import { View,Text,ScrollView,TouchableOpacity,Modal,FlatList,Image } from 'react-native';

import { template } from "../../styles/template/page_style";
import {styles} from "../../styles/picklist";

import Icon from 'react-native-vector-icons/MaterialIcons';

import Constant from '../../util/constatnt_variables';
import WebServiceManager from '../../util/webservice_manager';

import DetailItemView from "../../goods/list/components/item_detail";
import AsyncStorage from '@react-native-async-storage/async-storage';

class PickList extends Component {
    constructor(props) {
        super(props);
        this.userID=""
        this.state={
            wishContent:[],
        }
    }
    componentDidMount() {
        this.goGetWish()
    }
    goGetWish=()=>{
        this.getUserID().then(()=>{
            this.callGetWishAPI().then((response) => { 
                this.setState({wishContent:response})
             });
             
        } )
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
    async callGetWishAPI() {
        let manager = new WebServiceManager(Constant.serviceURL + "/GetWishList?user_id="+this.userID);
        let response = await manager.start();
        if (response.ok)
            return response.json();
        else
            Promise.reject(response);
    }
   
    render() {
        return (
           <View style={styles.total_container}>
                <FlatList
                    numColumns={2} 
                    data={this.state.wishContent}
                    renderItem={({ item, index }) => <ListItem index={index} item={item} id={item.id} navigation={this.props.navigation} pickRefreshListener={this.goGetWish}/>}
                    scrollEventThrottle={16}
                />
           </View>
        );
    }
}
export default PickList;

class ListItem extends Component {
    constructor(props) {
        super(props);
        this.id="";
        this.item=this.props.item;
        this.state = {
            imageURI: null,
            dipsbuttonclicked:false,
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
        this.getUserID().then(()=>{
            this.callGetWishAPI().then((response) => { 
                for(let i=0;i<response.length;i++){
                    if(this.item.id==response[i].id){ 
                        this.setState({dipsbuttonclicked:true})
                    }
                }
             });
             
        } )
    }
    async getUserID(){
        let obj=await AsyncStorage.getItem('obj')
        let parsed=JSON.parse(obj);
        if(obj!==null){
            this.id=parsed.id;
        }
        else{
            return false;
        }
    }
    
    handleDetailViewModal=()=> {
        this.props.navigation.navigate('GoodsDetail', { id:this.props.item.id, userID:this.props.item.userID,pickRefreshListener:this.props.pickRefreshListener });
    }
   
    dipsButtonClicked=()=>{
       
        this.callRemoveWishAPI().then((response)=>{
            console.log(response);
            this.props.pickRefreshListener();
        })
    }
    async callGetImageAPI() {
        let manager = new WebServiceManager(Constant.serviceURL + "/GetGoodsImage?id=" + this.props.id + "&position=1");
        let response = await manager.start();
        if (response.ok)
            return response.blob();
    }
    async callGetWishAPI() {
        let manager = new WebServiceManager(Constant.serviceURL + "/GetWishList?user_id="+this.id);
        let response = await manager.start();
        if (response.ok)
            return response.json();
        else
            Promise.reject(response);
    }
    
    async callRemoveWishAPI(){
        let manager = new WebServiceManager(Constant.serviceURL+"/RemoveWishList?user_id="+this.id+"&goods_id="+this.item.id)
        let response = await manager.start();

        if(response.ok){
            return response.json();
        }
    }
    render() {
        
        return ( 
             <TouchableOpacity onPress={this.handleDetailViewModal}>
                <View style={styles.itemView}>
                    <View style={styles.pickView}>
                        <TouchableOpacity onPress ={this.dipsButtonClicked}>
                            <Icon name="favorite" color={"#EE636A" } size={25}></Icon>
                        </TouchableOpacity>
                    </View>
                    <Image
                        source={{ uri: this.state.imageURI }}
                        style={styles.productImage}/>
                    <Text style={styles.itemNameText}>{this.item.name}</Text>
                    <Text style={styles.itemPriceText}>{this.item.price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}{"원"}</Text>
                    <Text style={styles.itemNumberText}>{this.item.number}</Text>
                </View>
            </TouchableOpacity>
 
          
        );
    }
}