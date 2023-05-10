import React, { Component, PureComponent } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, Keyboard, Modal } from 'react-native';

import { styles } from "../../styles/pay/address_search";

import Icon from 'react-native-vector-icons/MaterialIcons';
import EmptyIcon from 'react-native-vector-icons/SimpleLineIcons';
import PageIcon from 'react-native-vector-icons/AntDesign'
import WebServiceManager from '../../util/webservice_manager';

import Indicator from '../../util/indicator';

class SearchAddress extends Component {
    constructor(props) {
        super(props);
        this.countPerPage = 10; // 한 페이지 당 보여지는 개수
        this.state = {
            addressContents: [],
            searchText: "",
            searchViewVisible: false, // 검색했을 경우 보여지는 View on/off
            emptyListViewVisible: false, // 결과가 없을 때 View on/off
            page: 1,
            totalCount: 0, // 검색결과 총 개수
            indicator: false,
        }
    }

    //검색 버튼을 눌렀을 때
    searchAddress = () => {
        if (this.state.searchText == "") {
            alert("주소를 입력해주세요");
        }
        else {
            this.setState({ page: 1 }, () => this.goGetAddress())
            Keyboard.dismiss();
        }
    }
    goGetAddress = () => {
        this.callGetAddressAPI().then((response) => {
            console.log(response)
            if (response.results.common.errorMessage == "정상") {
                this.setState({ indicator: true })
                this.setState({
                    addressContents: response.results.juso, /* commonContents: response.results.common, */
                    totalCount: response.results.common.totalCount,
                    indicator: false,
                    searchViewVisible: true,
                    emptyListViewVisible: false
                }, () => {
                    if (this.state.addressContents.length == 0) {
                        this.setState({ emptyListViewVisible: true })
                    }
                });
            }
            else {
                alert(response.results.common.errorMessage);
            }

        });
    }

    // 이전 페이지 버튼 클릭
    pageDownClicked = () => {
        if (this.state.page > 1)
            this.setState({ page: this.state.page - 1 }, () => this.goGetAddress())
    }
    // 다음 페이지 버튼 클릭
    pageUpClicked = () => {
        if (this.state.page < (this.state.totalCount / this.countPerPage))
            this.setState({ page: this.state.page + 1 }, () => this.goGetAddress())
    }
    async callGetAddressAPI(page) {
        let manager = new WebServiceManager("https://business.juso.go.kr/addrlink/addrLinkApi.do?confmKey=devU01TX0FVVEgyMDIzMDIwOTE3MzczMjExMzQ5Njg=&currentPage=" + this.state.page + "&countPerPage=" + this.countPerPage + "&keyword=" + this.state.searchText + "&resultType=json");
        let response = await manager.start();
        if (response.ok)
            return response.json();
        else
            Promise.reject(response);
    }
    render() {
        return (
            <View style={styles.total_container}>
                <View style={styles.search_view}>
                    <View style={styles.search_input}>
                        <View style={styles.row_layout}>
                            <TextInput style={styles.input}
                                onChangeText={(text) => this.setState({ searchText: text })}
                                onEndEditing={this.searchAddress}
                                placeholder="도로명 또는 지번을 입력하세요"
                                placeholderTextColor="light grey" />
                            <TouchableOpacity style={styles.search_btn} onPress={this.searchAddress}>
                                <Icon name="search" size={30} color="light grey" />
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
                <View style={styles.content_view}>
                    <Modal transparent={true} visible={this.state.indicator}>
                        <Indicator />
                    </Modal>
                    {/*    초기화면 */}
                    {this.state.searchViewVisible == false &&
                        <>
                            <Text style={styles.title}>TIP</Text>
                            <Text style={styles.text}>도로명, 건물명, 지번 중 선택하여</Text>
                            <Text style={styles.text2}>입력하세요 </Text>
                            <Text style={styles.content}> 도로명 + 건물번호 <Text style={styles.content2}> 예) 테헤란로 152</Text></Text>
                            <Text style={styles.content}> 동/읍/면/리 + 번지 <Text style={styles.content2}> 예) 역삼동 737</Text> </Text>
                            <Text style={styles.content}> 건물명, 아파트명  <Text style={styles.content2}> 예) 삼성동 힐스테이트</Text></Text>
                        </>}
                    
                    {/* 검색결과가 없을 때 */}
                    {this.state.emptyListViewVisible &&
                        <View style={{ justifyContent: 'center', alignItems: 'center', paddingTop: '5%' }}>
                            <EmptyIcon name="exclamation" size={40} color="#D1D1D1" />
                            <Text style={{ marginTop: '5%' }}>검색 결과가 없습니다</Text>
                        </View>}


                    {/* 검색결과 리스트 */}
                    {this.state.searchViewVisible && this.state.emptyListViewVisible == false &&
                        <FlatList
                            showsVerticalScrollIndicator={false}
                            style={{ borderColor: '#909098', }}
                            data={this.state.addressContents}
                            renderItem={({ item, index }) => <AddressItem item={item} navigation={this.props.navigation} addressListener={this.props.route.params.addressListener} />} />
                    }
                </View>

                {/* 페이지 부분 */}
                {this.state.searchViewVisible && this.state.emptyListViewVisible == false &&
                    <>
                    <View style={styles.page_view}>
                        <View style={styles.row_layout}>
                            <TouchableOpacity onPress={this.pageDownClicked} activeOpacity={0.8} >
                                <PageIcon name="leftsquareo" size={30} color="light grey" />
                            </TouchableOpacity>

                            <Text style={styles.text}>   <Text style={[styles.text, { color: 'blue' }]}>{this.state.page} </Text> / {Math.ceil(this.state.totalCount / this.countPerPage)}   </Text>
                            <TouchableOpacity onPress={this.pageUpClicked} activeOpacity={0.8}>
                                <PageIcon name="rightsquareo" size={30} color="light grey" />
                            </TouchableOpacity>
                        </View>
                    </View></>}
            </View>
        );
    }
}

class AddressItem extends PureComponent {
    constructor(props) {
        super(props);
    }
    addressItemClicked = (zipNo, roadAddr) => {
        this.props.navigation.navigate('Payment');
        this.props.addressListener(zipNo, roadAddr);
    }
    render() {
        const { zipNo, roadAddr, jibunAddr } = this.props.item;
        return (
            <TouchableOpacity activeOpacity={0.8} onPress={() => this.addressItemClicked(zipNo, roadAddr)}>
                <View style={styles.outputStyle}>
                    <View style={styles.address_view}>
                        <View style={[styles.roadAddr_view]}>
                            <View style={{ flex: 1, }}>
                                <Text>도로명</Text>
                            </View>
                            <View style={{ flex: 5, paddingRight: '2%' }}>
                                <Text style={{ color: "black" }}>{roadAddr} </Text>
                            </View>
                        </View>
                        <View style={[styles.roadAddr_view, { paddingTop: '2%' }]}>
                            <View style={{ flex: 1 }}>
                                <Text>지번</Text>
                            </View>
                            <View style={{ flex: 5, paddingRight: '2%' }}>
                                <Text style={{ color: "black" }}>{jibunAddr}</Text>
                            </View>
                        </View>
                    </View>
                    <View style={styles.zipNo_view}>
                        <Text style={[styles.text, { fontWeight: '600' }]}>{zipNo}</Text>
                    </View>
                </View>
            </TouchableOpacity>
        );
    }
}
export default SearchAddress;