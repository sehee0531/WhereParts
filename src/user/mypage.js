import React, { Component } from 'react';
import {Text, View, TouchableOpacity, TextInput, Alert, } from 'react-native';
import {template} from "../styles/template/page_style";
import { styles } from "../styles/mypage";
import AsyncStorage from "@react-native-async-storage/async-storage";

import Icon from 'react-native-vector-icons/AntDesign';
import IconLeaf from 'react-native-vector-icons/FontAwesome';
import IconList from 'react-native-vector-icons/Feather'
import { ScrollView } from 'react-native-gesture-handler';


class MyPage extends Component {
  constructor(props) {
    super(props);
    this.idRef = React.createRef();
    this.passwordRef = React.createRef();
    this.state = {

      userID:[],
      idError: true,
      passwordError: true,
      confirmreg: true,
      companyNo: '',
      passwd: '',
    }
  }

  componentDidMount(){
    this.getCompanyNumber().then(() => {
      this.setState({userID:this.state.userID[0]})
      console.log(this.state.userID[0]);
  });
  }

  async getCompanyNumber() {
    let obj = await AsyncStorage.getItem('obj')
    let parsed =JSON.parse(obj);
    if(obj!== null){
        this.state.userID.push(parsed.companyNo);
    }
    else{
        return false;
    }
  }

  logout = async () => {
    try {
        AsyncStorage.clear();
        console.log("로그아웃 완료 다시 로그인");
        this.props.navigation.navigate('Login');

      } catch (error) {
        console.log(error);
      }
  };

  goSalesListScreen=()=>{
    this.props.navigation.navigate('SalesList')
  }
  goBuyListScreen=()=>{
    this.props.navigation.navigate('BuyList')
  }
  goPickListScreen=()=>{
    this.props.navigation.navigate('PickList')
  }

  render() {
    return (
      <>
      
          <View style={template.total_container}>
           
             {/*내정보 */}
              <View style={styles.viewHeaderLayout}>
                <View style={styles.container}>
                   <View style={styles.item1}>
                        <Text style={styles.name_text}>엠카즈 정비소</Text>
                        <Text style={styles.number_text}>{this.state.userID.slice(0,3)}-{this.state.userID.slice(3,5)}-{this.state.userID.slice(5,10)}</Text>
                        <Text>부산광역시 해운대구 우동 128,</Text>
                        <Text>(가나다빌딩, 1005호)</Text>
                   </View>

                    <View style={styles.item2}>
                      <TouchableOpacity style={styles.btn} activeOpacity={0.8}>
                        <Icon name="setting" size={30} color={'black'}></Icon>
                        <Text style={styles.btn_text}>설정</Text>
                      </TouchableOpacity>

                      <TouchableOpacity style={styles.btn} activeOpacity={0.8}>
                        <IconLeaf name="leaf" size={30} color={'#1BAC33'}></IconLeaf>
                        <Text  style={styles.btn_text}>탄소포인트</Text>
                      </TouchableOpacity>

                      <TouchableOpacity style={styles.btn_pay} activeOpacity={0.8}>
                        <Icon name="creditcard" size={30} color={'black'}></Icon>
                        <Text  style={styles.btn_text}>결제정보</Text>
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
                    <TouchableOpacity activeOpacity={0.8} style={styles.btn_logout} onPress={this.logout}>
                      <Text style={styles.btn_logout_text}>로그아웃</Text>
                    </TouchableOpacity>
              </View>
            
          </View>
          
      </>


    );
  }

}
export default MyPage;