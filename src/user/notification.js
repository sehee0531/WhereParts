import React, { Component, PureComponent } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';

import Constant from '../util/constatnt_variables';

import WebServiceManager from '../util/webservice_manager';
import EmptyListView from '../util/empty_list_view';
import Indicator from '../util/indicator';
import CircleIcon from 'react-native-vector-icons/FontAwesome';
import DeleteIcon from 'react-native-vector-icons/MaterialIcons'

import { template, colors } from "../styles/template/page_style";
import { styles } from '../styles/notification';
import Session from '../util/session';

export default class Notification extends Component {
    constructor(props) {
        super(props);
        this.contents=[];
        this.userID=Session.getUserID()

        this.state = {
            notiContents: [],
            notiKind:1,             //모든알림인지 미확인알림인지 선택 1:모든알림, 2:미확인알림

            isRefresh:false,
            emptyListViewVisible:false,
            Indicator:false
        }
    }

    componentDidMount(){
        this.goGetNoties();
    }

    //모든 알림 리스트 가져옴. this.contents에 할당
    goGetNoties=()=>{
        this.setState({Indicator:true});
        this.callGetNotiesAPI().then((response) => {
            this.setState({Indicator:false});
            this.contents=response;            
            this.setState({notiContents:this.dataFiltering()});
            //console.log('noti',this.state.notiContents)
        });
    }

    //사용자 id값에 해당하는 모든 알림 받아오기 API
    async callGetNotiesAPI() { //로그인 된 id값으로 모든알림정보 가져오는 API
        let manager = new WebServiceManager(Constant.serviceURL + "/GetNoties?id=" + this.userID);
        let response = await manager.start();
        if (response.ok)
            return response.json();
        else
            Promise.reject(response);
    }    

    //noti리스트에서 삭제하는 API
    async callRemoveNotiAPI(id) {
        let manager = new WebServiceManager(Constant.serviceURL + "/RemoveNoti?id=" + id);
        let response = await manager.start();
        if(response.ok)
            return response.json();
        else    
            Promise.reject(response); 
    }

    //모든알림/읽지않은 알림 선택
    setNotiKind=(kind)=> {
        this.setState({notiKind:kind},()=>this.setState({notiContents:this.dataFiltering()}));
    }


    //필터링(reading=0 or reading=1, 읽지 않은 알람과 읽은 알람)
    dataFiltering() {
        let filteredContents = this.contents;
        if(this.state.notiKind==2) {
            filteredContents = filteredContents.filter((content) => {
                if(content.reading==0)
                    return true;
            });        
        }
        let visible=false;
        if(filteredContents.length==0)
            visible=true;    
        this.setState({emptyListViewVisible:visible});
        return filteredContents;    
    }

    //리스트의 항목에서 삭제 버튼 클릭시 (서버API를 호출하고 로컬의 리스트를 삭제, 서버 API재 호출하지 않음)
    deleteItemListener(id) {
        console.log('delete ',id)
        this.callRemoveNotiAPI(id).then((response)=> {
            if(response.success==1) {
                let filteredContents = this.contents;
                filteredContents = filteredContents.filter((content)=> {
                    if(content.id!=id)
                        return true;
                });
                console.log('delete api ',response);
                this.contents=filteredContents;
                this.setState({notiContents:this.dataFiltering()});
            }
        });        
    }

    render() {
        return (
            <View style={template.baseContainer}>
                <View style={[template.container,{marginTop:15}]}>
                    <View style={styles.productTop_view}>
                        <View style={this.state.notiKind==1 ? inStyle.selectedBar : inStyle.deSelectedBar}>
                            <TouchableOpacity onPress={()=>this.setNotiKind(1)}><Text style={this.state.notiKind==1 ? inStyle.selectedBarText : inStyle.deSelectedBarText}>전체알림</Text></TouchableOpacity>
                        </View>
                        <View style={this.state.notiKind==2 ? inStyle.selectedBar : inStyle.deSelectedBar}>
                            <TouchableOpacity onPress={()=>this.setNotiKind(2)}><Text style={this.state.notiKind==2 ? inStyle.selectedBarText : inStyle.deSelectedBarText}>미확인알림</Text></TouchableOpacity>
                        </View>
                    </View>
                    {this.state.emptyListViewVisible==false && (
                    <FlatList
                        showsVerticalScrollIndicator={false}
                        data={this.state.notiContents}
                        renderItem={({ item, index }) => <NotiListItem navigation={this.props.navigation} item={item} refreshListener={this.goGetNoties} deleteItemListener={(id)=>this.deleteItemListener(id)}/>}
                        refreshing={false}
                        onRefresh={this.goGetNoties}
                        scrollEventThrottle={16}
                    />)}
                    {this.state.emptyListViewVisible && (<EmptyListView navigation={this.props.navigation} isRefresh={this.state.isRefresh} onRefreshListener={this.goGetNoties} />)}
                </View>
            </View>
        );
    }
}


