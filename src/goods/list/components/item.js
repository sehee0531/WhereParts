import React, { Component , PureComponent } from 'react';
import { View, Text, Image, TouchableOpacity,} from 'react-native';

import { styles } from "../../../styles/list/home";

import Constant from '../../../util/constatnt_variables';
import WebServiceManager from '../../../util/webservice_manager';

export default class ListItem extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            imageURI: null,
            isDetailViewModal: false,
        };
    }

    componentDidMount() {
        this.callGetGoodsImageAPI(this.props.item).then((response) => {
            let reader = new FileReader();
            reader.readAsDataURL(response); //blob을 읽어줌 읽은 놈이 reader
            reader.onloadend = () => {
                this.setState({ imageURI: reader.result }) //base64를 imageURI에 집어넣어준다

            } //끝까지 다 읽었으면 
        });
    }
    async callGetGoodsImageAPI() {
        let manager = new WebServiceManager(Constant.serviceURL + "/GetGoodsImage?id=" + this.props.id + "&position=1");
        let response = await manager.start();
        if (response.ok)
            return response.blob();
    }

    goGoodsDetailScreen=()=> {
        console.log("새로고침 되나?", this.props.refreshingTest);
        this.props.navigation.push('GoodsDetail',{id:this.props.item.id, userID:this.props.item.userID, refresh:this.props.refreshListener});
    }

    refresh =()=>{
        this.props.refreshListener();
    }
    render() {
        const item = this.props.item;
        return (
            <>
            <TouchableOpacity onPress={this.goGoodsDetailScreen}>
                <View style={styles.listItem_view}>
                    <View style={styles.productImage_view}>
                        <Image
                            source={{ uri: this.state.imageURI }}
                            style={styles.product_image}/>
                    </View>
                    <View style={styles.productInfo_view}>
                        <View style={styles.productInfoLeft_view}>
                            <Text style={styles.itemName_text}>{item.name}</Text>
                            <Text style={styles.itemName_text}>{item.price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}{"원"}</Text>
                            <Text style={styles.itemDetail_text}>{item.number}</Text>
                        </View>
                        <View style={styles.productInfoRight_view}>
                            <View style={{flex:1,justifyContent:'flex-start'}}>
                                <Text style={[styles.itemDetail_text,{color:'#EE636A'}]}>1km</Text> 
                            </View>
                            <View style={{flex:1,justifyContent:'flex-end'}}>
                               {/*  <Text style={styles.itemDetail_text}>{item.registerDate.slice(2,10)}</Text> */}
                            </View>
                        </View>                 
                    </View>

                </View>
               
            </TouchableOpacity>
       </>
        );
    }
}