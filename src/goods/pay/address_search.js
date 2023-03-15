import React, { Component } from 'react';
import { View, Text,  TextInput, TouchableOpacity, FlatList, ScrollView } from 'react-native';

import { styles } from "../../styles/address_search";

import Icon from 'react-native-vector-icons/MaterialIcons';
import PageIcon from 'react-native-vector-icons/AntDesign'
import WebServiceManager from '../../util/webservice_manager';

class SearchAddress extends Component {
    constructor(props) {
        super(props);
        this.state = {
            modal: false,
            addressName: "",
            searchText: "",
            value:"",
        }
    }

    //검색 버튼을 눌렀을 때
    searchAddress = () => {
        if(this.state.searchText == "")
        {
            alert("주소를 입력해주세요");
        }
        else{
            this.setState({modal:true});
        }
    }
    pageUp = () => {
        this.setState({ page: this.state.page + 1 });
    }
    pageDown = () => {
        this.setState({ page: this.state.page - 1 });
    }

    render() {
        return (
            <View style={styles.total_container}>
               
                <View style={styles.container}>
                    <View style={styles.viewHeader}>
                        <View style={styles.inputStyle}>
                            <View style={styles.rowLayout}>
                                <TextInput style={styles.input}
                                    onChangeText={(text) => this.setState({ searchText: text  })}
                                    onEndEditing={() => this.setState({value: this.state.searchText,modal:true}) }
                                    placeholder="도로명 또는 지번을 입력하세요"
                                    placeholderTextColor="light grey" />
                                <TouchableOpacity style={styles.search} onPress={this.searchAddress}>
                                    <Icon name="search" size={30} color="light grey" />
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                        {this.state.modal == false && (<AddressView />)}
                        {this.state.modal == true && (<SearchView searchText={this.state.value} navigation={this.props.navigation} addressListener={this.props.route.params.addressListener} />)}

                </View>
            </View>
        );
    }
}

class AddressView extends Component {
    constructor(props) {
        super(props);

    }
    render() {
        return (
            <>
       
              <View style={styles.viewBody}>
                <Text style={styles.title}>TIP</Text>
                <Text style={styles.text}>도로명, 건물명, 지번 중 선택하여</Text>
                <Text style={styles.text2}>입력하세요 </Text>
                <Text style={styles.content}> 도로명 + 건물번호 <Text style={styles.content2}> 예) 테헤란로 152</Text></Text>
                <Text style={styles.content}> 동/읍/면/리 + 번지 <Text style={styles.content2}> 예) 역삼동 737</Text> </Text>
                <Text style={styles.content}> 건물명, 아파트명  <Text style={styles.content2}> 예) 삼성동 힐스테이트</Text></Text>
                </View>
               
            </>
        );
    }
}

class SearchView extends Component {
    constructor(props) {
        super(props);

        this.state = {
            totalCount: 0,
            addressList: [],
            commonList: [],
            page: 1, 
        }
    }
    componentDidMount() {
        this.callGetAddressAPI().then((response) => {
            this.setState({ addressList: response.results.juso });
            this.setState({ commonList: response.results.common });
        });
    }
    componentDidUpdate(prevProps, prevState) {
        
        if((prevState.page != this.state.page))
        {
            this.callGetAddressAPI().then((response) => {
                this.setState({ addressList: response.results.juso });
                this.setState({ commonList: response.results.common });
            });
        }
        else if(prevProps.searchText != this.props.searchText)
        {
            this.callGetAddressAPI().then((response) => {
                this.setState({page:1});
                this.setState({ addressList: response.results.juso });
                this.setState({ commonList: response.results.common });
            });
        }
    }

    addressListClicked=(zipNo,roadAddr)=>{
        //console.log("addressList", zipNo + roadAddr);
        this.props.navigation.navigate('Payment');
        this.props.addressListener(zipNo, roadAddr);
    }

    async callGetAddressAPI() {
        let manager = new WebServiceManager("https://business.juso.go.kr/addrlink/addrLinkApi.do?confmKey=devU01TX0FVVEgyMDIzMDIwOTE3MzczMjExMzQ5Njg=&currentPage=" + this.state.page + "&countPerPage=4&keyword=" + this.props.searchText + "&resultType=json");
        let response = await manager.start();
        if (response.ok)
            return response.json();
        else
            Promise.reject(response);
    }
    //페이지 증가 
    pageUp = () => {
        if (this.state.page < (this.state.commonList.totalCount / 5))
            this.setState({ page: this.state.page + 1 })
    }
    //페이지 감소 
    pageDown = () => {
        if (this.state.page > 1)
            this.setState({ page: this.state.page - 1 })
    }
    render() {
        return (
            <>
            <View style={styles.viewBody}>

          
            <FlatList
                data={this.state.addressList}
                renderItem={( {item} ) =><TouchableOpacity activeOpacity={0.8} onPress={()=>this.addressListClicked(item.zipNo,item.roadAddr)}>
                    <View style={styles.outputStyle}>
                    <View style={styles.rowLayout}>
                        <View style={styles.titleLayout}>
                            
                            <View style={styles.flex1}><Text>도로명</Text></View >
                            <View style={styles.flex1}><Text>지번</Text></View >
                        </View>
                        <View style={styles.addressLayout}>
                            <View style={styles.flex1}><Text style={{ color: "black" }}>{item.roadAddr} </Text></View >
                            <View style={styles.flex1}><Text style={{ color: "black" }}>{item.jibunAddr}</Text></View >
                        </View>
                        <View style={styles.numberLayout}>
                            <Text style={styles.text}>{item.zipNo}</Text>
                        </View>
                    </View>
                </View></TouchableOpacity>}
            />
            </View>
            <View style={styles.viewBottom}>
                <View style={styles.rowLayout}>
                    <TouchableOpacity onPress={this.pageDown} >
                       <PageIcon name="leftsquareo" size={30} color="light grey" />
                    </TouchableOpacity>
                   
                     <Text  style={styles.text}>    {this.state.page}    </Text>
                    <TouchableOpacity onPress={this.pageUp} >
                        <PageIcon name="rightsquareo" size={30} color="light grey" />
                    </TouchableOpacity>
                </View>
            </View>
            {console.log("hi")}
            </>
        );
    }
}

export default SearchAddress;