//리스트에 표시된 각 항목 클래스
class NotiListItem extends PureComponent {
    constructor(props) {
        super(props);
    }

    async callSetReadNotiAPI(id) {
        let manager = new WebServiceManager(Constant.serviceURL +"/SetReadNoti?id="+id);
        let response = await manager.start();
        if(response.ok)
            return response.json();
    }

    async callGetSellDetailAPI(orderID) {
        let manager = new WebServiceManager(Constant.serviceURL + "/GetSellDetail?id=" + orderID);
        let response = await manager.start();
        if (response.ok)
            return response.json();
    }

    //항목 선택시 어디로 가는지... 구매 또는 판매에 따라...
    itemClicked=()=>{
        const {id, orderID, kind, reading} = this.props.item;
        console.log('orderID',orderID)
        if(reading==0){
            this.callSetReadNotiAPI(id).then((response)=>{
                //console.log('success',response);
            })
        }
        if(kind=='buy'){
            this.props.refreshListener();
            this.props.navigation.navigate('BuyList');
        }
        //판매 알람일 경우 이미 배송정보가 입력되었을 경우이므로...?????
        else if(kind=='sell'){
            this.callGetSellDetailAPI(orderID).then((response)=>{
                if(response.status==1){
                    this.props.refreshListener();
                    this.props.navigation.navigate('AddDelivery', {id:orderID,navigation:this.props.navigation});
                }
                else{
                    this.props.refreshListener();
                    this.props.navigation.navigate('SalesList', {saleState:2})
                }
            })
        }
    }

    //삭제 버튼 클릭시 상위 클래스의 listener호출
    deleteButtonClicked=()=> {
        this.props.deleteItemListener(this.props.item.id);
    }

    render() {
        const { body, todate, kind, reading } = this.props.item;
        return (
            <>
                <TouchableOpacity onPress={()=>this.itemClicked()}>
                    <View style={styles.product}>
                        <View style={[styles.listItem_view,{flex:1}]}>
                            <View style={[styles.circleIcon_view]}>
                                {/* buy, sell 판별하여 text 표시 */}
                                <View style={styles.itemkind_view}>
                                    <Text style={styles.itemkind_text}>{kind == 'buy' ? '구매' : '판매'}</Text>
                                </View>
                            </View>
                            <View style={styles.itemDetail_view}>
                                <Text style={styles.itemDetail_text}>
                                    <Text style={{ fontSize: 12 }}>{todate}</Text>
                                    {/* 읽었는지 읽지 않았는지 판별하여 text 표시 */}
                                    <Text style={{ color: 'red',fontSize:12 }}>{reading == 0 ? '  new' : null}</Text>
                                </Text>
                                <Text style={{ color: 'black' }}>{body}</Text>
                            </View>
                            <View style={{ position: 'absolute',marginLeft:"95%" }}>
                                <TouchableOpacity onPress={this.deleteButtonClicked}>
                                    <DeleteIcon name="close" size={18} color="#0066FF" />
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </TouchableOpacity>
            </>
        );
    }
}




const inStyle = StyleSheet.create({
    selectedBar:[
        {
            borderWidth:0,
            borderBottomWidth:2,
            width: "50%",
            borderBottomColor: "#EE636A",
            alignItems: 'center'
        }
    ],

    deSelectedBar:[
        {
            borderWidth:0,
            borderBottomWidth:0,
            width: "50%",
            borderBottomColor: "#EE636A",
            alignItems: 'center'
        }
    ],

    selectedBarText:[
        template.largeText,
        {
            fontWeight: 'bold',
            color: colors.red,
            paddingBottom:10,
        }
    ],
    deSelectedBarText:[
        template.largeText,
        {
            fontWeight: 'bold',
            color: colors.dark,
            paddingBottom:10,
        }
    ]
});