import React, { Component } from 'react';
import { View,Text,TouchableOpacity,FlatList,Image } from 'react-native';

import { template } from "../../styles/template/page_style";
import {styles} from "../../styles/buy/picklist";

import Icon from 'react-native-vector-icons/MaterialIcons';
import MapIcon from 'react-native-vector-icons/FontAwesome5';
import Constant from '../../util/constatnt_variables';
import WebServiceManager from '../../util/webservice_manager';
import EmptyListView from '../../util/empty_list_view';
import FunctionUtil from '../../util/libraries_function';

import Session from '../../util/session';

class PickList extends Component {
    constructor(props) {
        super(props);

        this.userID = Session.getUserID();
        this.state={
            wishContent:[],
            isRefresh:false,
            emptyListViewVisible:false, 

        }
    }
    componentDidMount() {
        this.goGetWish();
    }
    goGetWish=()=>{
        this.callGetWishAPI().then((response) => { 
            this.setState({wishContent:response , emptyListViewVisible:response.length==0?true:false })
         });  
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
                {this.state.emptyListViewVisible==false &&(<FlatList
                    showsVerticalScrollIndicator={false}
                    numColumns={2} 
                    data={this.state.wishContent}
                    renderItem={({ item, index }) => <ListItem index={index} item={item} navigation={this.props.navigation} pickRefreshListener={this.goGetWish}/>}
                    scrollEventThrottle={16}
                />)}
                {this.state.emptyListViewVisible &&(<EmptyListView navigation={this.props.navigation} isRefresh={this.state.isRefresh} onRefreshListener={this.goGetWish} />)}
           </View>
        );
    }
}
export default PickList;

class ListItem extends Component {
    constructor(props) {
        super(props);

        this.userID=Session.getUserID();
        this.item=this.props.item;
        this.state = {
            imageURI: null,
            dipsbuttonclicked:false, //찜 버튼 on/off
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
        //찜 on/off 표시
        this.callGetWishAPI().then((response) => { 
            for(let i=0;i<response.length;i++){
                if(this.item.id==response[i].id){ 
                    this.setState({dipsbuttonclicked:true})
                }
            }
         });
    }
    
    //상품 상세보기로 이동
    goGoodsDetailScreen=()=> {
        this.props.navigation.navigate('GoodsDetail', { goodsID:this.item.id, sellerID:this.item.userID,pickRefreshListener:this.props.pickRefreshListener });
    }
    //부품번호 WebView로 이동
    goGoodsNumberWebView = () => {
        this.props.navigation.navigate('GoogleWebView', { url: 'http://www.google.com/search?q=' + this.item.number });
    }
   
    //찜 버튼 클릭했을 때 - 찜 제거하기
    dipsButtonClicked=()=>{
        this.callRemoveWishAPI().then((response)=>{
            this.props.pickRefreshListener(); //찜 버튼 해제 했을 때 다시 refresh
        })
    }
    
    async callGetImageAPI() {
        let manager = new WebServiceManager(Constant.serviceURL + "/GetGoodsImage?id=" + this.item.id + "&position=1");
        let response = await manager.start();
        if (response.ok)
            return response.blob();
    }
    async callGetWishAPI() {
        let manager = new WebServiceManager(Constant.serviceURL + "/GetWishList?user_id="+this.userID);
        let response = await manager.start();
        if (response.ok)
            return response.json();
        else
            Promise.reject(response);
    }
    async callRemoveWishAPI(){
        let manager = new WebServiceManager(Constant.serviceURL+"/RemoveWishList?user_id="+this.userID+"&goods_id="+this.item.id)
        let response = await manager.start();

        if(response.ok){
            return response.json();
        }
    }
    render() {
        const item = this.props.item;
        return ( 
            <TouchableOpacity onPress={this.goGoodsDetailScreen}>
                <View style={styles.item_view}>
                    <View style={styles.listTop_view}>
                        <View style={{ alignItems: 'flex-start' }}>
                            <Text style={styles.itemName_text}>{item.name.length > 15 ? `${item.name.slice(0, 15)}...` : item.name}</Text>
                        </View>
                        <View style={styles.pick_view}>
                            <TouchableOpacity onPress={this.dipsButtonClicked}>
                                <Icon name="favorite" color={"#EE636A"} size={20}></Icon>
                            </TouchableOpacity>
                        </View>
                    </View>

                    <View style={styles.listBottom_view}>
                        <View style={styles.productImage_view}>
                            <Image
                                source={{ uri: this.state.imageURI }}
                                style={styles.productImage} />
                        </View>
                        <View style={styles.productInfoRight_view}>
                            <Text style={styles.itemPrice_text}>{FunctionUtil.getPrice(item.price)}{"원"}</Text>
                            <TouchableOpacity onPress={this.goGoodsNumberWebView}>
                                <Text style={styles.itemNumber_text}>{item.number.length > 13 ? `${item.number.slice(0, 13)}...` : item.number}</Text>
                            </TouchableOpacity>
                            <Text style={styles.itemDistance_text}><MapIcon name='map-marker-alt' color='#EE636A' size={10}></MapIcon> {item.distance}km</Text>
                        </View>
                    </View>
                </View>
            </TouchableOpacity>
        );
    }
}