import React, { Component } from 'react';
import { Text, View, TouchableOpacity, TextInput, Alert, BackHandler } from 'react-native';
import { template } from "../styles/template/page_style";
import { styles } from "../styles/mypage";
import AsyncStorage from "@react-native-async-storage/async-storage";

import Icon from 'react-native-vector-icons/AntDesign';
import IconLeaf from 'react-native-vector-icons/FontAwesome';
import IconList from 'react-native-vector-icons/Feather'
import Session from '../util/session';
import FunctionUtil from '../util/libraries_function';


class MyPage extends Component {
  constructor(props) {
    super(props);
    this.idRef = React.createRef();
    this.passwordRef = React.createRef();
  }

  //현재 설정된 로그인관련 정보를 가져와 AsyncStorage에 저장하고 앱 종료
  logout() {
    FunctionUtil.getLoginType().then((response) => {
      Session.clear();
      //console.log('로그아웃 후 AsyncStorage에 저장할 값 = ', response);
      //console.log('로그아웃 후 Session에 저장된 값 = ',Session.getAllItem());
      AsyncStorage.setItem('userInfo', JSON.stringify(response));
      BackHandler.exitApp();
  });}


  goSalesListScreen = () => {
    this.props.navigation.navigate('SalesList')
  }
  goBuyListScreen = () => {
    this.props.navigation.navigate('BuyList')
  }
  goPickListScreen = () => {
    this.props.navigation.navigate('PickList')
  }
  goEditProfileScreen = () => {
    this.props.navigation.navigate('EditProfile');
  }

  goExitApp=()=> {
    Alert.alert(
      '주의',
      '로그아웃하고 앱을 종료합니다.',
      [
        { text: '취소', onPress: () => { } },
        { text: '확인', onPress: () => {this.logout()}},
      ],
      { cancelable: false });
    return true;
  }

  render() {
    const {companyName,companyAddress,companyNo} = Session.getUserInfoItem();
    const displayCompanyNo = companyNo.slice(0, 3) + "-" + companyNo.slice(3, 5) + "-" + companyNo.slice(5, 10);
    return (
      <>

        <View style={template.baseContainer}>

          {/*내정보 */}
          <View style={styles.viewHeaderLayout}>
            <View style={styles.container}>
              <View style={styles.item1}>
                <Text style={styles.name_text}>{companyName}</Text>
                <TouchableOpacity onPress={this.goEditProfileScreen}><Text style={styles.number_text}>{displayCompanyNo}</Text></TouchableOpacity>
                <Text>{companyAddress}</Text>
              </View>

              <View style={styles.item2}>
                <TouchableOpacity style={styles.btn} activeOpacity={0.8}>
                  <Icon name="setting" size={30} color={'black'}></Icon>
                  <Text style={styles.btn_text}>설정</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.btn} activeOpacity={0.8}>
                  <IconLeaf name="leaf" size={30} color={'#1BAC33'}></IconLeaf>
                  <Text style={styles.btn_text}>탄소포인트</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.btn_pay} activeOpacity={0.8}>
                  <Icon name="creditcard" size={30} color={'black'}></Icon>
                  <Text style={styles.btn_text}>결제정보</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>

          {/*설정 */}
          <View style={styles.viewBodyLayout}>
            <TouchableOpacity onPress={this.goSalesListScreen}>
              <View style={styles.btn_select}>
                <View style={styles.textView}>
                  <IconList name="file-text" size={20} color={'black'}></IconList>
                  <Text style={styles.btn_select_text}>   판매내역</Text>
                </View>
                <View style={styles.iconView}>
                  <Icon name="right" size={20} color={'black'}></Icon>
                </View>
              </View>
            </TouchableOpacity>

            <TouchableOpacity onPress={this.goBuyListScreen}>
              <View style={styles.btn_select}>
                <View style={styles.textView}>
                  <IconList name="shopping-bag" size={20} color={'black'}></IconList>
                  <Text style={styles.btn_select_text}>   구매내역</Text>
                </View>
                <View style={styles.iconView}>
                  <Icon name="right" size={20} color={'black'}></Icon>
                </View>
              </View>
            </TouchableOpacity>

            <TouchableOpacity onPress={this.goPickListScreen}>
              <View style={styles.btn_select}>
                <View style={styles.textView}>
                  <IconList name="heart" size={20} color={'black'}></IconList>
                  <Text style={styles.btn_select_text}>   관심목록</Text>
                </View>
                <View style={styles.iconView}>
                  <Icon name="right" size={20} color={'black'}></Icon>
                </View>
              </View>
            </TouchableOpacity>
          </View>

          {/*로그아웃 */}
          <View style={styles.viewBottomLayout}>
            <TouchableOpacity activeOpacity={0.8} style={styles.btn_logout} onPress={this.goExitApp}>
              <Text style={styles.btn_logout_text}>로그아웃</Text>
            </TouchableOpacity>
          </View>

        </View>

      </>
    );
  }

}
export default MyPage;